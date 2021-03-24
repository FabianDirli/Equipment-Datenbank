import express from "express"
import bodyParser from "body-parser"
import mysql from "mysql"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import session from "express-session"
import jwt from "jsonwebtoken"

const app = express();

app.use(express.json());    //Express mitteilen, dass JSON verwendet wird.
app.use(cookieParser());    //Express mitteilen, dass Cookies verwendet werden,
app.use(bodyParser.urlencoded({ extended: true}));  //Express mitteilen, dass POST Abfragen mit Daten im Body vorhanden sind

//Express mitteilen, dass Sessions verwendet werden
app.use(session({          
    key: "userId",
    secret: "TheBoxKollektiv",
    resave: false,
    saveUninitialized: false,
}))

//Datenbank Verbindung
const database = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "TBK"
})


//Frontend Files zur Verfügung stellen
app.use(express.static("./frontend"));
app.get('/', function (req, res, next) {
    res.sendFile(path.resolve('./frontend/index.html'));
});



//User registrien
app.post("/api/sign-up", (request, response) => {
    var user = request.cookies["username"];
    var token = request.cookies["token"];

    var username = request.body.username;
    var password = request.body.password;

    //JWT Token verifizieren
    jwt.verify(token, "TheBoxKollektiv", (err, decoded) => {
        if(err) {
            console.log(err);
            response.json({"status": "error", 
                    "message": "Could not verify token!"
                })
        } else {
            //Datenbankabfrage ob der User der einen neuen User erstellen möchte vorhanden ist
            database.query("SELECT * FROM accounts WHERE username = ?", [user], (err, res) => {
                if(err) {
                    console.log(err);
                    response.json({"status": "error", 
                             "message": "Query error!"
                    })
                } else {
                    if(res.length == 0) {
                        response.json({"status": "error", 
                        "message": "User not exist!"
                        }) 
                    } else {
                        var role = Object.assign({}, res)[0].role; //Prüfen ob der User die erforderlichen Rechte hat
                        if(role == 'admin') {
                            if(username && password) {  //Überprüfe ob Username und Password definiert sind
                                //Datenbankabfrage ob der zu erstellende User bereits vorhanden ist.
                                database.query("SELECT * FROM accounts WHERE username = ?", [username], (err, res) => {
                                    if(err) {   //Datenbank Error
                                        console.log(err);
                                        response.json({"status": "error", "message": "query error"});            
                                    } else {
                                        if(res.length == 0) {
                                            //Hashen des Passwortes
                                            bcrypt.hash(password, 3, (err, hash) => {
                                                if(err) {   //Passwort hash Error
                                                    console.log(err);
                                                    response.json({"status": "error", "message": "bcrypt hash error"})
                                                } else {
                                                    //Neuen user in der Datenbank anlegen
                                                    database.query("INSERT INTO accounts (username, password, role) VALUES (?, ?, ?)", [username, hash, role], (err, res) => {
                                                        if(err) {   //Datenbank Error
                                                            console.log(err);
                                                            response.json({"status": "error", "message": "query error"})
                                                        } else {    //User wurde hinzugefügt
                                                            response.json({"status": "successfull", "message": "sucessfully created user"})
                                                        }
                                                    })
                                                }
                                            })
                                        } else {    //Der User existiert bereits
                                            response.json({"status": "userExists", "message": "User already exists"})
                                        }
                                    }
                                }) 
                            } else {    //Username oder Password sind nicht eingegeben worden
                                response.json({"status": "error", "message": "No username or password were entered"})
                            }
                        } else {    //Der User besitzt nicht die erforderlichen Rechte um einen neuen User anzulegen
                            response.json({"status": "roleError", "message": "User is not allowed to create new user"})
                        }
                    } 
                } 
            })
        }
    });
})

//Login Routine
app.post("/api/login", (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if(username && password) {  //Überprüfe ob Username und Passwort definiert sind
        //Datenbankabfrage ob User vorhanden ist.
        database.query("SELECT * FROM accounts WHERE username = ?", [username], (err, res) => {
            if(err) {   //Datenbank Error
                console.log(err);
                response.json({"status": "error", "message": "query error"});            
            } else {    
                if(res.length == 0) {   //Kein User gefunden
                    response.json({"status": "error", "message": "No username was found"});
                } else {
                    //Passwörter vergleichen
                    bcrypt.compare(password, res[0].password, (err, result) => {
                        if(err) {
                            //Passwort Hash Error
                            console.log(err);
                            response.json({"status": "error", "message": "bcrypt error"});
                        } else {
                            if(result){
                                //Passwörter stimmen übrein
                                var token = jwt.sign({ //Neuen Token generieren
                                    data: username,
                                    exp: Math.floor(Date.now() / 1000) + (5 * 60)
                                }, "TheBoxKollektiv");                            
                                
                                response.cookie("token", token, {httpOnly: true}); //Token als Cookie setzen
                                response.cookie("username", username, {httpOnly: true});    //Username als Cookie setzten                         
                                
                                response.json({"status": "successfull",
                                                "message": "sucessfully logged in"
                                                })
                            } else {
                                //Passwörter stimmen nicht überein
                                response.json({"status": "error", "message": "Password doesnt match"});
                            }
                        }
                    });
                }
            }
        })
    } else {    
        //Username oder Password sind undefiniert
        response.json({"status": "error", "message": "No username or password were entered"});
    }
})

//Authentifizierungs Routine, überprüft ob User eingelogt ist.
app.post("/api/auth", (req, res) => {
    
    var token = req.cookies["token"];   //Token aus Cookies entnehmen
    var username = req.cookies["username"]; //Username aus Cookies entnehmen
   
    //JWT Token verifizieren
    jwt.verify(token, "TheBoxKollektiv", (err, decoded) => {
        if(err) {   
            //JWT Error
            res.json({"status": "error", 
                    "message": "Could not verify token!"
                })
        } else {
            //Neues Token generieren
            var token = jwt.sign({
                data: decoded,
                exp: Math.floor(Date.now() / 1000) + (5 * 60)
            }, "TheBoxKollektiv");  

            res.cookie("token", token, {httpOnly: true});   //Neues Token als Cookie speichern
            res.cookie("username", username, {httpOnly: true}) //Username als Cookie speichern

            res.json({
                "status": "successfull",
                "message": "Sucessfully logged in!",
            })
        }
    });
})

//User Logout 
app.get("/api/logout", (request, response) => {
    response.clearCookie("token");  //Token Cookie löschen
    response.clearCookie("username"); //Username Cookie löschen

    response.json({
        "status": "successfull",
        "message": "Successfully logged out"
    });
})

//Equipment Datenbankabruf
app.get("/api/getequipment", (request, response) => {
    var category_id = request.query.category_id; 
    var rented = request.query.rented;
    var warehouse_id = request.query.warehouse_id;
    var id = request.query.id;

    //Query zusamennstellen, je nachdem welche Filter gesetzt sind
    var query = "SELECT * FROM equipment"
    //Wenn ID definiert ist, nach ID suchen, sonst nach Filter
    if(id == undefined) {
        if(category_id != 0 || rented != "alle" || warehouse_id != 0)
            query += " where";
          
        if(category_id != 0) {
            query += " category_id='" + category_id + "'";
            if(rented != "alle" || warehouse_id != 0) {
                query += " AND";
            }
        }

        if(rented != "alle") {
            if(rented == "Ja")
                query += " customer_id!='0'"
            else 
                query += " customer_id='0'";
        }

        if(warehouse_id != 0)
            query += " warehouse_id='" + warehouse_id + "'";
    } else {
        query += " where id=" + id;
    }
    //Datenbank Abfrage
    database.query(query, (err, res) => {
        if(err) {
            //Datenbank Error
            console.log(err);
            response.json({
                "status": "error",
                "message": "Query error"
            })
        } else {
            if(res.length == 0) {
                //Keine Daten vorhanden
                response.json({
                    "status": "noData",
                    "message": "no data wos found",
                })
            } else {
                //Daten erfolgreich abgefragt
                response.json({
                    "status": "successfull",
                    "message": "successfully grabbed data from database",
                    data: res
                })
            }

        }
    })
})

//Lager abfragen
app.get("/api/getwarehouse", (request, response) => {
    var id = request.query.id;
    var name = request.query.name

    //Wenn Location übergeben wird danach suchen,
    //Sonst nach id suchen wenn diese übergeben wird,
    //Sonst alle Daten der Datenbank ausgeben
    if(name !== undefined) {
        //Datenbank abfrage 
        database.query("SELECT id from warehouse where location = ?", [name], (err, res) => {
            if(err) {
                //Datenbank Error
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                if(res.length === 0) {
                    //Kein Lager mit der gegebenen Location gefunden
                    response.json({
                        "status": "error",
                        "message": "no warehouse_id was found",
                    });
                } else {
                    //Lager gefunden
                    response.json({
                        "status": "successfull",
                        "message": "successfully grabbed data from database",
                        data: res
                    })
                }
            }
        })
    } else if (id !== undefined) {
        //Datenbankabfrage
        database.query("SELECT location from warehouse where id = ?", [id], (err, res) => {
            if(err) {
                //Datenbank abfrage
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                if(res.length === 0) {
                    //Kein Lager mit der gegebenen ID gefunden
                    response.json({
                        "status": "error",
                        "message": "no warehouse_id was found",
                    });
                } else {
                    response.json({
                        //Lager gefunden
                        "status": "successfull",
                        "message": "successfully grabbed data from database",
                        data: res
                    })
                }
            }
        })
    } else {
        //Datenbank abfrage
        database.query("SELECT * from warehouse", (err, res) => {
            if(err) {
                //Datenbank Error
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                if(res.length === 0) {
                    //Kein Lager gefunden
                    response.json({
                        "status": "error",
                        "message": "no warehouse_id was found",
                    });
                } else {
                    //Lager gefunden
                    response.json({
                        "status": "successfull",
                        "message": "successfully grabbed data from database",
                        data: res
                    })
                }
            }
        })
    } 
})

//Kunden abfragen
app.get("/api/getCustomer", (request, response) => {
    
    var id = request.query.id;

    //wenn ID übergeben danach in Customer Tabelle suchen, sonst alle zurückgeben
    if(id == undefined) {
        //Datenbank Abfrage
        database.query("SELECT id, lastName FROM customer", (err, res) => {
            if(err) {
                //Datenbank Error
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                if(res.length === 0) {
                    //Keine Daten gefunden
                    response.json({
                        "status": "error",
                        "message": "no warehouse_id was found",
                    });
                } else {
                    //Kunde gefunden
                    response.json({
                        "status": "successfull",
                        "message": "successfully grabbed data from database",
                        data: res
                    })
                }
            }
        })
    } else {    //nach spezifischer ID suchen
        database.query("SELECT id, lastName FROM customer WHERE id = ?", [id], (err, res) => {
            if(err) {
                //Datenbank Error
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                if(res.length === 0) {
                    //Keine Daten gefunden
                    response.json({
                        "status": "error",
                        "message": "no warehouse_id was found",
                    });
                } else {
                    //Daten erfolgreich gefunden
                    response.json({
                        "status": "successfull",
                        "message": "successfully grabbed data from database",
                        data: res
                    })
                }
            }
        })
    }

    
})

//Equipment ändern/hinzufügen/löschen
app.get("/api/equipment", (request, response) => {
    var type = request.query.type
    var name = request.query.name;
    var category_id = request.query.category_id;
    var manufacturer = request.query.manufacturer;
    var connector = request.query.connector;
    var output = request.query.output;
    var warehouse_id = request.query.warehouse_id;
    var id = request.query.id;
    var price = request.query.price;
    var customer_id = request.query.customer_id;
    var quantity = request.query.quantity;


    if(type == "edit") {
        //Equipment ändern
        database.query("UPDATE equipment SET name = ?, quantity = ?, category_id = ?, manufacturer = ?, connector = ?, output = ?, warehouse_id = ?, price = ?, customer_id = ? WHERE id = ?;", 
        [name, quantity, category_id, manufacturer, connector, output, warehouse_id, price, customer_id, id], (err, res) => {
            if(err) {
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                response.json({
                    "status": "successfull",
                    "message": "successfully changed data",
                })
            }
        })
    } else if(type == "delete") {
        //Equipment löschen
        database.query("DELETE FROM equipment WHERE id=?", [id], (err, res) => {
            if(err) {
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                response.json({
                    "status": "successfull",
                    "message": "successfully deleted data",
                })
            }
        })
    } else {
        //Equipment hinzufügen
        database.query("INSERT INTO equipment (name, quantity, category, manufacturer, connector, output, warehouse_id, price, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [name, quantity ,category, manufacturer, connector, output, warehouse_id, price, customer_id], (err, res) => {
            if(err) {
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                response.json({
                    "status": "successfull",
                    "message": "successfully inserted data",
                })
            }
        })
    } 
})

//Kategorie Tabelle abfragen
app.get("/api/getCategory", (request, response) => {
    var id = request.query.id;

    if(id != undefined) {
        //Kategory Tabelle abfragen nach spezifischer ID
        database.query("SELECT id, category from Category WHERE id=?", [id], (err, res) => {
            if(err) {
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                }) 
            } else {
                response.json({
                    "status": "successfull",
                    "message": "successfully grabbed data",
                    "data": res
                })
            }
        })
    } else {
        //Ganze Kategory Tabelle ausgeben
        database.query("SELECT id, category from Category", (err, res) => {
        if(err) {
            console.log(err);
            response.json({
                "status": "error",
                "message": "query error",
            })
        } else {
            response.json({
                "status": "successfull",
                "message": "successfully grabbed data",
                "data": res
            })
        }
    })
    }
    
})

//Kunden Tabelle abfragen
app.get("/api/getCustomer", (request, response) => {
    var id = request.query.id;

    if(id != undefined) {
        //Nach einzelnen Kunden suchen
        database.query("SELECT id, lastname from Customer WHERE id=?", [id], (err, res) => {
            if(err) {
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                }) 
            } else {
                response.json({
                    "status": "successfull",
                    "message": "successfully grabbed data",
                    "data": res
                })
            }
        })
    } else {
        //Alle Kunden zurückgeben
        database.query("SELECT id, lastName from Customer", (err, res) => {
            if(err) {
                console.log(err);
                response.json({
                    "status": "error",
                    "message": "query error",
                })
            } else {
                response.json({
                    "status": "successfull",
                    "message": "successfully grabbed data",
                    "data": res
                })
            }
        })
    }
})

//Kunde hinzufügen
app.get("/api/addCustomer", (request, response) => {

    var lastName = request.query.lastName;
    var firstName = request.query.firstName;
    var address = request.query.address;

    //Kunde in Datenbank einfügen
    database.query("INSERT INTO customer (firstName, lastName, address) VALUES (?, ?, ?)", [firstName, lastName, address], (err, res) => {
        if(err) {
            console.log(err);
            response.json({
                "status": "error",
                "message": "query error",
            })
        } else {
            response.json({
                "status": "successfull",
                "message": "successfully inserted data",
            })
        }
    })

}) 

//Lager hinzufügen
app.get("/api/addWarehouse", (request, response) => {

    var location = request.query.location;

    //Lager in Datenbank hinzufügem
    database.query("INSERT INTO warehouse (location) VALUES (?)", [location], (err, res) => {
        if(err) {
            console.log(err);
            response.json({
                "status": "error",
                "message": "query error",
            })
        } else {
            response.json({
                "status": "successfull",
                "message": "successfully inserted data",
            })
        }
    })

})

//Server soll auf Port 80 laufen
app.listen(80, () => {
    console.log("Listening on port 80");
})
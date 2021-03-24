import { Button, MenuItem, TextField, ThemeProvider } from "@material-ui/core";
import Axios from "axios";
import { useEffect, useState } from "react";
import useStyle from "./editequipmentStyling"
import Theme from "../theme"
import { useHistory } from "react-router";



function EditEquipment (props) {
 
    const [id, setId] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [name, setName] = useState();
    const [category_id, setCategory_id] = useState();
    const [manufacturer, setManufacturer] = useState();
    const [connector, setConnector] = useState();
    const [output, setOuput] = useState();
    const [warehouse_id, setWarehouse_id] = useState();
    const [price, setPrice] = useState();
    const [customer_id, setCustomer_id] = useState();

    const [warehouseList, setWarehouseList] = useState(null);
    const [customerList, setCustomerList] = useState(null);
    const [categoryList, setCategoryList] = useState(null);

    const [error, setError] = useState(false);

    const style = useStyle();

    const history = useHistory();

    useEffect(() => {
        if(props.location.search.includes("id")) {
            Axios.get("/api/getEquipment" + props.location.search)
            .then((res) => {
                if(res.data.status === "error") {
                    setId(null);
                    setError(true);
                } else {
                    setName(res.data.data[0].name);
                    setQuantity(res.data.data[0].quantity);
                    setCategory_id(res.data.data[0].category_id);
                    setManufacturer(res.data.data[0].manufacturer);
                    setConnector(res.data.data[0].connector);
                    setOuput(res.data.data[0].output);
                    setWarehouse_id(res.data.data[0].warehouse_id);
                    setPrice(res.data.data[0].price);
                    setCustomer_id(res.data.data[0].customer_id);
                    setId(res.data.data[0].id);
                    setError(false);
                }
            })
            .catch((err) => {
                setError(true);
                console.log(err);
            });
        } else {
            setId("");
        }
        

        Axios.get("/api/getWarehouse")
        .then((res) => {
            if(res.data.status === "error") {
                setWarehouseList(null);
                setError(true);
            } else {
                setWarehouseList(res.data.data);
                setError(false);
            }
        })
        .catch((err) => {
            console.log(err);
        });

        Axios.get("/api/getCustomer")
        .then((res) => {
            if(res.data.status === "error") {
                setCustomerList(null);
                setError(true);
            } else {
                setCustomerList(res.data.data);
                setError(false);
            }
        })
        .catch((err) => {
            setError(true);
            console.log(err);
        });

        Axios.get("/api/getCategory")
        .then((res) => {
            if(res.data.status === "error") {
                setCategoryList(null);
            } else {        
                setCategoryList(res.data.data);
            }
        })
        .catch((err) => {
            console.log(err);   
        })

    }, [props.location.search])

    function submitChanges () {
        var type
        if(props.location.search.includes("id")) {
            type = "edit";
        } else {
            type = "add";
        }
        

        Axios.get("/api/equipment?type=" + type + "&id=" + id + "&name=" + name + "&quantity=" + quantity + "&category_id=" + category_id + "&manufacturer=" + manufacturer + "&connector=" + connector + "&output=" + output + 
            "&warehouse_id=" + warehouse_id + "&price=" + price + "&customer_id=" + customer_id)
        .then((res) => {
            if(res.data.status === "successfull") {
                history.push("/equipment");
                setError(false);
            } else {
                setError(true);
            }
        })
        .catch((err) => {
            console.log(err);
            setError(true);
        })
    }
    function submitDelete () {

        Axios.get("/api/equipment?type=delete&id=" + id)
        .then((res) => {
            if(res.data.status === "successfull") {
                history.push("/equipment");
                setError(false);
            } else {
                setError(true);
            }
        })
        .catch((err) => {
            console.log(err);
            setError(true);
        })
    }

    if(id === null) {
        return ("");
    }

    return(
        <div className={style.editEquipmentMainFrame}>
            <ThemeProvider theme={Theme}>
                <TextField className={style.textfield} defaultValue={name} variant="outlined" label="Name" onChange={(e) => {setName(e.target.value)}}/>
                <TextField className={style.textfield} defaultValue={quantity} variant="outlined" label="Stückzahl" onChange={(e) => {setQuantity(e.target.value)}}/>
                <TextField
                    defaultValue={category_id}
                    className={style.textfield}
                    select
                    label="Kategory"
                    value={category_id}
                    onChange={(e) => {setCategory_id(e.target.value)}}
                    >
                        {categoryList !== null ?
                        categoryList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.category}
                        </MenuItem>
                        ))
                        : <></>
                    }
                </TextField>
                <TextField className={style.textfield} defaultValue={manufacturer} variant="outlined" label="Hersteller" onChange={(e) => {setManufacturer(e.target.value)}}/>
                <TextField className={style.textfield} defaultValue={connector} variant="outlined" label="Stecker" onChange={(e) => {setConnector(e.target.value)}}/>
                <TextField className={style.textfield} defaultValue={output} variant="outlined" label="Leistung" onChange={(e) => {setOuput(e.target.value)}}/>
                <TextField
                    defaultValue={warehouse_id}
                    className={style.textfield}
                    select
                    label="Lager"
                    value={warehouse_id}
                    onChange={(e) => {setWarehouse_id(e.target.value);}}
                    >
                        {warehouseList !== null ?
                        warehouseList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.location}
                        </MenuItem>
                        ))
                        : <></>
                    }
                </TextField>
                <TextField className={style.textfield} defaultValue={price} variant="outlined" label="Preis" onChange={(e) => {setPrice(e.target.value)}}/>
                <TextField
                    defaultValue={customer_id}
                    className={style.textfield}
                    select
                    label="Kunde"
                    value={customer_id}
                    onChange={(e) => {setCustomer_id(e.target.value)}}
                    >
                        {customerList !== null ?
                        customerList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.lastName}
                        </MenuItem>
                        ))
                        : <></>
                    }
                </TextField>
                <Button 
                    className={style.button}
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    onClick={submitChanges}
                >
                    Sumbit
                </Button>
                <Button 
                    className={style.button}
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    onClick={submitDelete}
                >
                    Delete
                </Button>
                {error && <h3>An Error Occured</h3>}
            </ThemeProvider>
        </div>
    )

}

export default EditEquipment;
import { Button, makeStyles, TextField, ThemeProvider, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import { useState } from "react";
import Theme from "../theme"






function AddWarehouse (props) {


    const [location, setLocation] = useState();
    const [error, setError] = useState(false);
    const [successfull, setSuccessfull] = useState();


    function submit () {
        Axios.get("/api/addWarehouse?location=" + location)
        .then((res) => {
            if(res.data.status === "successfull") {
                setSuccessfull(true);
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

    const useStyle = makeStyles(() => ({
        headerElement: {
            minWidth: "180px",
            marginLeft: "50px"
        },
        addWarehouseMainFrame: {
            width: "50vw",
            marginLeft: "25vw",
            marginTop: "5vh"
        },
        textfield: {
            width: "50vw",
            marginTop: "25px"
        }, 
        button: {
            marginLeft: "40%",
            width: "40%",
            marginTop: "5vh",
            width: "20%"
        }, 
        headline: {
            fontSize: "30px",
            textAlign: "center"
        }
        
    }))

    const style = useStyle();



    return (
        <div className={style.addWarehouseMainFrame}>
            <ThemeProvider theme={Theme}>
                <Typography variant="h2" className={style.headline}>Lager hinzufügen</Typography>
                <TextField className={style.textfield} variant="outlined" label="Lagerbezeichnung" onChange={(e) => {setLocation(e.target.value)}}/>
                <Button 
                    className={style.button}
                    variant="contained" 
                    color="primary" 
                    type="submit" 
                    onClick={submit}
                >
                    Submit
                </Button>
                {successfull && <Alert severity="success">User has been created!</Alert>}
                {error && <h3>An Error Occured</h3>}
            </ThemeProvider>
        </div>
    )

}

export default AddWarehouse;
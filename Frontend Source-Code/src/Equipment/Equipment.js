import { Button, TableCell } from "@material-ui/core";
import { useHistory } from "react-router";
import Axios from "axios";
import { useEffect, useState } from "react";

function Equipment (props) {

    const history = useHistory();
    const [warehouse, setWarehouse] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [category, setCategory] = useState(null);


    
    function redirect(){
        history.push("/editEquipment?id=" + props.data.id);
    }
    useEffect(() => {
        props.categoryList.map((element) => {
            if(element.id === props.data.category_id)
                setCategory(element.category);
        })
        props.customerList.map((element) => {
            if(element.id === props.data.customer_id)
                setCustomer(element.lastName);
        })

        Axios.get("/api/getWarehouse?id=" + props.data.warehouse_id)
        .then((res) => {
            if(res.data.status !== "successfull") {
                setWarehouse(null);
            } else {
                setWarehouse(res.data.data[0].location);
            }
        })
        .catch((err) => {
            console.log(err);
            setWarehouse(null);
        })
    }) 

    return(
        (category !== null && customer !== null && warehouse!== null) ?

        <>  
            <TableCell>{category}</TableCell> 
            <TableCell>{props.data.name}</TableCell> 
            <TableCell>{props.data.manufacturer}</TableCell> 
            <TableCell>{props.data.connector}</TableCell> 
            <TableCell>{props.data.output}</TableCell> 
            <TableCell>{props.data.quantity}</TableCell> 
            <TableCell>{warehouse}</TableCell> 
            <TableCell>{props.data.price}</TableCell> 
            <TableCell>{customer}</TableCell> 
            <TableCell><Button variant="contained" onClick={redirect}>EDIT</Button></TableCell> 
        </>
        :
        <> </>
    )

}

export default Equipment;
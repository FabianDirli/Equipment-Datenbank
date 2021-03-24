import { Table, TableCell, TableHead, TableRow } from "@material-ui/core";
import Axios from "axios";
import { useEffect, useState } from "react";
import Equipment from "./Equipment";
import Header from "./Header";

function EquipmentContainer () {

    const [data, setData] = useState([]);
    const [category_id, setCategory_id] = useState(0);
    const [rented, setRented] = useState("alle");
    const [warehouse_id, setWarehouse_id] = useState(0);
    const [error, setError] = useState(false);
    const [submitEdit, setSubmitEdit] = useState(false);
    const [warehouseList, setWarehouseList] = useState(null);
    const [categoryList, setCategoryList] = useState(null);
    const [customerList, setCustomerList] = useState(null);

    useEffect(() => {
        
        Axios.get("/api/getWarehouse")
        .then((res) => {
            if(res.data.status === "error") {
                setWarehouseList(null);
            } else {
                setWarehouseList(res.data.data);
            }
        })
        .catch((err) => {
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

        Axios.get("/api/getCustomer")
        .then((res) => {
            if(res.data.status === "error") {
                setCustomerList(null);
            } else {       
                setCustomerList(res.data.data);
            }   
        })
        .catch((err) => {
            console.log(err);   
        })

        Axios.get("/api/getequipment?category_id=" + category_id + "&rented=" + rented + "&warehouse_id=" + warehouse_id)
        .then((res) => {
            if(res.data.status !== "successfull") {
                setData(null);
            } else {
                setData(res.data.data);
            }
        })
        .catch((err) => {
            console.log(err);
            setError(true);
        })

        
        
    }, [category_id, rented, warehouse_id])
    

    return(
        
        (categoryList !== null && customerList !== null && warehouseList !== null) ?
        
        <div>
    
            <Header categoryList={categoryList} warehouseList={warehouseList} category_id={category_id} setCategory_id={setCategory_id} rented={rented} setRented={setRented} warehouse_id={warehouse_id} 
                setWarehouse_id={setWarehouse_id}/> 

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Kategorie</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Hersteller</TableCell>
                        <TableCell>Stecker</TableCell>
                        <TableCell>Leistung</TableCell>
                        <TableCell>Stückzahl</TableCell>
                        <TableCell>Lager</TableCell>
                        <TableCell>Preis</TableCell>
                        <TableCell>Vermietet</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                {
                    data !== null ?
                        data.map((element) => {
                            return(
                                <TableRow><Equipment data={element} categoryList={categoryList} warehouseList={warehouseList} customerList={customerList} setSubmitEdit={setSubmitEdit}/></TableRow>
                            )
                        }) : <h1>kein Equipment gefunden</h1>    
                }
            </Table>

            {error && <h1>An Error has occured</h1>}

        </div>
        :
        <>
        </>
                
    )
    

}

export default EquipmentContainer;
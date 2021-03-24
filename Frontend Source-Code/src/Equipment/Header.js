import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import { Button, FormControl, InputLabel } from "@material-ui/core";
import { useHistory } from "react-router";
import Axios from "axios";



import useStyle from "./headerStyle.js"
import { useEffect, useState } from "react";


function Header(props) {  

    const style = useStyle()

    const history = useHistory();

    
   
    function addEquipment() {
        history.push("/addEquipment");
    }

    return(
        <div>
            <div className={style.header}>
                <FormControl>
                    <InputLabel className={style.headerElement}>Kategorie</InputLabel>
                    <Select 
                    className={style.headerElement}
                    variant="filled"
                    select
                    value={props.category_id}
                    onChange={(e) => {props.setCategory_id(e.target.value);}}
                    >
                        {props.categoryList !== null ?
                        props.categoryList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.category}
                        </MenuItem>
                        ))
                        : <></>
                    }
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel className={style.headerElement}>Vermietet</InputLabel>
                    <Select 
                    className={style.headerElement}
                    variant="filled"
                    value={props.rented}
                    onChange={(e) => {
                        props.setRented(e.target.value)
                    }}
                    >
                        <MenuItem value="Ja">Ja</MenuItem>
                        <MenuItem value="Nein">Nein</MenuItem>
                        <MenuItem value="alle">Alle</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel className={style.headerElement}>Lager</InputLabel>
                    <Select 
                    className={style.headerElement}
                    variant="filled"
                    value={props.warehouse_id}
                    onChange={(e) => {
                         props.setWarehouse_id(e.target.value)
                    }}
                    >
                        {props.warehouseList !== null ?
                        props.warehouseList.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                        {option.location}
                        </MenuItem>
                        ))
                        : <></>
                    }
                    </Select>
                </FormControl>
                <Button className={style.button} variant="contained" onClick={addEquipment}>+</Button>
            </div>
        </div>
    )
}

export default Header;
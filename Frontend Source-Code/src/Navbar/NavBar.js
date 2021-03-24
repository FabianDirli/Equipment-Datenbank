
import { ThemeProvider, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Theme from "../theme"

import "./navbar.css"

function NavBar () {
    
    var pages = [["Equipment", "/equipment"], ["Add Customer", "/addCustomer"], ["Add Warehouse", "/addWarehouse"], ["Add User", "/addUser"], ["Log Out", "/logout"]];

    return(
        <>
            <ThemeProvider theme={Theme}>   
                <ul className="navbar">
                {
                    pages.map((element, key) => {
                        return(
                            <li className="element">
                                <Link className="link" to={element[1]}>
                                    <Typography variant="body1">
                                        {element[0]}
                                    </Typography>
                                </Link>
                            </li>
                        )
                    })
                }
                </ul>
            </ThemeProvider>
        </>
    )
}

export default NavBar;
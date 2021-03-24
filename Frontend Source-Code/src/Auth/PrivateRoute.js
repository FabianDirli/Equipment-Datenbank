import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Axios from "axios"
import NavBar from '../Navbar/NavBar';

const PrivateRoute = ({component: Component,...rest}) => {

    const [loggedIn, setLoggedIn] = useState();

    const checkLogin = () => {
        Axios.post("/api/auth")
        .then((res) => {
            if(res.data.status === "successfull") {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        })
        .catch((err) => {
            console.log(err);
            setLoggedIn(false);
        })
    }


    useEffect(() => {
        checkLogin();
    }, [])

    if(loggedIn !== undefined) {
        return (
            <Route {...rest} render={props => (
                loggedIn ?
                <>
                    <NavBar/>
                    <Component {...props} />
                </>
                : <Redirect to="/" />
            )}/>
        );
    } else {
        return (
            <>
            </>
        )
    }
};



export default PrivateRoute;
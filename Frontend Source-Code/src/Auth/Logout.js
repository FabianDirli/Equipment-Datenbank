import Axios from "axios";
import { useEffect } from "react";
import { Redirect } from "react-router-dom";

function Logout() {

    useEffect(() => {
        Axios.get("/api/logout");
    });

    return (
        <div>
            <Redirect to="/"/>
        </div>
      );
}
  
export default Logout;
  
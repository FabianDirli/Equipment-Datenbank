import { HashRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Auth/PrivateRoute"
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import EquipmentContainer from "./Equipment/EquipmentContainer";
import EditEquipment from "./Equipment/EditEquipment";
import AddCustomer from "./Customer/AddCustomer";
import AddWarehouse from "./Warehouse/AddWarehouse";
import AddUser from "./Auth/AddUser";



function App() {

  return (
    <>
      <Router>
        <div className="App">
          <Switch>
            <Route 
              path='/' 
              exact
              component={Login}
              />
            <Route 
              path='/login' 
              exact 
              component={Login}
              />
            <PrivateRoute 
              path='/logout' 
              exact 
              component={Logout}
              />
            <PrivateRoute
              path='/equipment'
              exact
              component={EquipmentContainer}
              />
            <PrivateRoute
              path='/editEquipment'
              exact
              component={EditEquipment}
              />
            <PrivateRoute
              path='/addEquipment'
              exact
              component={EditEquipment}
              />
            <PrivateRoute
              path='/addCustomer'
              exact
              component={AddCustomer}
              />
            <PrivateRoute
              path='/addWarehouse'
              exact
              component={AddWarehouse}
              />
            <PrivateRoute
              path='/addUser'
              exact
              component={AddUser}
              />
            <Route component={() => {return(<h1>404 NOT FOUND</h1>)}}/>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;

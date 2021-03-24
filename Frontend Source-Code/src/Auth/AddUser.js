import { useState } from "react";
import axios from "axios";
import Theme from "../theme"

import Button from '@material-ui/core/Button' 
import TextField from "@material-ui/core/TextField"
import { ThemeProvider } from "@material-ui/styles"
import { makeStyles, MenuItem, Typography } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';


const useStyle = makeStyles(() => ({
  page: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  input: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "35vh",
    flexWrap: "wrap"
  },
  button: {
    width: "40%"
  },
  loginFrame: {
    marginTop: "15vh",
    width: "30%",
  },
  error: {
    paddingTop: 150,
    height: "6%",
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  textField: {
    marginBottom: "25px",
    width: "100%"
  }
}))

function AddUser() {

  const styles = useStyle();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [role, setRole] = useState("user");
  const [roleError, setRoleError] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [successfull, setSuccessfull] = useState();
  const [userExists, setUserExists] = useState();
  const [error, setError] = useState();
  

  
  const submit = () => {

      if(password === confirmPassword) {
        axios.post("/api/sign-up", {
          username,
          password,
          role
        })
        .then((res) => {
          console.log(res);
            if(res.data.status === "successfull") {
              setSuccessfull(true);
            } else if(res.data.status === "userExists"){  
              setUserExists(true);
            } else if(res.data.status === "roleError"){  
              setRoleError(true);
            } else {
              setError(true);
            }
        })
        .catch((err) => {
            console.log(err);
        })
      } else {
        setConfirmPassword(false);
      }

      
  }


  return (
    <div className={styles.page}>
      <ThemeProvider theme={Theme}>
        <div className={styles.loginFrame}>
          <div className={styles.input}>
            <Typography variant="h2">User hinzufügen</Typography>
            <TextField
              className={styles.textField}
              variant="outlined"
              fullWidth
              required
              label="Username"
              autoFocus
              onChange = {(e) => {
                  setUsername(e.target.value);
              }}
            />
            <TextField
              className={styles.textField}
              variant="outlined"
              fullWidth
              required
              label="Password"
              
              type="password"
              onChange = {(e) => {
                  setPassword(e.target.value);
              }}
            />
            <TextField
              className={styles.textField}
              variant="outlined"
              fullWidth
              required
              label="Confirm Password"
              
              type="password"
              onChange = {(e) => {
                  setConfirmPassword(e.target.value);
              }}
            />
            <TextField
              className={styles.textField}
              select
              label="Rolle"
              value={role}
              onChange={(e) => {setRole(e.target.value)}}
              >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button className={styles.button}
              variant="contained" 
              color="primary" 
              type="submit" 
              onClick={submit}>
                Sign-Up User
              </Button>
          </div>
          <div className={styles.error}>
            {confirmPassword === false && <Alert severity="error">Passwords must match!</Alert>}
            {userExists === true && <Alert severity="error">User already exists</Alert>}
            {error === true && <Alert severity="error">Error!</Alert>}
            {successfull && <Alert severity="success">User has been created!</Alert>}
            {roleError && <Alert severity="error">You are not authorized to create a user!</Alert>}
          </div>
        </div>  
      </ThemeProvider>
    </div>
    );
}

export default AddUser;

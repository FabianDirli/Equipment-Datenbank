import { useState } from "react";
import axios from "axios";
import Theme from "../theme"

import Button from '@material-ui/core/Button' 
import TextField from "@material-ui/core/TextField"
import ThemeProvider from "@material-ui/styles/ThemeProvider"
import { makeStyles, Typography } from "@material-ui/core/";
import Alert from '@material-ui/lab/Alert';
import { Redirect } from "react-router-dom";

const useStyle = makeStyles(() => ({
  page: {
    display: "flex",
    justifyContent: "center",
  },
  input: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "35vh",
    flexWrap: "wrap",
  },
  button: {
    width: "40%"
  },
  loginFrame: {
    marginTop: "15vh",
    width: "30%",
  },
  error: {
    paddingTop: 30,
    height: "6%",
    width: "100%",
    display: "flex",
    justifyContent: "center"
  }
}))

function Login() {

  const styles = useStyle();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loggedIn, setLoggedIn] = useState();
  
  const submit = () => {
      axios.post("/api/login", {
          username,
          password
      })
      .then((res) => {
          if(res.data.status === "successfull") {
            setLoggedIn(true);  
          } else {  
            setLoggedIn(false);
          }
      })
      .catch((err) => {
          console.log(err);
      })
}



  return (
    <div className={styles.page}>
      <ThemeProvider theme={Theme}>
        <div className={styles.loginFrame}>
          <div className={styles.input}>
            <Typography variant="h2">Sign-in</Typography>
            <TextField
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
              variant="outlined"
              fullWidth
              required
              label="Password"
              
              type="password"
              onChange = {(e) => {
                  setPassword(e.target.value);
              }}
            />
            <Button className={styles.button}
              variant="contained" 
              color="primary" 
              type="submit" 
              onClick={submit}>
                Sign-In
            </Button>
          </div>
          <div className={styles.error}>
            {loggedIn === false && <Alert severity="error">Wrong username or password!</Alert>}
            {loggedIn === true && <Redirect to="/equipment"/>}
          </div>
        </div>  
      </ThemeProvider>
    </div>
  );
}

export default Login;

import React from "react";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import SuperServices from "../../services/super.services";

function withMyHook(MyComponent) {
  return function WrappedComponent(props) {
    const useStyles = makeStyles((theme) => ({
      root: {
        display: "flex",
        flexWrap: "wrap",
      },
      name: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: "2rem",
      },
      textField: {
        width: "100%",
      },
      button: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(5),
      },
    }));
    const classes = useStyles();
    return <MyComponent {...props} classes={classes} />;
  };
}

class NewAdmin extends React.Component {
  state = {
    name: "",
    nameError: "",
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
    repeatPassword: "",
    repeatPasswordError: "",
    phone: "",
    phoneError: "",
    image: null,
    imagePreview: "",
    open: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  validateEmail = () => {
    if (this.state.email.length === 0) {
      this.setState({
        emailError: "You cann't leave email empty!",
      });
      return false;
    } else {
      let emailFilter = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      let isEmail = emailFilter.test(this.state.email.toLowerCase());
      if (!isEmail) {
        this.setState({
          emailError: "You should enter a valid email address!",
        });
        return false;
      }
    }
    return true;
  };

  validatePassword = () => {
    let passwordError = "";
    if (!/[a-z]/.test(this.state.password)) {
      passwordError =
        passwordError + "\nyou should enter one Lowercase character at least!";
    }
    if (!/[A-Z]/.test(this.state.password)) {
      passwordError =
        passwordError + `\nyou should enter one Uppercase character at least!`;
    }
    if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(this.state.password)) {
      passwordError =
        passwordError + "\nyou should enter one Symbol(@#$%...) at least!";
    }
    if (this.state.password.length < 6) {
      passwordError =
        passwordError + "\nyou should enter 6 characters at least!";
    }
    if (passwordError.length > 0) {
      this.setState({ passwordError: passwordError });
      return false;
    }
    return true;
  };

  validateRepeatPassword = () => {
    if (this.state.repeatPassword !== this.state.password) {
      this.setState({
        repeatPasswordError: "you should enter the same password",
      });
      return false;
    }
    return true;
  };

  validateNumber = () => {
    if (this.state.phone !== "") {
      if (isNaN(parseInt(this.state.phone))) {
        this.setState({
          phoneError: "You should Enter a valid phone number!!",
        });
        return false;
      }
    } else {
      this.setState({
        phoneError: "You cann't leave phone number empty!",
      });
      return false;
    }
    return true;
  };

  validateName = () => {
    if (this.state.name.length === 0) {
      this.setState({
        nameError: "This field cann't be empty",
      });
      return false;
    }
    return true;
  };

  validateInput = (event) => {
    if (event) {
      switch (event.target.name) {
        case "name":
          this.validateName();
          break;
        case "phone":
          this.validateNumber();
          break;
        case "email":
          this.validateEmail();
          break;
        case "password":
          this.validatePassword();
          break;
        case "repeatPassword":
          this.validateRepeatPassword();
          break;
        default:
          break;
      }
    } else {
      if (
        this.validateName() &&
        this.validateNumber() &&
        this.validateEmail() &&
        this.validatePassword() &&
        this.validateRepeatPassword()
      )
        return true;
      else return false;
    }
  };

  handleImageChange = (event) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => this.setState({ imagePreview: e.target.result });
      reader.onerror = (err) => console.log(err);
      reader.readAsDataURL(event.target.files[0]);
      this.setState({ image: event.target.files[0] });
    }
  };

  handleSave = async () => {
    if (this.validateInput()) {
      const formData = new FormData();
      formData.append("name", this.state.name);
      formData.append("phone", this.state.phone);
      formData.append("email", this.state.email.toLowerCase());
      formData.append("password", this.state.password);
      formData.append("image", this.state.image);
      const result = await SuperServices.adminsServices.createNewAdmin(
        formData
      );
      if (result) {
        this.setState({
          name: "",
          nameError: "",
          email: "",
          emailError: "",
          password: "",
          passwordError: "",
          repeatPassword: "",
          repeatPasswordError: "",
          phone: "",
          phoneError: "",
          image: null,
          imagePreview: "",
        });
        this.props.handleChange(null, 0);
      } else {
        this.setState({ open: true });
      }
    } else {
      let myElement;
      if (this.state.nameError) {
        myElement = document.getElementById("name");
      }
      if (this.state.emailError) {
        myElement = document.getElementById("email");
      }
      if (this.state.phoneError) {
        myElement = document.getElementById("phone");
      }
      if (this.state.passwordError) {
        myElement = document.getElementById("password");
      }
      if (this.state.repeatPasswordError) {
        myElement = document.getElementById("repeatPassword");
      }
      if (myElement) {
        let topPos = myElement.offsetTop;
        document.getElementById("main").scrollTop = topPos;
      }
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message="Admin already registered"
          action={
            <React.Fragment>
              <IconButton
                size="medium"
                aria-label="close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        <Container>
          <div className={this.props.classes.root}>
            <div className={this.props.classes.name}>
              <TextField
                id="name"
                name="name"
                label="Name"
                type="text"
                value={this.state.name}
                onChange={this.handleChange}
                onBlur={this.validateInput}
                className={this.props.classes.textField}
                variant="outlined"
                helperText={
                  this.state.nameError
                    ? `${this.state.nameError}`
                    : `Please Enter Admin Name.`
                }
                error={this.state.nameError ? true : false}
              />
            </div>
            <div className={this.props.classes.name}>
              <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                onBlur={this.validateInput}
                className={this.props.classes.textField}
                variant="outlined"
                helperText={
                  this.state.passwordError
                    ? this.state.passwordError.split("\n").map((item, key) => {
                        return (
                          <span key={key}>
                            {item}
                            <br />
                          </span>
                        );
                      })
                    : `Please Enter Admin password.`
                }
                error={this.state.passwordError ? true : false}
              />
            </div>
            <div className={this.props.classes.name}>
              <TextField
                id="repeatPassword"
                name="repeatPassword"
                label="Confirm Password"
                type="password"
                value={this.state.repeatPassword}
                onChange={this.handleChange}
                onBlur={this.validateInput}
                className={this.props.classes.textField}
                variant="outlined"
                helperText={
                  this.state.repeatPasswordError
                    ? `${this.state.repeatPasswordError}`
                    : `Please Enter Admin Password Again.`
                }
                error={this.state.repeatPasswordError ? true : false}
              />
            </div>
            <div className={this.props.classes.name}>
              <TextField
                id="phone"
                name="phone"
                label="Phone Number"
                value={this.state.phone}
                onChange={this.handleChange}
                onBlur={this.validateInput}
                className={this.props.classes.textField}
                variant="outlined"
                helperText={
                  this.state.phoneError
                    ? `${this.state.phoneError}`
                    : `Please Enter Admin Phone Number.`
                }
                error={this.state.phoneError ? true : false}
              />
            </div>
            <div className={this.props.classes.name}>
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                onBlur={this.validateInput}
                className={this.props.classes.textField}
                variant="outlined"
                helperText={
                  this.state.emailError
                    ? `${this.state.emailError}`
                    : `Please Enter Admin Email.`
                }
                error={this.state.emailError ? true : false}
              />
            </div>
            <div style={{ width: "100%", marginTop: "2rem", display: "flex" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  variant="contained"
                  color="default"
                  component="label"
                  className={this.props.classes.button}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                  <input
                    type="file"
                    onChange={this.handleImageChange}
                    accept="image/*"
                    id="image"
                    hidden
                  />
                </Button>
                {this.state.imagePreview && (
                  <Button
                    variant="contained"
                    color="secondary"
                    className={this.props.classes.button}
                    onClick={() => {
                      this.setState({ imagePreview: null, image: "" });
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete Image
                  </Button>
                )}
              </div>
              {this.state.imagePreview && (
                <Image
                  src={this.state.imagePreview}
                  alt="image"
                  width={300}
                  height={250}
                />
              )}
            </div>

            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "2rem", backgroundColor: "#00BF00" }}
              startIcon={<SaveIcon />}
              onClick={this.handleSave}
            >
              Save
            </Button>
          </div>
        </Container>
      </>
    );
  }
}

export default withMyHook(NewAdmin);

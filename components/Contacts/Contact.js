import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";

function withMyHook(MyComponent) {
  return function WrappedComponent(props) {
    const useStyles = makeStyles((theme) => ({
      root: {
        display: "flex",
        flexWrap: "wrap",
      },
      title: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      },
      textField: {
        width: "49%",
      },
      button: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(5),
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
      },
      chips: {
        display: "flex",
        flexWrap: "wrap",
      },
      chip: {
        margin: 2,
      },
    }));
    const classes = useStyles();
    return <MyComponent {...props} classes={classes} />;
  };
}

class Contact extends React.Component {
  state = {
    _id: this.props._id || "",
    firstName: this.props.firstName || "",
    lastName: this.props.lastName || "",
    email: this.props.email || "",
    phone: this.props.phone || "",
    subject: this.props.subject || "",
  };

  render() {
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.title}>
            <TextField
              label="First Name"
              value={this.state.firstName}
              className={this.props.classes.textField}
              variant="outlined"
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              label="Last Name"
              value={this.state.lastName}
              className={this.props.classes.textField}
              variant="outlined"
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              label="Email"
              value={this.state.email}
              className={this.props.classes.textField}
              variant="outlined"
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              label="Phone"
              value={this.state.phone}
              className={this.props.classes.textField}
              variant="outlined"
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              label="Subject"
              value={this.state.subject}
              className={this.props.classes.textField}
              variant="outlined"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem", backgroundColor: "#00BF00" }}
            startIcon={<CloseIcon />}
            onClick={this.props.handleClose}
          >
            Close
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(Contact);

import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Save from "@material-ui/icons/Save";

import SuperServices from "../../services/super.services";

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
        width: "100%",
      },
    }));
    const classes = useStyles();
    return <MyComponent {...props} classes={classes} />;
  };
}

class Settings extends React.Component {
  state = {
    apiKey: "",
    apiKeyError: "",
    listID: "",
    listIDError: "",
    server: "",
    serverError: "",
  };

  componentDidMount() {
    const getSettings = async () => {
      const result = await SuperServices.settingsServices.getSettings();
      if (result.length > 0) {
        const { apiKey, listID, server } = result[0];
        if (apiKey) {
          this.setState({ apiKey: apiKey });
        }
        if (listID) {
          this.setState({ listID: listID });
        }
        if (server) {
          this.setState({ server: server });
        }
      }
    };
    getSettings();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  validateInput = () => {
    let apiKeyError = "",
      listIDError = "",
      serverError = "";
    if (this.state.apiKey === "") apiKeyError = "This field can't be empty!";
    if (this.state.listID === "") listIDError = "This field can't be empty!";
    if (this.state.server === "") serverError = "This field can't be empty!";

    if (apiKeyError.length > 0) {
      this.setState({
        apiKeyError: apiKeyError,
      });
      return false;
    }
    if (listIDError.length > 0) {
      this.setState({
        listIDError: listIDError,
      });
      return false;
    }
    if (serverError.length > 0) {
      this.setState({
        serverError: serverError,
      });
      return false;
    }
    return true;
  };

  handleSave = async () => {
    if (this.validateInput()) {
      const result = await SuperServices.settingsServices.saveSettings(
        this.state.apiKey,
        this.state.listID,
        this.state.server
      );
      if (result) {
        this.setState({
          apiKey: "",
          apiKeyError: "",
          listID: "",
          listIDError: "",
          server: "",
          serverError: "",
        });
        this.props.handleChange(null, 0);
      }
    }
  };
  render() {
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.title}>
            <TextField
              id="apiKey"
              name="apiKey"
              label="API Key"
              value={this.state.apiKey}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.apiKeyError
                  ? `${this.state.apiKeyError}`
                  : `Please Enter Mailchimp API Key.`
              }
              error={this.state.apiKeyError ? true : false}
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              id="listID"
              name="listID"
              label="List ID"
              value={this.state.listID}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.listIDError
                  ? `${this.state.listIDError}`
                  : `Please Enter Mailchimp List ID.`
              }
              error={this.state.listIDError ? true : false}
            />
          </div>
          <div
            className={this.props.classes.title}
            style={{ marginTop: "2rem" }}
          >
            <TextField
              id="server"
              name="server"
              label="Server Prefix"
              value={this.state.server}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.serverError
                  ? `${this.state.serverError}`
                  : `Please Enter Mailchimp Server Prefix.`
              }
              error={this.state.serverError ? true : false}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "1.5rem", backgroundColor: "#00B200" }}
            startIcon={<Save />}
            onClick={this.handleSave}
          >
            Save
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(Settings);

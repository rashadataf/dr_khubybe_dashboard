import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

import AdminServices from "../../services/admin.services";

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

class Tag extends React.Component {
  state = {
    _id: this.props._id || "",
    title: this.props.title || "",
    titleError: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  validateInput = () => {
    let titleError = "";
    if (this.state.title === "") titleError = "This field cann't be empty!";

    this.setState({
      titleError: titleError,
    });
  };

  handleUpdate = async () => {
    this.validateInput();
    if (!this.state.titleError) {
      const result = await AdminServices.tagsServices.updateTag(
        this.state._id,
        this.state.title
      );
      if (result) {
        this.setState({
          title: "",
          titleError: "",
        });
        this.props.handleSuccess();
      }
    }
  };
  render() {
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.title}>
            <TextField
              id="title"
              name="title"
              label="Name"
              value={this.state.title}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.titleError
                  ? `${this.state.titleError}`
                  : `Please Enter Tag Name.`
              }
              FormHelperTextProps={{
                style: {
                  marginTop: "1rem",
                },
              }}
              error={this.state.titleError ? true : false}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem", backgroundColor: "#00BF00" }}
            startIcon={<SaveIcon />}
            onClick={this.handleUpdate}
          >
            Update
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(Tag);

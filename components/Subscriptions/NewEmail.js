import React from "react";
import dynamic from "next/dynamic";

import { EditorState, convertToRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

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

class NewEmail extends React.Component {
  state = {
    subject: "",
    subjectError: "",
    description: "",
    descriptionError: "",
    editorState: EditorState.createEmpty(),
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      [event.target.name + "Error"]: "",
    });
  };

  handleDescriptionChange = (editorState) => {
    const contentState = editorState.getCurrentContent();
    this.setState({
      editorState: editorState,
      description: convertToHTML(contentState),
    });
  };

  validateInput = () => {
    let subjectError = "";
    if (this.state.subject === "") subjectError = "This field can't be empty!";

    if (subjectError.length > 0) {
      this.setState({
        subjectError: subjectError,
      });
      return false;
    }
    return true;
  };

  handleSave = async () => {
    const emails = await SuperServices.emailsServices.fetchAll();
    if (emails.length !== 0) {
      if (this.validateInput()) {
        const result = await SuperServices.emailsServices.createNewEmail(
          this.state.subject,
          this.state.description
        );
        if (result) {
          this.setState({
            subject: "",
            subjectError: "",
            description: "",
            descriptionError: "",
            editorState: EditorState.createEmpty(),
          });
          this.props.handleChange(null, 0);
        }
      }
    } else {
      alert("you don't have subscriptions to your services!");
      this.setState({
        subject: "",
        subjectError: "",
        description: "",
        descriptionError: "",
        editorState: EditorState.createEmpty(),
      });
    }
  };
  render() {
    return (
      <Container>
        <div className={this.props.classes.root}>
          <div className={this.props.classes.title}>
            <TextField
              id="subject"
              name="subject"
              label="Subject"
              value={this.state.subject}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.subjectError
                  ? `${this.state.subjectError}`
                  : `Please Enter Email Subject.`
              }
              error={this.state.subjectError ? true : false}
            />
          </div>
          <div style={{ width: "100%", marginTop: "1.5rem" }}>
            <label
              style={{
                display: "block",
                padding: "1.5rem 0",
              }}
            >
              Email Content
            </label>
            <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              onEditorStateChange={this.handleDescriptionChange}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "1.5rem", backgroundColor: "#00004B" }}
            endIcon={<SendIcon />}
            onClick={this.handleSave}
          >
            Send
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(NewEmail);

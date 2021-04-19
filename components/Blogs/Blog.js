import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { convertFromHTML, convertToHTML } from "draft-convert";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";

import Chip from "@material-ui/core/Chip";

import Autocomplete from "@material-ui/lab/Autocomplete";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

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

class Blog extends React.Component {
  state = {
    _id: this.props._id || "",
    title: this.props.title || "",
    titleError: "",
    description: this.props.description || "",
    image: this.props.image || null,
    imagePreview: this.props.image
      ? "http://localhost:3000/" + this.props.image
      : null,
    tags: [],
    tagsToRender: this.props.tags || [],
    selectedTags: [],
    references: [],
    referencesToRender: this.props.references || [],
    selectedReferences: [],
    editorState:
      this.props.description === ""
        ? EditorState.createEmpty()
        : EditorState.createWithContent(
            convertFromHTML(this.props.description)
          ),
  };

  componentDidMount() {
    const fetchTags = async () => {
      let selectedTags = [];
      const tags = await AdminServices.tagsServices.fetchAll();
      this.state.tagsToRender.forEach((tag) => {
        const found = tags.find((t) => t._id === tag);
        selectedTags.push(found.title);
      });
      this.setState({ tags: tags, selectedTags: selectedTags });
    };
    const fetchReferences = async () => {
      let selectedReferences = [];
      const references = await AdminServices.referencesServices.fetchAll();
      this.state.referencesToRender.forEach((tag) => {
        const found = references.find((t) => t._id === tag);
        selectedReferences.push(found.title);
      });
      this.setState({
        references: references,
        selectedReferences: selectedReferences,
      });
    };
    fetchTags();
    fetchReferences();
  }

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

  handleImageChange = (event) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => this.setState({ imagePreview: e.target.result });
      reader.onerror = (err) => console.log(err);
      reader.readAsDataURL(event.target.files[0]);
      this.setState({ image: event.target.files[0] });
    }
  };

  validateInput = () => {
    if (this.state.title === "") {
      this.setState({
        titleError: "This field can't be empty!",
      });
      return false;
    }

    return true;
  };

  handleUpdate = async () => {
    if (this.validateInput()) {
      const formData = new FormData();
      formData.append("title", this.state.title);
      formData.append("tags", JSON.stringify(this.state.selectedTags));
      formData.append(
        "references",
        JSON.stringify(this.state.selectedReferences)
      );
      formData.append("image", this.state.image);
      formData.append("description", this.state.description);
      const result = await AdminServices.blogsServices.updateBlog(
        this.state._id,
        formData
      );
      if (result) {
        this.setState({
          title: "",
          titleError: "",
          description: "",
          image: null,
          imagePreview: "",
          tags: [],
          selectedTags: [],
          tagsToRender: [],
          references: [],
          selectedReferences: [],
          referencesToRender: [],
          editorState: EditorState.createEmpty(),
        });
        this.props.handleSuccess();
      }
    } else {
      let myElement = document.getElementById("title");
      let topPos = myElement.offsetTop;
      document.getElementById("blog").scrollTop = topPos;
    }
  };
  render() {
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };
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
                  : `Please Enter Blog Name.`
              }
              FormHelperTextProps={{
                style: {
                  marginTop: "1rem",
                },
              }}
              error={this.state.titleError ? true : false}
            />
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <label
              style={{
                display: "block",
                padding: "1.5rem 0",
              }}
            >
              Description
            </label>
            <Editor
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              onEditorStateChange={this.handleDescriptionChange}
            />
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <Autocomplete
              multiple
              id="tags"
              value={this.state.selectedTags}
              onChange={(event, newValue) => {
                this.setState({ selectedTags: newValue });
              }}
              options={this.state.tags.map((tag) => tag.title)}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Tags"
                  placeholder="Tags"
                />
              )}
            />
          </div>
          <div style={{ width: "100%", marginTop: "2rem" }}>
            <Autocomplete
              multiple
              id="references"
              value={this.state.selectedReferences}
              onChange={(event, newValue) => {
                this.setState({ selectedReferences: newValue });
              }}
              options={this.state.references.map(
                (reference) => reference.title
              )}
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="References"
                  placeholder="References"
                />
              )}
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
            onClick={this.handleUpdate}
          >
            Update
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(Blog);

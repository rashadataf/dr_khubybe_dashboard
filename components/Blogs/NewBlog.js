import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { EditorState, convertToRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteIcon from "@material-ui/icons/Delete";

import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";

import AdminServices from "../../services/admin.services";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

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

class NewBlog extends React.Component {
  state = {
    title: "",
    titleError: "",
    description: "",
    descriptionError: "",
    image: null,
    imagePreview: "",
    tags: [],
    selectedTags: [],
    references: [],
    selectedReferences: [],
    editorState: EditorState.createEmpty(),
  };

  componentDidMount() {
    const fetchTags = async () => {
      const tags = await AdminServices.tagsServices.fetchAll();
      this.setState({ tags: tags });
    };
    const fetchReferences = async () => {
      const references = await AdminServices.referencesServices.fetchAll();
      this.setState({ references: references });
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

  handleTagsSelect = (event) => {
    this.setState({ selectedTags: event.target.value });
  };

  handleReferencesSelect = (event) => {
    this.setState({ selectedReferences: event.target.value });
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

  handleSave = async () => {
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
      const result = await AdminServices.blogsServices.createNewBlog(formData);
      if (result) {
        this.setState({
          title: "",
          titleError: "",
          description: "",
          image: null,
          imagePreview: "",
          tags: [],
          selectedTags: [],
          references: [],
          selectedReferences: [],
        });
        this.props.handleChange(null, 0);
      }
    } else {
      let myElement = document.getElementById("title");
      let topPos = myElement.offsetTop;
      document.getElementById("main").scrollTop = topPos;
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
              label="Title"
              value={this.state.title}
              onChange={this.handleChange}
              onBlur={this.validateInput}
              className={this.props.classes.textField}
              variant="outlined"
              helperText={
                this.state.titleError
                  ? `${this.state.titleError}`
                  : `Please Enter Blog Title.`
              }
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
            onClick={this.handleSave}
          >
            Save
          </Button>
        </div>
      </Container>
    );
  }
}

export default withMyHook(NewBlog);

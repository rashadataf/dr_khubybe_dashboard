import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import DeleteIcon from "@material-ui/icons/Delete";

import Blog from "./Blog";
import AdminServices from "../../services/admin.services";

function getModalStyle() {
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "80vw",
    height: "95vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowY: "scroll",
  },
}));

function ListBlogs() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [blog, setBlog] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchBlogs() {
      let blogs = await AdminServices.blogsServices.fetchAll();
      setBlogs(blogs);
    }

    fetchBlogs();
  }, []);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", flex: 0.5 },
    {
      field: "action",
      headerName: " ",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => {
              setBlog(blogs.find((blog) => blog._id === params.row._id));
              setId(params.row._id);
              handleOpen(true);
            }}
            startIcon={<EditTwoToneIcon />}
          >
            edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => {
              setId(params.row._id);
              setDialogOpen(true);
            }}
            startIcon={<DeleteIcon />}
          >
            delete
          </Button>
        </strong>
      ),
    },
  ];
  const rows = [];
  if (blogs) {
    blogs.forEach((blog, index) => {
      rows.push({
        id: index,
        _id: blog._id,
        title: blog.title,
        action: (
          <Button variant="contained" color="primary">
            Primary
          </Button>
        ),
      });
    });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBlog({});
    setId("");
  };

  const handleSuccess = async () => {
    async function fetchBlogs() {
      let blogs = await AdminServices.blogsServices.fetchAll();
      handleClose();
      setBlogs(blogs);
    }
    fetchBlogs();
  };

  const handleDeletionSuccess = async () => {
    async function fetchBlogs() {
      let blogs = await AdminServices.blogsServices.fetchAll();
      setDialogOpen(false);
      setBlogs(blogs);
    }
    fetchBlogs();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await AdminServices.blogsServices.deleteBlog(id);
      if (res) {
        handleDeletionSuccess();
      }
    } catch (error) {}
  };

  return (
    <>
      <div style={{ display: "flex", height: "68vh" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // className="DataGrid"
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper} id="blog">
          <h2 id="simple-modal-title">Update Blog</h2>
          <div id="simple-modal-description">
            <Blog
              title={blog.title}
              description={blog.description}
              arDescription={blog.arDescription}
              image={blog.imageUrl}
              tags={blog.tags}
              references={blog.references}
              _id={id}
              handleSuccess={handleSuccess}
            />
          </div>
        </div>
      </Modal>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmation} color="secondary">
            Yes
          </Button>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ListBlogs;

// <Rating name="read-only" value={value} readOnly />

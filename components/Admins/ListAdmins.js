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

import Admin from "./Admin";
import SuperServices from "../../services/super.services";

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
    width: "70vw",
    height: "95vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowY: "scroll",
  },
}));

function ListAdmins(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [admins, setAdmins] = useState(JSON.parse(props.admins) || []);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [admin, setAdmin] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchAdmins() {
      let admins = await SuperServices.adminsServices.fetchAll();
      setAdmins(admins);
    }
    fetchAdmins();
  }, []);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.5 },
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
              setAdmin(admins.find((admin) => admin._id === params.row._id));
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
  if (admins) {
    admins.forEach((admin, index) => {
      rows.push({
        id: index,
        _id: admin._id,
        name: admin.name,
        status: admin.status,
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
    setAdmin({});
    setId("");
  };

  const handleSuccess = async () => {
    async function fetchAdmins() {
      let admins = await SuperServices.adminsServices.fetchAll();
      handleClose();
      setAdmins(admins);
    }
    fetchAdmins();
  };

  const handleDeletionSuccess = async () => {
    async function fetchAdmins() {
      let admins = await SuperServices.adminsServices.fetchAll();
      setDialogOpen(false);
      setAdmins(admins);
    }
    fetchAdmins();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await SuperServices.adminsServices.deleteAdmin(id);
      if (res) {
        handleDeletionSuccess();
      } else {
        alert("you can't delete the admin!");
        setDialogOpen(false);
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
        <div style={modalStyle} className={classes.paper} id="admin">
          <h2 id="simple-modal-title">Update Admin</h2>
          <div id="simple-modal-description">
            <Admin
              name={admin.name}
              email={admin.email}
              companyName={admin.companyName}
              phone={admin.phone}
              companyUrl={admin.companyUrl}
              companyFacebook={admin.companyFacebook}
              companyAddress={admin.companyAddress}
              image={admin.imageUrl}
              _id={id}
              status={admin.status}
              role={admin.role}
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

export default ListAdmins;

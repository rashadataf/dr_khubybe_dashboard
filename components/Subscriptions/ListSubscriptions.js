import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import UnsubscribeIcon from "@material-ui/icons/Unsubscribe";

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
    width: "60vw",
    height: "60vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ListTags() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [emails, setEmails] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchEmails() {
      let newEmails = await SuperServices.emailsServices.fetchAll();
      if (newEmails.length !== emails.length) {
        setEmails(newEmails);
      }
    }
    fetchEmails();
  }, [emails]);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "email", headerName: "Email", flex: 1 },
    // {
    //   field: "action",
    //   headerName: " ",
    //   flex: 1,
    //   disableColumnMenu: true,
    //   renderCell: (params) => (
    //     <strong>
    //       <Button
    //         variant="contained"
    //         color="secondary"
    //         size="small"
    //         style={{ marginLeft: 16 }}
    //         onClick={() => {
    //           setId(params.row._id);
    //           setDialogOpen(true);
    //         }}
    //         startIcon={<UnsubscribeIcon />}
    //       >
    //         Unsubscribe
    //       </Button>
    //     </strong>
    //   ),
    // },
  ];
  const rows = [];
  if (emails) {
    emails.forEach((email, index) => {
      rows.push({
        id: index + 1,
        _id: email._id,
        email: email.email,
        action: (
          <Button variant="contained" color="primary">
            Primary
          </Button>
        ),
      });
    });
  }

  const handleDeletionSuccess = async () => {
    async function fetchEmails() {
      let emails = await SuperServices.emailsServices.fetchAll();
      setDialogOpen(false);
      setEmails(emails);
    }
    fetchEmails();
  };

  const handleDialogClose = () => {
    setId("");
    setDialogOpen(false);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const res = await SuperServices.emailsServices.deleteEmail(id);
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
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you you want to unsubscribe the email?
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

// <Rating name="read-only" value={value} readOnly />

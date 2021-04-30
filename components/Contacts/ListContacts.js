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
import InfoIcon from "@material-ui/icons/Info";

import Contact from "../../components/Contacts/Contact";
import SuperServices from "../../services/super.services";
import axios from "axios";

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
    height: "90vh",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ListContacts() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState({});
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchContacts() {
      let newContacts = await SuperServices.contactsServices.fetchAll();
      if (newContacts.length !== contacts.length) {
        setContacts(newContacts);
      }
    }
    fetchContacts();
  }, [contacts]);

  const columns = [
    { field: "_id", flex: 1, hide: true },
    { field: "id", headerName: "ID" },
    { field: "subject", headerName: "Subject", flex: 1 },
    {
      field: "action",
      headerName: " ",
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => {
              setContact(
                contacts.find((contact) => contact._id === params.row._id)
              );
              setOpen(true);
            }}
            startIcon={<InfoIcon />}
          >
            Details
          </Button>
        </strong>
      ),
    },
  ];
  const rows = [];
  if (contacts) {
    contacts.forEach((contact, index) => {
      rows.push({
        id: index + 1,
        _id: contact._id,
        subject: contact.subject,
        action: (
          <Button variant="contained" color="primary">
            Primary
          </Button>
        ),
      });
    });
  }

  const handleClose = () => {
    setOpen(false);
    setContact({});
  };

  return (
    <>
      <div style={{ display: "flex", height: "68vh" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Contact Details</h2>
            <div id="simple-modal-description">
              <Contact
                firstName={contact.firstName}
                lastName={contact.lastName}
                email={contact.email}
                phone={contact.phone}
                subject={contact.subject}
                handleClose={handleClose}
              />
            </div>
          </div>
        </Modal>
        <Button
          onClick={() => {
            async function save() {
              const result = await axios.post("/api/contacts", {
                firstName: "rashad",
                lastName: "omer",
                email: "ali@gmail.com",
                phone: "987654",
                subject: "jashas",
              });
            }
            save();
          }}
        >
          Help
        </Button>
      </div>
    </>
  );
}

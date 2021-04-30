import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Super from "../../layouts/Super";
import ListContacts from "../../components/Contacts/ListContacts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Subscriptions() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square className={classes.root}>
      <ListContacts />
    </Paper>
  );
}

Subscriptions.layout = Super;

export default Subscriptions;

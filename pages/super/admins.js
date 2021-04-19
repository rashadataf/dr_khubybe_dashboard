import React from "react";
import { connectToDatabase } from "../../util/mongodb";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

import ListIcon from "@material-ui/icons/List";
import AddIcon from "@material-ui/icons/Add";

import Super from "layouts/Super.js";

import ListAdmins from "../../components/Admins/ListAdmins";
import NewAdmin from "../../components/Admins/NewAdmin";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Admins({ admins }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper square className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon label tabs example"
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab icon={<ListIcon />} label="List Admins" {...a11yProps(0)} />
        <Tab icon={<AddIcon />} label="Add New" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ListAdmins admins={admins} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <NewAdmin handleChange={handleChange} />
      </TabPanel>
    </Paper>
  );
}

Admins.layout = Super;

export default Admins;

export async function getServerSideProps(context) {
  try {
    const { client, db } = await connectToDatabase();
    const adminsCollection = db.collection("admins");
    const admins = await adminsCollection.find({}).toArray();
    admins.forEach((admin) => {
      delete admin.password;
    });

    return {
      props: {
        admins: JSON.stringify(admins),
      },
    };
  } catch (error) {}
}

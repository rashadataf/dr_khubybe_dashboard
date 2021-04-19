/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import styles from "assets/jss/nextjs-material-dashboard/components/footerStyle.js";

export default function Footer(props) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a href="/" target="_blank" className={classes.a}>
              Company Name
            </a>
            , Made By Rashad Ataf
          </span>
        </p>
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes/super.js";

import styles from "assets/jss/nextjs-material-dashboard/layouts/adminStyle.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

let ps;

export default function Super({ children, ...rest }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedSession, setLoadedSession] = useState();
  // used for checking current route
  const router = useRouter();
  // styles
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("white");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    getSession().then((session) => {
      if (session) {
        if (session.user.role !== "super") {
          router.push("/auth/login");
        }
        if (session.user.role === "super") {
          if (isLoading) setIsLoading(false);
          if (!loadedSession) setLoadedSession(session);
        }
      } else {
        router.push("/auth/login");
      }
    });
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  if (!isLoading && loadedSession && loadedSession.user.role === "super") {
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={loadedSession.user.name}
          logo={logo}
          image={image}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          {...rest}
        />
        <div className={classes.mainPanel} ref={mainPanel} id="main">
          <Navbar
            routes={routes}
            handleDrawerToggle={handleDrawerToggle}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          <div className={classes.content}>
            <div className={classes.container}>{children}</div>
          </div>
          <Footer />
          {/* <FixedPlugin
            handleImageClick={handleImageClick}
            handleColorClick={handleColorClick}
            bgColor={color}
            bgImage={image}
            handleFixedClick={handleFixedClick}
            fixedClasses={fixedClasses}
          /> */}
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
}

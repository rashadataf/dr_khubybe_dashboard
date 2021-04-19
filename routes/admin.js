/*!

=========================================================
* * NextJS Material Dashboard v1.1.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BookIcon from "@material-ui/icons/Book";

const adminRoutes = [
  {
    path: "/blogs",
    name: "Blogs",
    icon: AssignmentIcon,
    layout: "/admin",
  },
  {
    path: "/tags",
    name: "Tags",
    icon: LoyaltyIcon,
    layout: "/admin",
  },
  {
    path: "/references",
    name: "References",
    icon: BookIcon,
    layout: "/admin",
  },
];

export default adminRoutes;

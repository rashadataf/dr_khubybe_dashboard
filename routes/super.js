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
import PermContactCalendarIcon from "@material-ui/icons/PermContactCalendar";
import BookIcon from "@material-ui/icons/Book";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";

const superRoutes = [
  {
    path: "/blogs",
    name: "Blogs",
    icon: AssignmentIcon,
    layout: "/super",
  },
  {
    path: "/admins",
    name: "Admins",
    icon: PermContactCalendarIcon,
    layout: "/super",
  },
  {
    path: "/tags",
    name: "Tags",
    icon: LoyaltyIcon,
    layout: "/super",
  },
  {
    path: "/references",
    name: "References",
    icon: BookIcon,
    layout: "/super",
  },
  {
    path: "/subscriptions",
    name: "Subscriptions",
    icon: SubscriptionsIcon,
    layout: "/super",
  },
];

export default superRoutes;

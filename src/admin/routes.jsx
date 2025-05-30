import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  UserGroupIcon,
  ServerStackIcon,
  RectangleStackIcon,
  NewspaperIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Home, Customers, Services, Employees ,News} from "admin/pages/dashboard";
import { Reminders, SignUp } from "admin/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    title: "Quản lí",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Tổng quan",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "khách hàng",
        path: "/customers",
        element: <Customers />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "dịch vụ",
        path: "/services",
        element: <Services />,
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "nhân viên",
        path: "/employees",
        element: <Employees />,
      },
      {
        icon: <NewspaperIcon {...icon} />,
        name: "Tin tức",
        path: "/news",
        element: <News />,
      },
    ],
  },
  {
    title: "Hệ thống",
    layout: "dashboard",
    pages: [
   
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Nhắc hẹn",
        path: "/reminders",
        element: <Reminders />,
      },
    ],
  },
];

export default routes;

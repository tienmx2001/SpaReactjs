import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

export const statisticsCardsData = [
  {
    color: "gray",
    icon: BanknotesIcon,
    title: "Doanh thu",
    value: "320.000.000₫",
    footer: {
      color: "text-green-500",
      value: "+12%",
      label: "so với tháng trước",
    },
  },
  {
    color: "gray",
    icon: UsersIcon,
    title: "Khách hàng",
    value: "67",
    footer: {
      color: "text-green-500",
      value: "+8%",
      label: "so với tháng trước",
    },
  },
  {
    color: "gray",
    icon: UserPlusIcon,
    title: "Khách hàng mới",
    value: "24",
    footer: {
      color: "text-red-500",
      value: "-5%",
      label: "so với tháng trước",
    },
  },
  {
    color: "gray",
    icon: ChartBarIcon,
    title: "Dịch vụ sử dụng",
    value: "145",
    footer: {
      color: "text-green-500",
      value: "+10%",
      label: "so với tháng trước",
    },
  },
];

export default statisticsCardsData;

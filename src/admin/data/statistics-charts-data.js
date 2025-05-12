import { chartsConfig } from "admin/configs";

const appointmentChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Số lượt đặt",
      data: [12, 18, 14, 22, 30, 24, 20], // Số lượt đặt lịch từ Thứ 2 đến CN
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#6d4c41", // màu nâu nhẹ spa
    plotOptions: {
      bar: {
        columnWidth: "16%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
};

const newCustomersChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Khách hàng mới",
      data: [5, 8, 10, 15, 18, 20, 25, 22, 30], // Dữ liệu theo tháng
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#8e24aa"], // tím spa
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      ],
    },
  },
};

const popularServicesChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Số lượt sử dụng",
      data: [120, 90, 60, 45, 30], // top 5 dịch vụ
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#388e3c",
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Loại 1",
        "Loại 2",
        "Loại 3",
        "Loại 4",
        "Loại 5",
      ],
    },
  },
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Lượt đặt lịch trong tuần",
    description: "Số lượt đặt theo ngày",
    footer: "cập nhật 2 giờ trước",
    chart: appointmentChart,
  },
  {
    color: "white",
    title: "Khách hàng mới theo tháng",
    description: "Tăng trưởng khách hàng mới",
    footer: "cập nhật hôm nay",
    chart: newCustomersChart,
  },
  {
    color: "white",
    title: "Dịch vụ phổ biến",
    description: "Top dịch vụ được yêu thích nhất",
    footer: "cập nhật gần đây",
    chart: popularServicesChart,
  },
];

export default statisticsChartsData;

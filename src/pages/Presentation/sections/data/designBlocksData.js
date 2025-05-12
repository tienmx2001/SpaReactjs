// pages/Presentation/sections/data/useServicesData.js
import { useState, useEffect } from "react";
import hieuquadieutrimun from "assets/images/hieuquadieutri/dieutrimun.jpg";
import hieuquadieutrinam from "assets/images/hieuquadieutri/dieutrinam.jpg";
import hieuquadieutriseo from "assets/images/hieuquadieutri/dieutriseo.jpg";

function useServicesData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services");
        const services = await response.json();

        const mappedData = [
          {
            title: "Dịch vụ",
            description: "Chúng tôi cung cấp dịch vụ chăm sóc sắc đẹp toàn diện",
            items: services.map((service) => ({
              service_id: service.service_id,
              name: service.service_name,
              image: `http://localhost:5000${service.service_image}`,
              route: `/services/${service.service_id}`,
            })),
          },
          {
            title: "Hiệu quả điều trị",
            description: "Các khách hàng đã trải nghiệm dịch vụ của chúng tôi",
            items: [
              {
                image: hieuquadieutrimun,
                route: "/sections/navigation/navbars",
              },
              {
                image: hieuquadieutrinam,
                route: "/sections/navigation/nav-tabs",
              },
              {
                image: hieuquadieutriseo,
                route: "/sections/navigation/pagination",
              },
            ],
          },
        ];

        setData(mappedData);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchServices();
  }, []);

  return data;
}

export default useServicesData;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Breadcrumbs, Link, Typography, TextField
} from '@mui/material';
import BaseLayout from "layouts/sections/components/BaseLayout";
import MKButton from 'components/MKButton';
import axios from 'axios';
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

const ServicesPage = () => {
  const { id } = useParams(); // lấy service_id từ URL
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Lỗi khi tải dịch vụ:", err);
      }
    };

    if (id) fetchService();
  }, [id]);

  if (!service) {
    return (
      <BaseLayout title="Dịch vụ" breadcrumb={[{ label: "Dịch vụ" }]}>
        <div className="text-center py-10 text-lg">Đang tải dịch vụ...</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      title="Dịch vụ"
      breadcrumb={[
        { label: "Trang chủ", route: "/presentation" },
        { label: "Dịch vụ", route: "/services" },
        { label: service.service_name }
      ]}
    >
      <div className="max-w-7xl mx-auto py-2 font-sans">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 bg-white shadow-md rounded-lg py-4 px-6">
            <h1 className="text-3xl font-semibold mb-2">{service.service_name}</h1>
            <img
              src={`http://localhost:5000${service.service_image}`}
              alt={service.service_name}
              className="rounded-lg mb-4 w-full h-[300px] object-cover"
            />
            <div
              className="text-gray-700 text-base leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: service.service_contents }}
            />

           
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[300px] space-y-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-yellow-700 flex items-center">
                <EllipsisVerticalIcon className="w-7 h-7 text-green-400 font-extrabold" />
                Dịch vụ nổi bật
              </h3>
              <div className="flex items-center space-x-4 p-2 bg-white rounded-lg shadow-sm">
                <img
                  src="https://example.com/sample-service.jpg"
                  alt="Dịch vụ nổi bật"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <a href="#" className="text-base font-medium text-gray-800 hover:underline">
                    Chăm sóc da mặt chuyên sâu
                  </a>
                </div>
              </div>
            </div>

            <div className='bg-white shadow-sm rounded-lg p-4'>
              <h2 className="text-lg font-semibold mb-3 text-yellow-700 flex">
                <EllipsisVerticalIcon className="w-7 h-7 text-green-400 font-extrabold" />
                Danh mục dịch vụ
              </h2>
              <div className="flex flex-wrap gap-2">
                {['Chăm sóc da', 'Trị mụn', 'Tắm trắng', 'Massage body'].map((cat, index) => (
                  <Link
                    key={index}
                    href="#"
                    underline="hover"
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-800"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ServicesPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Breadcrumbs, Link, Typography, Card, CardContent, CardMedia, TextField
} from '@mui/material';
import BaseLayout from "layouts/sections/components/BaseLayout";
import MKButton from 'components/MKButton';
import axios from 'axios';
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import routes from 'routes';

const NewsPage = () => {
  const { id } = useParams(); // lấy new_id từ URL
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      }
    };

    if (id) fetchNews();
  }, [id]);

  if (!news) {
    return (
      <BaseLayout title="Tin tức" breadcrumb={[{ label: "Tin tức" }]}>
        <div className="text-center py-10 text-lg">Đang tải bài viết...</div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      title="Tin tức"
      breadcrumb={[
        { label: "Trang chủ", route: "/presentation" },
        { label: "Tin tức" , route:"/news" },
        { label: news.new_title}
      ]}
      
    >
      <div className="max-w-7xl mx-auto py-2 font-sans ">
        <div className="flex flex-col lg:flex-row gap-6 ">
          {/* Main Content */}
          <div className="flex-1 bg-white shadow-md rounded-lg py-4 px-6">
            <h1 className="text-3xl font-semibold mb-2">{news.new_title}</h1>
            <p className="text-sm text-gray-500 mb-4">{new Date(news.new_time).toLocaleString()}</p>
            <img
              src={`http://localhost:5000${news.new_image}`}
              alt={news.new_title}
              className="rounded-lg mb-4 w-full"
            />
            <div
              className="text-gray-700 text-base leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: news.new_content }}
            />

            {/* Form bình luận */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Để lại bình luận</h2>
              <form className="space-y-4">
                <TextField fullWidth label="Họ và tên" variant="outlined" />
                <TextField fullWidth label="Số điện thoại" variant="outlined" />
                <TextField
                  fullWidth
                  label="Nội dung bình luận"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                <MKButton variant="gradient" color="primary" fullWidth>
                  Gửi bình luận
                </MKButton>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[300px] space-y-6 ">
            {/* Tin mới */}
            <div  className='bg-white shadow-md rounded-lg p-4'>
              <h3 className="text-lg font-semibold mb-3 text-yellow-700 flex items-center ">
              <EllipsisVerticalIcon className="w-7 h-7 text-green-400 font-extrabold" />
              Tin tức mới nhất</h3>
              <div className="flex items-center space-x-4 p-2 bg-white rounded-lg shadow-sm">
                <img
                  src="https://thammysbeauty.vn/wp-content/uploads/2024/10/Dieu-tri-bot-Hori-va-nhung-dieu-can-biet-150x150.jpg"
                  alt="Tin mới"
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <a href="#" className="text-base font-medium text-gray-800 hover:underline">
                    Cách chăm sóc da sau khi nặn mụn
                  </a>
                </div>
              </div>

            </div>

            {/* Danh mục tin tức */}
            <div className='bg-white shadow-sm rounded-lg p-4'>
              <h2 className="text-lg font-semibold mb-3 text-yellow-700 flex ">
              <EllipsisVerticalIcon className="w-7 h-7 text-green-400 font-extrabold" />Danh mục tin tức</h2>
              <div className="flex flex-wrap gap-2">
                {['Chăm sóc da', 'Điều trị mụn', 'Trẻ hóa da', 'Làm trắng da'].map((cat, index) => (
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

export default NewsPage;

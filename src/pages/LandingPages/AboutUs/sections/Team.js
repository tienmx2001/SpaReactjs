import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const senses = [
  {
    title: 'Khứu giác',
    icon: <SpaIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
    desc: 'Mọi người thấy mùi thơm dịu của cây cỏ, tinh dầu tự nhiên du nhập khi vừa bước vào và bao phủ toàn bộ không gian các tầng của spa.'
  },
  {
    title: 'Thị giác',
    icon: <VisibilityIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
    desc: 'Cách trang trí tối giản cũng như ánh sáng dịu nhẹ đưa tinh thần ta vào sự tĩnh lặng & thư giãn thật sự.'
  },
  {
    title: 'Vị giác',
    icon: <RestaurantIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
    desc: 'Menu thức uống đặc biệt của Sen Spa không những thơm ngon mà còn rất tốt cho sức khỏe và làn da.'
  },
  {
    title: 'Xúc giác',
    icon: <TouchAppIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
    desc: 'Khách hàng được vuốt ve chăm sóc làn da sáng mịn và loại bỏ các điểm tắc nghẽn năng lượng giúp cơ thể bừng sức sống.'
  },
  {
    title: 'Thính giác',
    icon: <MusicNoteIcon sx={{ fontSize: 40, color: '#e91e63' }} />,
    desc: 'Âm nhạc dịu dàng chuyên biệt dành cho spa giúp trị liệu tâm hồn, xua tan căng thẳng & phiền muộn mang đến giấc ngủ sâu.'
  },
];

export default function SpaDefinitionSection() {
  return (
    <Box className="bg-white py-12 md:px-0" id="spa-la-gi ">
      <Box className="max-w-5xl mx-auto">
   
        <Grid container spacing={4}>
          {senses.map((sense) => (
            <Grid item xs={12} sm={6} md={4} key={sense.title}>
              <Card className="h-full bg-[#faf9f9] shadow-sm hover:shadow-lg transition">
                <CardContent className="flex flex-col items-center text-center">
                  {sense.icon}
                  <Typography variant="h6" className="mt-2 mb-1 text-[#91496c] font-semibold">{sense.title}</Typography>
                  <Typography variant="body2">{sense.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider } from '@mui/material';

const timeline = [
  {
    year: '2004',
    img: 'https://ext.same-assets.com/1464168449/2934639708.jpeg',
    desc: 'An Nam Spa ra đời tại 26-28 Đỗ Quang Đẩu, Q.1 là tòa nhà độc lập gồm 9 tầng phục vụ khách.'
  },
  {
    year: '2006',
    img: 'https://senspa.com.vn/wp-content/uploads/2021/01/missaodai.jpg',
    desc: 'Eden Spa được mở thêm tại 21 Nguyễn Trung Ngạn, Q.1 gồm 3 tầng (9-10-11) trong tòa nhà Miss Aodai Building.'
  },
  {
    year: '2014',
    img: 'https://senspa.com.vn/wp-content/uploads/2021/01/đongu.jpg',
    desc: 'Sáp nhập An Nam Spa & EdenSpa vào tại địa điểm 26-28 Đông Du, Q.1 thành Eden SPA'
  },
  {
    year: '2019',
    img: 'https://ext.same-assets.com/1464168449/2346026195.jpeg',
    desc: 'Eden Spa mở rộng quy mô, nâng cấp dịch vụ, tiếp nối truyền thống chăm sóc sức khỏe và sắc đẹp.'
  }
];

// const awards = [
//   {
//     img: 'https://ext.same-assets.com/1464168449/236797469.png',
//     title: 'Giải thưởng Top 5 Spa đạt chuẩn cuộc bình chọn TP.HCM 100 điều thú vị lần II (2012)',
//   },
//   {
//     img: 'https://ext.same-assets.com/1464168449/3180984489.png',
//     title: 'Giải thưởng The Guide Awards (2012)',
//   },
//   {
//     img: 'https://ext.same-assets.com/1464168449/3356402170.png',
//     title: 'Top 5 Spa đạt chuẩn TP.HCM 100 điều thú vị lần II (2012)',
//   }
// ];

export default function HistoryAwardSection() {
  return (
    <Box className="bg-[#faf9f9] py-12 px-2 md:px-0" id="history-award">
      <Box className="max-w-5xl mx-auto">
        <Typography variant="h2"  color="primary" mb={5} className="font-bold text-center">Lịch sử hình thành</Typography>
        <Grid container spacing={4} alignItems="center">
          {timeline.map((item, idx) => (
            <Grid item xs={12} md={6} key={item.year}>
              <Card className="bg-white h-full shadow-sm">
                <CardContent className="flex flex-col md:flex-row gap-3 items-center">
                  <Box className="md:w-40 md:h-40 w-full flex-shrink-0">
                    <img src={item.img} alt={item.year} className="rounded-xl w-full h-full object-cover" />
                  </Box>
                  <Box>
                    <Typography variant="h5"  color="primary" className="font-bold text-[#91496c]">{item.year}</Typography>
                    <Typography variant="body2">{item.desc}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Divider className="my-12" />
        {/* <Typography variant="h4" className="text-[#91496c] font-bold mb-10 text-center">Giải thưởng</Typography>
        <Grid container spacing={4} justifyContent="center">
          {awards.map((award, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card className="bg-white shadow-sm h-full flex flex-col items-center">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <img src={award.img} alt={award.title} className="w-20 h-20 object-contain mb-4" />
                  <Typography variant="body2">{award.title}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid> */}
      </Box>
    </Box>
  );
}

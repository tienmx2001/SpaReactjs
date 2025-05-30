/*
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";

// Material Kit 2 React examples
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";

// Images
import coinbase from "assets/images/logos/gray-logos/logo-coinbase.svg";
import nasa from "assets/images/logos/gray-logos/logo-nasa.svg";
import netflix from "assets/images/logos/gray-logos/logo-netflix.svg";
import pinterest from "assets/images/logos/gray-logos/logo-pinterest.svg";
import spotify from "assets/images/logos/gray-logos/logo-spotify.svg";
import vodafone from "assets/images/logos/gray-logos/logo-vodafone.svg";
import MKTypography from "components/MKTypography";

function Featuring() {
  return (
    <MKBox component="section" pt={3} pb={8}>
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {/* Phần bên trái */}
          <Grid item xs={12} md={6}>
            <MKBox px={15} >
              <MKTypography variant="h3" color="primary">Truyền thông nói về Eden Spa ?</MKTypography>
              <MKTypography
                variant="button"
                color="text"
                fontWeight="regular"
                mb={1}
                pr={2}
                sx={{ textAlign: "justify", letterSpacing: "0.8px" }}
              >
                Eden Spa được vinh dự nhắc đến trên nhiều tờ báo, đài truyền hình uy tín với các chủ đề chia sẻ kiến thức trị mụn chuẩn y khoa, 
                câu chuyện của nhiều bạn trẻ đã lấy lại tự tin và hạnh phúc sau hành trình điều trị mụn thành công tại 
                Eden Spa.
              </MKTypography>
            </MKBox>
          </Grid>

          {/* Phần bên phải */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} sx={{ mb: 12 }}>
              <Grid item xs={6} md={4} lg={4}>
                <MKBox
                  component="img"
                  src="https://thammysbeauty.vn/wp-content/uploads/2022/05/hinh1.svg"
                  alt="coinbase"
                  width="100%"
                  opacity={0.7}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={4}>
                <MKBox
                  component="img"
                  src="https://thammysbeauty.vn/wp-content/uploads/2022/05/hinh2.svg"
                  alt="nasa"
                  width="100%"
                  opacity={0.7}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={4}>
                <MKBox
                  component="img"
                  src="https://thammysbeauty.vn/wp-content/uploads/2022/05/Asset-4.svg"
                  alt="netflix"
                  width="100%"
                  opacity={0.7}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={4}>
                <MKBox
                  component="img"
                  src="https://thammysbeauty.vn/wp-content/uploads/2022/11/logo-eva-1.png"
                  alt="pinterest"
                  width="100%"
                  opacity={0.7}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={4}>
                <MKBox
                  component="img"
                  src="https://thammysbeauty.vn/wp-content/uploads/2022/05/Asset-11.svg"
                  alt="spotify"
                  width="100%"
                  opacity={0.7}
                />
              </Grid>
              <Grid item xs={6} md={4} lg={4}>
                <MKBox
                  component="img"
                  src="https://thammysbeauty.vn/wp-content/uploads/2022/05/kenh-14.jpg.webp"
                  alt="vodafone"
                  width="100%"
                  opacity={0.7}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={5234}
              separator=","
              title="Khách hàng"
              description="Đánh giá cao dịch vụ đâ sử dụng ở đây"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={3400}
              separator=","
              suffix="+"
              title="Ca"
              description="Thực hiện điều trị mụn thành công"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DefaultCounterCard
              count={24}
              suffix="/7"
              title="Hỗ trợ"
              description="Chăm sóc tận tình 24/7 "
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Featuring;

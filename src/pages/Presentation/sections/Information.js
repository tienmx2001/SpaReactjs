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
import RotatingCard from "examples/Cards/RotatingCard";
import RotatingCardFront from "examples/Cards/RotatingCard/RotatingCardFront";
import RotatingCardBack from "examples/Cards/RotatingCard/RotatingCardBack";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Images
import bgFront from "assets/images/presentation/gioithieu01.png";
import bgBack from "assets/images/presentation/gioithieu03.jpg";

function Information() {
  return (
    <MKBox component="section" py={6} my={6}>
      <Container>
        <Grid container item xs={11} spacing={3} alignItems="center" sx={{ mx: "auto" }}>
          <Grid item xs={12} lg={4} sx={{ mx: "auto" }}>
            <RotatingCard>
              <RotatingCardFront
                image={bgFront}
                icon="touch_app"
                title={
                  <>
                    Không gian
                    <br />
                  Sang trọng
                  </>
                }
              />
              <RotatingCardBack
                image={bgBack}
                title="Hiện đại và cổ điển"
                action={{
                  type: "internal",
                  route: "/sections/page-sections/page-headers",
                  label: "Khám phá",
                }}
              />
            </RotatingCard>
          </Grid>
          <Grid item xs={12} lg={7} sx={{ ml: "auto" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="all_inbox"
                  title="Dịch vụ trọn gói"
                  description="Cung cấp nguồn khoáng sản tự nhiên, nước nóng thiên nhiên hoặc nước biển trong khuôn viên được sử dụng trong các liệu pháp trị liệu thủy sinh."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="spa"
                  title="Chăm sóc toàn thân"
                  description="Chúng tôi cung cấp dịch vụ chăm sóc toàn thân với các sản phẩm tự nhiên, an toàn và hiệu quả."
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: { xs: 0, md: 6 } }}>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="price_change"
                  title="Dịch vụ VIP"
                  description="Dịch vụ chăm sóc sắc đẹp cao cấp với các sản phẩm tự nhiên, an toàn và hiệu quả."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DefaultInfoCard
                  icon="face_retouching"
                  title="Chăm sóc da mặt"
                  description="Chúng tôi cung cấp dịch vụ chăm sóc da mặt với các sản phẩm tự nhiên, an toàn và hiệu quả."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Information;

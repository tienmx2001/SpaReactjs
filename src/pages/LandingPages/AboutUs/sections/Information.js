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
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import CenteredBlogCard from "examples/Cards/BlogCards/CenteredBlogCard";
import Typography from "components/MKTypography";
import MKButton from "components/MKButton";
import anh1 from "assets/images/space/khonggian1.jpg";
import anh2 from "assets/images/space/khonggian2.jpg";
import anh3 from "assets/images/space/khonggian3.jpg";
import anh4 from "assets/images/space/khonggian4.png";
import logo from "assets/images/spalogo02.png"


function Information() {
  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6}>
            <Grid container justifyContent="flex-start" ml={5} px={8}>
                <Typography variant="h2"  mb={2} color="primary" className="gap-2 font-thin ">

                  Về Như Mơ Spa
                  <MKBox component="img" src={logo} className="w-32 h-16"/>
                </Typography>
          
              
                
              
                <Typography
                variant="button"
                fontWeight="regular"
                color="text"
                mb={1}
                pr={2}
                sx={{ textAlign: "justify", letterSpacing: "0.8px" }}
              >
                Gắn liền với vẻ đẹp của một loài hoa giản dị, chân chất, lãng mạn nhưng ý chí sống mãnh liệt, 
                Spa Như Mơ được thiết kế và bài trí với phong cách mộc mạc, giản dị mang đậm tính chất truyền thống của 
                Việt Nam.
              </Typography>

              <Typography
                variant="button"
                fontWeight="regular"
                color="text"
                mb={1}
                pr={2}
                sx={{ textAlign: "justify", letterSpacing: "0.8px" }}
              >
                Tọa lạc tại trung tâm TP.HCM nhưng Spa Như Mơ được tách biệt khỏi không khí ồn ào náo nhiệt , 
                mở ra một không gian an tĩnh, nhẹ nhàng. Khách hàng đến với Spa Như Mơ sẽ được bước vào không gian sang trọng,
                đan xen giữa hiện đại và cổ điển, ẩn hiện hình ảnh những bông sen thanh thoát, 
                dịu dàng tràn ngập trong cách bài trí tại đây.
              </Typography>

              <Typography
                variant="button"
                fontWeight="regular"
                color="text"
                mb={1}
                pr={2}
                sx={{ textAlign: "justify", letterSpacing: "0.8px" }}
              >
                Đến với Spa Như Mơ, bạn sẽ được trải nghiệm những dịch vụ chăm sóc sắc đẹp và sức khỏe hoàn hảo nhất. 
                Đội ngũ nhân viên chuyên nghiệp, tận tình, chu đáo sẽ mang đến cho bạn những giây phút thư giãn tuyệt vời 
                nhất.
              </Typography>

                
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4} sx={{ ml: "auto", mt: { xs: 3, lg: 0 } }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img
                src={anh1}
                alt="Ảnh 1"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src={anh2}
                alt="Ảnh 2"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src={anh3}
                alt="Ảnh 3"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src={anh4}
                alt="Ảnh 4"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
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

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Images (thay thế bằng ảnh thật)
import demandImg from "assets/images/daotao/daotao1.jpg";
import salaryImg from "assets/images/daotao/daotao2.jpg";
import futureImg from "assets/images/daotao/daotao3.jpg";
import practiceImg from "assets/images/daotao/daotao4.jpg";
import certificationImg from "assets/images/daotao/daotao5.jpg";
import consultingImg from "assets/images/daotao/daotao1.jpg";

function TrainingPage() {
  return (
    <MKBox component="section" py={6} px={{ xs: 2, lg: 0 }} bgColor="white" className="rounded-xl px-3">
      <Container>
        <MKTypography variant="h3" color="dark" mb={4} textAlign="center">
          Đào Tạo Nhân Viên Chăm Sóc Da Chuyên Sâu
        </MKTypography>

        <MKTypography variant="body1" color="text" mb={3} sx={{ textAlign: "justify", letterSpacing: "0.8px" }}>
          Phòng khám da liễu S Beauty mang đến khóa học chăm sóc da chuyên sâu với hình thức cầm tay chỉ việc, 
          được thực chiến trên khách hàng thật để học viên nắm vững tay nghề trước khi ra làm. Mỗi lớp học chỉ giới hạn từ 2-3 học viên 
          để đảm bảo chất lượng giảng dạy và hiệu quả thực hành cao nhất.
        </MKTypography>

        <MKTypography variant="h5" color="dark" mt={4} mb={2}>
          Nội dung đào tạo toàn diện, thực tiễn
        </MKTypography>

        <MKTypography variant="body2" color="text" mb={3} sx={{ textAlign: "justify", letterSpacing: "0.8px" }}>
          Chương trình học bao gồm lý thuyết và thực hành từ cơ bản đến nâng cao: chăm sóc da, xử lý mụn, điều trị sẹo rỗ, nám, tàn nhang,
          vi kim tảo biển, PRP, tiêm Mesotherapy, phi kim, lăn kim, triệt lông, điện di,... Học viên được bác sĩ hỗ trợ chuyên môn trọn đời 
          ngay cả sau tốt nghiệp.
        </MKTypography>

        <MKTypography variant="h5" color="dark" mt={4} mb={2}>
          Xu hướng – Cơ hội nghề nghiệp trong ngành Spa
        </MKTypography>

        <MKTypography variant="body2" color="text" mb={5} sx={{ textAlign: "justify", letterSpacing: "0.8px" }}>
          Nhu cầu làm đẹp ngày càng cao mở ra thị trường rộng lớn cho ngành spa – thẩm mỹ. Những kỹ thuật viên (KTV) 
          có tay nghề vững, kỹ năng tư vấn tốt và thái độ phục vụ chuyên nghiệp luôn là lực lượng được săn đón tại các spa cao cấp, 
          phòng khám da liễu và thẩm mỹ viện.
        </MKTypography>

        <Grid container spacing={4} justifyContent="center">
  {[
    {
      image: demandImg,
      title: "Nhu cầu nhân lực",
      description:
        "Theo dự báo của Bộ Lao động, ngành spa sẽ cần 1 triệu nhân lực vào năm 2025 để đáp ứng nhu cầu thị trường. Cơ hội dành cho những ai yêu thích làm đẹp và có tay nghề cao."
    },
    {
      image: salaryImg,
      title: "Mức thu nhập hấp dẫn",
      description:
        "Học viên sau tốt nghiệp có thể đạt mức thu nhập từ 10–20 triệu/tháng. Tay nghề càng cao, kỹ năng tư vấn càng tốt, thu nhập càng vượt trội và ổn định."
    },
    {
      image: futureImg,
      title: "Định hướng mới",
      description:
        "Hàng nghìn bạn trẻ lựa chọn học nghề spa thay vì đại học. Kết thúc khoá học, có thể đi làm ngay hoặc mở cơ sở kinh doanh riêng với thu nhập đáng mơ ước."
    },
    {
      image: practiceImg,
      title: "Ngành nghề HOT",
      description:
        "Nghề spa chăm sóc da là nghề hiện đang không bao giờ lỗi thời, mức thu nhập hấp dẫn, môi trường làm việc sang trọng, phù hợp cho những bạn muốn gắn bó và phát triển lâu dài. Không chỉ làm trong nước, các bạn còn có thể làm việc tại quốc gia khác để tăng cơ hội phát triển nghề nghiệp"
    },
    {
      image: certificationImg,
      title: "Cơ hội thăng tiến",
      description:
        "Khởi điểm là một KTV Spa chuyên nghiệp, sau một thời gian tích lũy kinh nghiệm và kiến thức bạn sẽ được cân nhắc lên những vị trí cao hơn như: Trưởng kỹ thuật viên, Quản lý kỹ thuật viên, Quản lý spa hoặc đổi hướng kinh doanh ngành spa, chăm sóc da riêng."
    },
  ].map((card, index) => (
    <Grid key={index} item xs={12} sm={6} md={4} display="flex">
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia component="img" height="200" image={card.image} alt={card.title} />
        <CardContent sx={{ flexGrow: 1 }}>
          <MKTypography variant="h4" gutterBottom my={3} sx={{ textAlign: "center" }}>
            {card.title}
          </MKTypography>
          <MKTypography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "justify", letterSpacing: "0.8px" }}
          >
            {card.description}
          </MKTypography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

 

      </Container>
    </MKBox>
  );
}

export default TrainingPage;

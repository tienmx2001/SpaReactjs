// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import YouTubeIcon from "@mui/icons-material/YouTube";

// Material Kit 2 React components
import MKTypography from "components/MKTypography";

// Images
import logoSpa from "assets/images/spalogo.png";

const date = new Date().getFullYear();

export default {
  brand: {
    name: "Spa Eden",
    image: logoSpa,
    route: "/",

  },
  socials: [
    {
      icon: <FacebookIcon />,
      link: "https://www.facebook.com/CreativeTim/",
    },
    {
      icon: <TwitterIcon />,
      link: "https://twitter.com/creativetim",
    },
    {
      icon: <YouTubeIcon />,
      link: "https://www.youtube.com/channel/UCVyTG4sCw-rOvB9oHkzZD1w",
    },
  ],
  menus: [
    {
      name: "VỀ CHÚNG TÔI",
      items: [
        { name: "Giới thiệu", href: "/about" },
        { name: "Dịch vụ", href: "/services" },
        { name: "Khách hàng nói gì", href: "/testimonials" },
        { name: "Blog làm đẹp", href: "/blog" },
      ],
    },
    {
      name: "HỖ TRỢ",
      items: [
        { name: "Liên hệ", href: "/contact" },
        { name: "Câu hỏi thường gặp", href: "/faq" },
        { name: "Chính sách bảo mật", href: "/privacy-policy" },      ],
    },
    {
      name: "LIÊN KẾT NHANH",
      items: [
        { name: "Đặt lịch hẹn", href: "/booking" },
        { name: "Khuyến mãi", href: "/promotions" },
        { name: "Sản phẩm", href: "/products" },
      ],
    },
   
  ],
  copyright: (
    <MKTypography variant="button" fontWeight="regular">
    © {date}{" "}
    <MKTypography
      component="a"
      href="/"
      target="_blank"
      rel="noreferrer"
      variant="button"
      fontWeight="regular"
    >
      Spa Eden
    </MKTypography>
    . Mọi quyền được bảo lưu.
  </MKTypography>
  ),
};

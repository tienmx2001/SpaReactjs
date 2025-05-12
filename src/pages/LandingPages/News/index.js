import { useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import MKBox from "components/MKBox";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DefaultFooter from "examples/Footers/DefaultFooter";
import SimpleModal from "layouts/sections/attention-catchers/modals/components/SimpleModal";
import BlogList from "components/BlogList";
import routes from "routes";
import footerRoutes from "footer.routes";

function News() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <MKBox position="fixed" top="0.5rem" width="100%">
        <DefaultNavbar
          routes={routes}
          action={{
            type: "external",
            onClick: () => handleOpenModal(),
            label: "Đặt lịch ngay",
            color: "primary",
          }}
        />
        <SimpleModal open={showModal} onClose={handleCloseModal} />
      </MKBox>

      <Grid container alignItems="center" justifyContent="center">
        <MKBox
          bgColor="white"
          borderRadius="xl"
          shadow="lg"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          mt={{ xs: 20, sm: 18, md: 20 }}
          mb={{ xs: 20, sm: 18, md: 20 }}
          mx={3}
        >
     

          {/* Danh sách tin tức */}
          <MKBox pt={3} px={6} mb={6}>
            <BlogList className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" />
          </MKBox>
        </MKBox>
      </Grid>

      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default News;

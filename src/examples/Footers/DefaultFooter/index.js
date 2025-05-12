// react-router-dom components
import { Link } from "react-router-dom";

// prop-types for props validation
import PropTypes from "prop-types";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Heroicons (solid)
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

function DefaultFooter({ content }) {
  const { brand, socials, menus, copyright } = content;

  return (
    <MKBox component="footer" bgcolor="grey.100" py={6}>
      <Container>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={3} sx={{  mb: 1 }}>
            <MKBox>
              <Link to={brand.route}>
                <MKBox
                  component="img"
                  src={brand.image}
                  alt={brand.name}
                  maxWidth="2rem"
                  mb={1}
                />
              </Link>
              <MKTypography variant="h6" fontWeight="bold" color="text.primary">
                {brand.name}
              </MKTypography>
            </MKBox>

            <MKBox display="flex" alignItems="center" mt={2}>
              {socials.map(({ icon, link }, key) => (
                <MKTypography
                  key={link}
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  variant="h5"
                  color="primary"
                  mr={key === socials.length - 1 ? 0 : 2.5}
                  sx={{
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.25)", color: "secondary.main" },
                  }}
                >
                  {icon}
                </MKTypography>
              ))}
            </MKBox>
          </Grid>

          {menus.map(({ name: title, items }) => (
            <Grid key={title} item xs={6} md={2} sx={{ mb: 3 }}>
              <MKTypography
                display="block"
                variant="button"
                fontWeight="bold"
                mb={1}
                color="text.primary"
              >
                {title}
              </MKTypography>
              <MKBox component="ul" p={0} m={0} sx={{ listStyle: "none" }}>
                {items.map(({ name, route, href }) => (
                  <MKBox key={name} component="li" p={0} m={0} lineHeight={1.25} mb={0.5}>
                    {href ? (
                      <MKTypography
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        variant="button"
                        fontWeight="regular"
                        color="text.secondary"
                        sx={{ "&:hover": { color: "primary.main" } }}
                      >
                        {name}
                      </MKTypography>
                    ) : (
                      <MKTypography
                        component={Link}
                        to={route}
                        variant="button"
                        fontWeight="regular"
                        color="text.secondary"
                        sx={{ "&:hover": { color: "primary.main" } }}
                      >
                        {name}
                      </MKTypography>
                    )}
                  </MKBox>
                ))}
              </MKBox>
            </Grid>
          ))}

          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            <MKBox display="flex" justifyContent="center" alignItems="center" gap={1}>
              <MapPinIcon className="w-5 h-5 text-primary" />
              <MKTypography variant="button" color="text.secondary">
                123 Đường Hoa Mai, Quận Phú Nhuận, TP.HCM
              </MKTypography>
            </MKBox>
            <MKBox display="flex" justifyContent="center" alignItems="center" gap={1} mt={1}>
              <PhoneIcon className="w-5 h-5 text-primary" />
              <MKTypography variant="button" color="text.secondary">
                0123 456 789
              </MKTypography>
            </MKBox>
            <MKBox display="flex" justifyContent="center" alignItems="center" gap={1} mt={1}>
              <EnvelopeIcon className="w-5 h-5 text-primary" />
              <MKTypography variant="button" color="text.secondary">
                lienhe@spanhumo.vn
              </MKTypography>
            </MKBox>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center", mt: 4 }}>
            {copyright}
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

DefaultFooter.propTypes = {
  content: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])).isRequired,
};

export default DefaultFooter;

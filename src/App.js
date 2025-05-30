import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Dashboard, Auth } from "admin/layouts";
import NewsPage from "pages/LandingPages/News/sections/news";
import ServicesPage from "pages/LandingPages/Services/services";
import PrivateRoute from "apis/privateRoute";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
// import Presentation from "layouts/pages/presentation";

// Material Kit 2 React routes
import routes from "routes";

import Login from "admin/login";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
  {getRoutes(routes)}

  <Route path="/login" element={<Login />} />

  <Route
    path="/news/:id"
    element={
        <NewsPage />
    }
  />
  <Route
    path="/services/:id"
    element={
        <ServicesPage />
    }
  />
  <Route
    path="/dashboard/*"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />

  <Route path="/auth/*" element={<Auth />} />
  <Route path="*" element={<Navigate to="/presentation" />} />
</Routes>
    </ThemeProvider>
  );
}

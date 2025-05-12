// src/components/PrivateRoute.js
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";


const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Gọi API kiểm tra session đăng nhập
    axios.get("http://localhost:5000/api/check-auth", { withCredentials: true }) // `withCredentials` để gửi cookie
      .then(res => {
        if (res.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return null; // hoặc loading spinner
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };
  
  export default PrivateRoute;

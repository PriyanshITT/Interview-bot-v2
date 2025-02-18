import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
  
    return <Navigate to="/login" />;
  }

  
  return children;
};

export default PrivateRoute;

// This page now redirects to the Traffic Dashboard.

import { Navigate } from "react-router-dom";

const Index = () => {
  return <Navigate to="/dashboard" replace />;
};

export default Index;
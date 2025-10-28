// src/components/ProtectedRoute.jsx
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Agar user state empty hai, backend se check karo
        if (!user) {
          const res = await axios.get("https://bookswap-yi4i.onrender.com/api/auth/me", {
            withCredentials: true,
          });
          setUser(res.data.user); // AuthContext me set karo
        }
      } catch (err) {
        console.log("Not logged in", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, setUser]);

  if (loading) return <div>Loading...</div>; // Ya spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

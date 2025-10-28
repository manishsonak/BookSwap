import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  
  

  const handleLogout = async () => {
    try {
      await axios.post("https://bookswap-yi4i.onrender.com/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.log("Logout error:", err.response?.data);
    }
    logout();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          BookSwap
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          {user ? (
            <>
              {/* <Link to="/books" className="hover:text-gray-200">Books</Link> */}
              <Link to="/my-books" className="hover:text-gray-200">My Books</Link>
              <Link to="/requests" className="hover:text-gray-200">Requests</Link>
              <p className="text-center text-sm "><b> {user.name.split(" ")[0].toUpperCase()} </b></p>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-200">Login</Link>
              <Link to="/signup" className="hover:text-gray-200">Signup</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 bg-blue-700 p-4 rounded-lg">
          {user ? (
            <>
              <Link to="/books" onClick={() => setMenuOpen(false)}>Books</Link>
              <Link to="/my-books" onClick={() => setMenuOpen(false)}>My Books</Link>
              <Link to="/requests" onClick={() => setMenuOpen(false)}>Requests</Link>
            <p className="text-center text-sm "><b> {user.name.split(" ")[0].toUpperCase()} </b></p>
              {/* <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link> */}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

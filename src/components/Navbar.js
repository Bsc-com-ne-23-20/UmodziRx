import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Navbar() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("mosipToken");
    setIsAuthenticated(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("mosipToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">UmodziRx</h1>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className={`hover:underline ${
                location.pathname === "/" ? "font-bold" : ""
              }`}
            >
              Home
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`hover:underline ${
                    location.pathname === "/dashboard" ? "font-bold" : ""
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/prescriptions"
                  className={`hover:underline ${
                    location.pathname === "/prescriptions" ? "font-bold" : ""
                  }`}
                >
                  Prescriptions
                </Link>
              </li>
              <li>
                <Link
                  to="/verify"
                  className={`hover:underline ${
                    location.pathname === "/verify" ? "font-bold" : ""
                  }`}
                >
                  Verify
                </Link>
              </li>
            </>
          )}
        </ul>
        <div>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className={`bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg ${
                location.pathname === "/login" ? "font-bold" : ""
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

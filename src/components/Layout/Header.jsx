import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import axios from "../../api/axios";
import LoginModal from "../../pages/authPages/Login";

const Header = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'job_seeker' | 'employer' | null
  const [expanded, setExpanded] = useState(false);
  const [modalState, setModalState] = useState(null);
  const navigate = useNavigate();

  const handleMyAccount = () => {
    navigate("/profile");
  };

  const logout = async () => {
    try {
      const res = await axios.post("/auth/logout");

      if (res.data.success) {
        toast.success(res.data.message || "Logged out successfully");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setUser(null);
        setRole(null);
        navigate("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  const ProfileMenu = () => (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="light"
        className="d-flex align-items-center gap-2 bg-transparent border-0"
        id="dropdown-basic"
      >
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt="User"
            className="rounded-circle"
            style={{ width: "30px", height: "30px", objectFit: "cover" }}
          />
        ) : (
          <FaUserCircle size={30} className="text-black" />
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            setExpanded(false);
            handleMyAccount();
          }}
        >
          My Account
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          onClick={logout}
          className="d-flex justify-content-between"
        >
          Logout
          <IoLogOutOutline size={20} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      <Toaster reverseOrder={false} />
      <Navbar
        bg="light"
        expand="lg"
        className="py-3 px-3 px-md-5 shadow-sm"
        expanded={expanded}
      >
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={() => setExpanded(false)}
            className="!text-4xl fw-bold"
          >
            Job<span className="text-danger">Hunt</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              {/* === Admin === */}
              {role === "admin" && (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin-dashboard"
                    onClick={() => setExpanded(false)}
                  >
                    Dashboard
                  </Nav.Link>
                  <ProfileMenu />
                </>
              )}

              {/* === Employer === */}
              {role === "employer" && (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/employer-dashboard"
                    onClick={() => setExpanded(false)}
                  >
                    Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/post-job"
                    onClick={() => setExpanded(false)}
                  >
                    Post Job
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/manage-applications"
                    onClick={() => setExpanded(false)}
                  >
                    Manage Applications
                  </Nav.Link>
                  <ProfileMenu />
                </>
              )}

              {/* === Job Seeker === */}
              {role === "job_seeker" && (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/job"
                    onClick={() => setExpanded(false)}
                  >
                    Jobs
                  </Nav.Link>
                  <ProfileMenu />
                </>
              )}

              {/* === Not Logged In === */}
              {!role && (
                <>
                  <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/job"
                    onClick={() => setExpanded(false)}
                  >
                    Jobs
                  </Nav.Link>

                  <Nav.Link onClick={() => setModalState("login")}>
                    Login
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/signup"
                    onClick={() => setExpanded(false)}
                  >
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}

      <LoginModal
        modalState={modalState}
        setModalState={setModalState}
        onLoginSuccess={(user) => {
          setUser(user);
          setRole(user.role);
        }}
      />
    </>
  );
};

export default Header;

import React, { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignInAlt,
  faHome,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

export const NavbarMenu = () => {
  const { setIsLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleRegister = () => {
    setIsLogin(false);
    navigate("/register");
  };

  const handleLogin = () => {
    setIsLogin(true);
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand id="brand-text">
          <img
            src="/libro-menu.jpeg"
            alt="Imagen de libro abierto"
            width="60"
            height="40"
            className="d-inline-block align-middle"
          />{" "}
          <b>Biblioteca Virtual</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faHome} className="me-2" />
              Home
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/user/books")}>
              <FontAwesomeIcon icon={faBookOpen} className="me-2" />
              Ver libros
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleRegister}>
              <FontAwesomeIcon icon={faUserPlus} className="me-2" />
              Registro
            </Nav.Link>
            <Nav.Link onClick={handleLogin}>
              <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

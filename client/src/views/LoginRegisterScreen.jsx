import React, { useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { UserContext } from "../contexts/UserContext";
import { LoginContext } from "../contexts/LoginContext";
import { UserFormAntd } from "../components/UserFormAntd";
import { Row } from "antd";
// import styles from "../scss/LoginRegisterScreen.module.scss";

export const LoginRegisterScreen = () => {
  const { isLogin, setIsLogin } = useContext(LoginContext);
  const { user } = useContext(UserContext);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (user?.role === "admin") {
      history.push("/admin/books");
    } else if (user?.role === "basic") {
      history.push("/user/books");
    }
    location.pathname === "/register" ? setIsLogin(false) : setIsLogin(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className="m-3 w-75 mx-auto">
      <Row>
        <UserFormAntd titleSubmitButton={isLogin ? "Login" : "Registro"} />
      </Row>
    </Container>
  );
};

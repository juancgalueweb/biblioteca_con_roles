import React, { useState, useContext } from "react";
import { Row, Col, Button } from "antd";
import Container from "react-bootstrap/Container";
import ReactPinField from "react-pin-field";
import styles from "../scss/VerifyEmail.module.scss";
import { axiosWithoutToken } from "../helpers/axios";
import { LoginContext } from "../contexts/LoginContext";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

export const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [, setCompleted] = useState(false);
  const { setIsLogin } = useContext(LoginContext);
  const history = useHistory();

  const storedData = JSON.parse(localStorage.getItem("validateEmail"));

  const dataToAxios = {
    userId: storedData?.userId,
    otp: code,
    token: storedData?.token,
  };
  // console.log("Data to axios", dataToAxios);

  const validateEmail = async () => {
    try {
      const isValidated = await axiosWithoutToken(
        "auth/verify-email",
        dataToAxios,
        "POST"
      );
      if (isValidated.data.success) {
        Swal.fire({
          icon: "success",
          title: `<strong>${storedData?.firstName}</strong>, gracias por validar su e-mail`,
          showConfirmButton: true,
          confirmButtonText: "Ir al login",
        }).then((result) => {
          if (result.isConfirmed) {
            setIsLogin(true);
            history.push("/login");
          }
        });
        localStorage.removeItem("validateEmail");
      }
    } catch (err) {
      if (err?.response?.data) {
        const { data } = err.response;
        Swal.fire({
          icon: "error",
          title: `${data.msg}`,
          confirmButtonText: "Oh no!",
        });
        if (data.jwtError) {
          localStorage.removeItem("validateEmail");
          history.push("/login");
        }
      }
    }
  };

  return (
    <Container className="m-3 w-75 mx-auto">
      <Row>
        <Col span={14} className="border rounded bg-light mx-auto pb-2 pt-4">
          <h2 className="text-center">Ingrese el pin para validar su e-mail</h2>
          <p className="lead fw-lighter m-4">
            Tendrá 10 minutos para validar su e-mail, de lo contrario tendrá que
            solicitar otro PIN manualmente desde la ruta del Login.
          </p>
          <Row>
            <Col span={8}></Col>
            <Col span={8}>
              <ReactPinField
                length={4}
                className={styles.pinField}
                onChange={setCode}
                onComplete={() => setCompleted(true)}
                format={(k) => k.toUpperCase()}
                validate="0123456789"
                autoFocus
              />
            </Col>
            <Col span={8}></Col>
          </Row>

          <Col span={18} className="mx-auto text-center my-2">
            <Button type="primary" onClick={validateEmail} className="m-4">
              Validar e-mail
            </Button>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

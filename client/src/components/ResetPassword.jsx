//TODO: corregir que cuando la clave es igual a la anterior, no te redirija al login

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Button, Alert, Spin } from "antd";
import Container from "react-bootstrap/Container";
import { LockOutlined } from "@ant-design/icons";
import { axiosWithoutToken } from "../helpers/axios";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Swal from "sweetalert2";

export const ResetPassword = () => {
  const location = useLocation();
  const history = useHistory();
  const [invalidUser, setInvalidUser] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const formItemLayout = {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const [form] = Form.useForm();
  const { token, id } = queryString.parse(location.search);

  const verifyToken = async () => {
    try {
      await axiosWithoutToken(`auth/verify-token?token=${token}&id=${id}`);
      setLoaded(true);
    } catch (error) {
      if (!error?.response?.data.success) {
        return setInvalidUser(error?.response?.data?.msg);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      verifyToken();
    }, 500);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetPassword = async (values) => {
    try {
      const newPass = await axiosWithoutToken(
        `auth/reset-password?token=${token}&id=${id}`,
        { password: values.password },
        "POST"
      );
      setLoaded(true);
      // console.log(newPass.data);
      if (newPass?.data?.success) {
        Swal.fire({
          icon: "success",
          title: `${newPass.data.msg}`,
          showConfirmButton: false,
          timer: 2400,
        });
        setTimeout(() => {
          history.push("/login");
        }, 2500);
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
          history.push("/login");
        }
      }
    }
  };

  if (invalidUser) {
    return (
      <Container className="m-3 w-75 mx-auto">
        <Alert
          message={invalidUser}
          type="error"
          className="text-center fs-3"
        />
      </Container>
    );
  }

  return (
    <>
      {loaded ? (
        <Container className="m-3 w-75 mx-auto">
          <Row>
            <Col
              span={14}
              className="border rounded bg-light mx-auto pb-2 pt-4"
            >
              <h2 className="text-center">Ingrese su nueva contraseña</h2>
              <Col span={18} className="mx-auto pb-2 pt-4">
                <Form
                  form={form}
                  {...formItemLayout}
                  onFinish={resetPassword}
                  initialValues={{
                    password: "",
                    passwordConfirmation: "",
                  }}
                  onFinishFailed={onFinishFailed}
                >
                  <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingrese su nueva contraseña",
                      },
                      { min: 8, message: "Mínimo 8 caracteres" },
                      { max: 20, message: "Máximo 20 caracteres" },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="********"
                    />
                  </Form.Item>

                  <Form.Item
                    name="passwordConfirmation"
                    label="Confirmar contraseña"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Por favor, confirme su nueva contraseña",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Las contraseñas ingresadas no coinciden")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="********"
                    />
                  </Form.Item>

                  <Col span={18} className="mx-auto text-center my-2">
                    <Button type="primary" htmlType="submit">
                      Restablecer contraseña
                    </Button>
                  </Col>
                </Form>
              </Col>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container className="m-3 w-75 mx-auto text-center">
          <Spin size="large" style={{ marginTop: "100px" }} />
        </Container>
      )}
    </>
  );
};

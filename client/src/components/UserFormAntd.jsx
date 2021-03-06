import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Input, Button, Checkbox, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LoginContext } from "../contexts/LoginContext";
import { UserContext } from "../contexts/UserContext";
import Swal from "sweetalert2";
import { axiosWithoutToken } from "../helpers/axios";
import Container from "react-bootstrap/Container";

export const UserFormAntd = (props) => {
  const { titleSubmitButton } = props;
  const [askSecret, setAskSecret] = useState(false);
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

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const [form] = Form.useForm();

  //Apis de registrar y login
  const { isLogin, setIsLogin } = useContext(LoginContext);
  const { setUser } = useContext(UserContext);
  const history = useHistory();
  const KEY = "biblioteca-app";

  //Registro de usuario
  const registerUser = async (values) => {
    delete values["admin"];
    try {
      if (values.secretPhrase) {
        delete values["secretPhrase"];
        const adminData = await axiosWithoutToken(
          "auth/register",
          { ...values, role: "admin" },
          "POST"
        );
        localStorage.setItem(
          "validateEmail",
          JSON.stringify({
            userId: adminData.data.user?._id,
            firstName: adminData.data.user?.firstName,
            token: adminData.data.token,
          })
        );
      } else {
        const basicData = await axiosWithoutToken(
          "auth/register",
          values,
          "POST"
        );
        // console.log(basicData.data);
        localStorage.setItem(
          "validateEmail",
          JSON.stringify({
            userId: basicData.data.user?._id,
            firstName: basicData.data.user?.firstName,
            token: basicData.data.token,
          })
        );
      }
      Swal.fire({
        icon: "success",
        title: `<strong>${values.firstName}</strong>, bienvenid@. Revise su inbox para validar su e-mail`,
        showConfirmButton: true,
        confirmButtonText: "Ok!",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/verify-email");
        }
      });
      form.resetFields();
    } catch (err) {
      if (err?.response?.data) {
        const { data } = err.response;
        Swal.fire({
          icon: "error",
          title: `${data.msg}`,
          confirmButtonText: "Lo arreglar??!",
        });
      }
    }
  };

  //Login de usuario
  const loginUser = async (values) => {
    try {
      const userData = await axiosWithoutToken("auth/login", values, "POST");
      // console.log("User from axios", userData.data);
      setUser(userData.data);
      localStorage.setItem(KEY, JSON.stringify(userData.data));
      Swal.fire({
        icon: "success",
        title: "Inici?? de sesi??n exitosa!",
        showConfirmButton: false,
        timer: 2400,
      });
      setTimeout(() => {
        if (userData.data.role === "admin") {
          history.push("/admin/books");
        } else {
          history.push("/user/books");
        }
      }, 2500);
    } catch (err) {
      // console.log(err);
      Swal.fire({
        icon: "error",
        title: `${err.response.data.msg}`,
        confirmButtonText: "Lo revisar??!",
      });
    }
  };

  const handleOnClick = () => {
    if (isLogin) {
      setIsLogin(false);
      history.push("/register");
    } else {
      setIsLogin(true);
      history.push("/login");
    }
  };

  const onChange = (e) => {
    // console.log("Valor del checkbox", e.target.checked);
    e.target.checked === true && !isLogin
      ? setAskSecret(true)
      : setAskSecret(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  if (loaded) {
    return (
      <Col span={14} className="border rounded bg-light mx-auto pb-2 pt-4">
        {isLogin ? (
          <h2 className="text-center">Login</h2>
        ) : (
          <h2 className="text-center">Registro</h2>
        )}
        <Row>
          <Col span={18} className="mx-auto pb-2 pt-4">
            <Form
              form={form}
              {...formItemLayout}
              onFinish={isLogin ? loginUser : registerUser}
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                passwordConfirmation: "",
              }}
              onFinishFailed={onFinishFailed}
            >
              {!isLogin ? (
                <Form.Item
                  label="Nombre"
                  name="firstName"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Por favor, ingrese su nombre",
                    },
                    { min: 3, message: "M??nimo 3 caracteres" },
                  ]}
                >
                  <Input placeholder="John" />
                </Form.Item>
              ) : null}

              {!isLogin ? (
                <Form.Item
                  label="Apellido"
                  name="lastName"
                  rules={[
                    {
                      type: "string",
                      required: true,
                      message: "Por favor, ingrese su apellido",
                    },
                    { min: 3, message: "M??nimo 3 caracteres" },
                  ]}
                >
                  <Input placeholder="Wick" />
                </Form.Item>
              ) : null}

              <Form.Item
                label="Correo electr??nico"
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Por favor, ingrese un email v??lido",
                  },
                ]}
              >
                {isLogin ? (
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="correo@dominio.com"
                  />
                ) : (
                  <Input placeholder="correo@dominio.com" />
                )}
              </Form.Item>

              <Form.Item
                label="Contrase??a"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingrese su contrase??a",
                  },
                  { min: 8, message: "M??nimo 8 caracteres" },
                  { max: 20, message: "M??ximo 20 caracteres" },
                ]}
                hasFeedback
              >
                {isLogin ? (
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="********"
                  />
                ) : (
                  <Input.Password placeholder="********" />
                )}
              </Form.Item>

              {!isLogin ? (
                <Form.Item
                  name="passwordConfirmation"
                  label="Confirmar contrase??a"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Por favor, confirme su contrase??a",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Las contrase??as ingresadas no coinciden")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="********" />
                </Form.Item>
              ) : null}

              {!isLogin ? (
                <>
                  <Form.Item
                    name="admin"
                    valuePropName="checked"
                    {...tailFormItemLayout}
                  >
                    <Checkbox onChange={onChange}>
                      Quiero registrarme como admin
                    </Checkbox>
                  </Form.Item>
                </>
              ) : null}

              {askSecret && !isLogin ? (
                <Form.Item
                  label="Secreto"
                  name="secretPhrase"
                  rules={[
                    {
                      validator: (_, value) =>
                        value === process.env.REACT_APP_SECRET
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Secreto incorrecto para ser admin")
                            ),
                    },
                  ]}
                >
                  <Input.Password placeholder="Ingrese el secreto para ser admin" />
                </Form.Item>
              ) : null}

              <Button
                type="primary"
                htmlType="submit"
                className="mb-3 login-form-button"
              >
                {titleSubmitButton}
              </Button>
              <Col span={24} className="d-flex justify-content-between mb-3">
                {isLogin ? (
                  <>
                    <a className="login-form-forgot" href="/forgot-password">
                      Olvid?? mi contrase??a
                    </a>
                    <a className="login-form-forgot" href="/late-validation">
                      Verificar mi e-mail
                    </a>
                  </>
                ) : null}
              </Col>
              <Button onClick={handleOnClick}>
                Ir al {isLogin ? "registro" : "login"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Col>
    );
  } else {
    return (
      <Container className="m-3 w-75 mx-auto text-center">
        <Spin size="large" style={{ marginTop: "100px" }} />
      </Container>
    );
  }
};

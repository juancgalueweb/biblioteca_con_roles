import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LoginContext } from "../contexts/LoginContext";
import { UserContext } from "../contexts/UserContext";
import Swal from "sweetalert2";
import { axiosWithoutToken } from "../helpers/axios";

export const UserFormAntd = (props) => {
  const { titleSubmitButton } = props;

  const [askSecret, setAskSecret] = useState(false);

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
    // console.log("Values del registro", values);
    try {
      if (values.secretPhrase) {
        delete values["secretPhrase"];
        await axiosWithoutToken(
          "auth/register",
          { ...values, role: "admin" },
          "POST"
        );
      } else {
        axiosWithoutToken("auth/register", values, "POST");
      }
      Swal.fire({
        icon: "success",
        title: `<strong>${values.firstName}</strong> se registró exitosamente. Por favor, inicie sesión`,
        showConfirmButton: true,
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsLogin(true);
          history.push("/login");
        }
      });
      form.resetFields();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        html: `<ul class="swal-list">${err.response.data.map(
          (error) => `<li>${error}</li>`
        )}</ul>`,
        confirmButtonText: "Lo arreglaré!",
      });
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
        title: "Inició de sesión exitosa!",
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
      console.log(err);
      Swal.fire({
        icon: "error",
        title: `${err.response.data.msg}`,
        confirmButtonText: "Lo revisaré!",
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
    e.target.checked === true && !isLogin
      ? setAskSecret(true)
      : setAskSecret(false);
  };

  return (
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
                { min: 3, message: "Mínimo 3 caracteres" },
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
                { min: 3, message: "Mínimo 3 caracteres" },
              ]}
            >
              <Input placeholder="Wick" />
            </Form.Item>
          ) : null}

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Por favor, ingrese un email válido",
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
            label="Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese su contraseña",
              },
              { min: 8, message: "Mínimo 8 caracteres" },
              { max: 20, message: "Máximo 20 caracteres" },
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
              label="Confirmar contraseña"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Por favor, confirme su contraseña",
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

          <Button type="primary" htmlType="submit" className="mb-3">
            {titleSubmitButton}
          </Button>

          {isLogin ? (
            <Form.Item>
              <a className="login-form-forgot" href="/forgot-password">
                Olvidé mi contraseña
              </a>
            </Form.Item>
          ) : null}
          {!isLogin ? <br /> : null}
          <Button onClick={handleOnClick}>
            Ir al {isLogin ? "registro" : "login"}
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

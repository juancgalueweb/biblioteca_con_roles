import React from "react";
import { Form, Row, Col, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Container from "react-bootstrap/Container";
import Swal from "sweetalert2";
import { axiosWithoutToken } from "../helpers/axios";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
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
  const navigate = useNavigate();
  //Validar correo de usuario que olvidó la contraseña
  const forgotPassword = async (values) => {
    try {
      const user = await axiosWithoutToken(
        "auth/forgot-password",
        values,
        "POST"
      );
      // console.log(user.data);
      Swal.fire({
        icon: "success",
        title: `${user?.data?.msg}`,
        confirmButtonText: "Gracias!",
      });
    } catch (error) {
      // console.log(error.response.data);
      Swal.fire({
        icon: "error",
        title: `${error?.response?.data?.msg}`,
        confirmButtonText: "Oh no!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <Container className="m-3 w-75 mx-auto">
      <Row>
        <Col span={14} className="border rounded bg-light mx-auto pb-2 pt-4">
          <h2 className="text-center">Recuperar contraseña olvidada</h2>
          <Col span={18} className="mx-auto pb-2 pt-4">
            <Form
              form={form}
              {...formItemLayout}
              onFinish={forgotPassword}
              initialValues={{
                email: "",
              }}
              onFinishFailed={onFinishFailed}
            >
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
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="correo@dominio.com"
                />
              </Form.Item>
              <Col span={18} className="mx-auto text-center my-2">
                <Button type="primary" htmlType="submit">
                  Enviarme link para resetear contraseña
                </Button>
              </Col>
            </Form>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

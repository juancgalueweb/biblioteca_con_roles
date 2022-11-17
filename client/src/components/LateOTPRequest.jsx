import React from "react";
import { Form, Row, Col, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Container from "react-bootstrap/Container";
import Swal from "sweetalert2";
import { axiosWithoutToken } from "../helpers/axios";
import { useNavigate } from "react-router-dom";

export const LateOTPRequest = () => {
  const navigate = useNavigate();
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

  //Enviar OTP para validar e-mail
  const sendValidationOTP = async (values) => {
    try {
      const response = await axiosWithoutToken(
        "auth/late-verify-email",
        values,
        "POST"
      );
      // console.log("all good", response.data);
      localStorage.setItem(
        "validateEmail",
        JSON.stringify({
          userId: response.data.user?._id,
          firstName: response.data.user?.firstName,
          token: response.data.token,
        })
      );
      Swal.fire({
        icon: "success",
        title: "Revise su inbox para validar su e-mail",
        showConfirmButton: true,
        confirmButtonText: "Ok!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/verify-email");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `${error?.response?.data?.msg}`,
        confirmButtonText: "Oh no!",
      });
    }
  };

  return (
    <Container className="m-3 w-75 mx-auto">
      <Row>
        <Col span={14} className="border rounded bg-light mx-auto pb-2 pt-4">
          <h2 className="text-center">Ingresar e-mail a validar</h2>
          <Col span={18} className="mx-auto pb-2 pt-4">
            <Form
              form={form}
              {...formItemLayout}
              onFinish={sendValidationOTP}
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
                  Enviarme PIN para validar e-mail
                </Button>
              </Col>
            </Form>
          </Col>
        </Col>
      </Row>
    </Container>
  );
};

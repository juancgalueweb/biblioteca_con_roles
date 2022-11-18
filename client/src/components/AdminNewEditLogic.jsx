import React from "react";
import { Form, Select, InputNumber, Button, Input, Row, Col } from "antd";

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export const AdminNewEditLogic = ({
  processSubmit,
  initialValues,
  titleButton,
}) => {
  const [form] = Form.useForm();
  return (
    <Row>
      <Col
        span={22}
        className="border rounded mx-auto pb-2 pt-4 light-background"
      >
        <Form
          form={form}
          name="validate_other"
          {...formItemLayout}
          onFinish={processSubmit}
          initialValues={initialValues}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Autor del libro"
            name="author"
            rules={[
              {
                type: "string",
                required: true,
                message: "Por favor, ingrese el autor del libro",
              },
              { min: 4, message: "Mínimo 4 caracteres" },
            ]}
          >
            <Input placeholder="J. K. Rowling" />
          </Form.Item>

          <Form.Item
            label="Título del libro"
            name="title"
            rules={[
              {
                type: "string",
                required: true,
                message: "Por favor, ingrese el título del libro",
              },
              { min: 5, message: "Mínimo 5 caracteres" },
            ]}
          >
            <Input placeholder="Harry Potter y la piedra filosofal" />
          </Form.Item>

          <Form.Item label="Año de publicación">
            <Form.Item
              name="year"
              rules={[
                {
                  type: "number",
                  required: true,
                  message: "Por favor, ingrese el año de la publicación",
                },
              ]}
            >
              <InputNumber min={1500} max={2100} placeholder="2020" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Editorial"
            name="publisher"
            rules={[
              {
                type: "string",
                required: true,
                message: "Por favor, ingrese la editorial",
              },
            ]}
          >
            <Input placeholder="Salamandra" />
          </Form.Item>

          <Form.Item
            label="Género literario"
            name="subject"
            rules={[
              {
                required: true,
                message: "Por favor, ingrese un género literario",
              },
            ]}
          >
            <Select>
              <Option value="">Seleccione un género literario...</Option>
              <Option value="Suspenso">Suspenso</Option>
              <Option value="Acción">Acción</Option>
              <Option value="Historia">Historia</Option>
              <Option value="Ficción">Ficción</Option>
              <Option value="Autoayuda">Autoayuda</Option>
              <Option value="Literatura">Literatura</Option>
              <Option value="Drama">Drama</Option>
              <Option value="Novela">Novela</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Número de páginas">
            <Form.Item
              name="numberOfPages"
              rules={[
                {
                  type: "number",
                  required: true,
                  message: "Por favor, ingrese la cantidad de páginas",
                },
              ]}
            >
              <InputNumber min={0} max={2000} placeholder="345" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Img url del libro"
            name="bookImageUrl"
            rules={[
              {
                type: "url",
                message: "Por favor, ingrese una URL válida",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 12,
              offset: 6,
            }}
          >
            <Button type="primary" htmlType="submit">
              {titleButton}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

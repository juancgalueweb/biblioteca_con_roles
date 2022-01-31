import React from "react";
import styles from "../scss/BookEditRC.module.scss";
import { Form, Input, Button, Row, Col, Rate } from "antd";
import noBookCover from "../images/book-without-cover.gif";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

export const BookEditRC = ({ processSubmit, initialValues, titleButton }) => {
  const [form] = Form.useForm();
  return (
    <div className="border rounded mx-auto pb-2 pt-4 light-background w-50 d-flex flex-column align-items-center">
      <div className={styles.static}>
        <img
          src={
            initialValues.bookImageUrl
              ? initialValues.bookImageUrl
              : noBookCover
          }
          alt={`portada del libro ${initialValues.title}`}
        ></img>
        <p>Autor: {initialValues.author}</p>
        <p>Título: {initialValues.title}</p>
      </div>
      <Row>
        <Col className={styles.centrar}>
          <Form
            form={form}
            name="validate_other"
            onFinish={processSubmit}
            initialValues={{
              rating: initialValues.rating ? initialValues.rating : null,
              comment: initialValues.comment,
            }}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="rating"
              label="Valoración"
              rules={[
                {
                  required: true,
                  message: "Debe seleccionar un rating",
                },
                {
                  validator: (_, value) => {
                    if (value > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("El rating no puede ser cero")
                    );
                  },
                },
              ]}
            >
              <Rate allowHalf />
            </Form.Item>
            <Form.Item
              name={["comment"]}
              label="Comentario"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "Debe ingresar un comentario",
                },
                { min: 10, message: "Mínimo 10 caracteres" },
              ]}
            >
              <Input.TextArea
                placeholder="Deja un comentario al libro..."
                showCount
                maxLength={400}
                style={{ width: 600 }}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                span: 12,
                offset: 10,
              }}
            >
              <Button type="primary" htmlType="submit">
                {titleButton}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

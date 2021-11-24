import React from "react";
import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "../scss/UserForm.module.scss";

const UserForm = (props) => {
  const { isLogin, formHandler, nameButton } = props;
  const registerSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "El usuario requiere un nombre")
      .required("Debe ingresar un nombre"),
    lastName: Yup.string()
      .min(3, "El usuario requiere un apellido")
      .required("Debe ingresar un apellido"),
    email: Yup.string()
      .email("Formato de email inválido")
      .required("Debe ingresar un email"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("Ingrese una contraseña"),
    confirmPassword: Yup.string()
      .required("Ingrese contraseña")
      .oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir"),
  });

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Formato de email inválido")
      .required("Debe ingresar un email"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("Ingrese una contraseña"),
  });
  return (
    <>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={isLogin ? loginSchema : registerSchema}
        onSubmit={formHandler}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>
                    <span className={styles.isRequired}>*</span> Nombre
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Nombre"
                    value={values.firstName}
                    onChange={handleChange}
                    isValid={touched.firstName && !errors.firstName}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>
                    <span className={styles.isRequired}>*</span> Apellido
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Apellido"
                    value={values.lastName}
                    onChange={handleChange}
                    isValid={touched.lastName && !errors.lastName}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                <span className={styles.isRequired}>*</span> Correo electrónico
              </Form.Label>
              <Form.Control
                type="string"
                name="email"
                placeholder="tu_correo@dominio.com"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>
                <span className={styles.isRequired}>*</span> Contraseña
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            {!isLogin && (
              <Form.Group className="mb-3" controlId="passwordConfirm">
                <Form.Label>
                  <span className={styles.isRequired}>*</span> Confirmar
                  contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  isValid={touched.confirmPassword && !errors.confirmPassword}
                  isInvalid={!!errors.confirmPassword}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            )}
            <Button variant="primary" type="submit" className="my-2">
              {nameButton}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserForm;

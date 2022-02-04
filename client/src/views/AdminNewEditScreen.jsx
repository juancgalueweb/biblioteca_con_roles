import React, { useState, useContext, useEffect } from "react";
import { Button, Row, Col } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { AdminNewEditLogic } from "../components/AdminNewEditLogic";
import Swal from "sweetalert2";
import { axiosWithToken } from "../helpers/axios";
import { UserContext } from "../contexts/UserContext";

const KEY = "biblioteca-app";

export const AdminNewEditScreen = () => {
  const startingData = {
    author: "",
    title: "",
    year: "",
    publisher: "",
    subject: "",
    numberOfPages: "",
    bookImageUrl: "",
  };

  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [initialData, setInitialData] = useState(startingData);
  const { id } = useParams();

  const getBookById = async () => {
    try {
      const book = await axiosWithToken(`book/${id}`);
      // console.log("Data del libro de axios", book.data);
      setInitialData(book.data);
      setLoaded(true);
    } catch (err) {
      // console.log("Error al obtener un libro por su ID", err);
      if (err.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Su sesión ha expirado. Debe volver a iniciar sesión.",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          handleLogOut();
        }, 2100);
      }
    }
  };

  const newBook = async (values) => {
    // console.log("Values adentro del newBook", values);
    try {
      await axiosWithToken(
        "book/create",
        { ...values, adminId: user._id },
        "POST"
      );
      Swal.fire({
        icon: "success",
        title: "Libro registrado con éxito",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        history.push("/admin/books");
      }, 2100);
    } catch (err) {
      // console.log(err.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response.data.message,
        confirmButtonText: "Aceptar",
      });
      if (err.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Su sesión ha expirado. Debe volver a iniciar sesión.",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          handleLogOut();
        }, 2100);
      }
    }
  };

  const updateBookById = async (values) => {
    try {
      await axiosWithToken(`book/update/${id}`, values, "PUT");
      // console.log("Respuesta al actualizar libro", response);
      Swal.fire({
        icon: "success",
        title: "El libro fue modificado",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        history.push("/admin/books");
      }, 2100);
    } catch (err) {
      // console.log("Error al modificar el libro", err);
      if (err.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Su sesión ha expirado. Debe volver a iniciar sesión.",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          handleLogOut();
        }, 2100);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, history]);

  useEffect(() => {
    const fetchData = async () => {
      // console.log("Id del useEffect", id);
      if (id) {
        await getBookById();
      } else {
        setLoaded(true);
      }
    };
    fetchData();
  }, [id]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem(KEY);
    history.push("/login");
  };

  return (
    <>
      <Row justify="center">
        <Col span={22}>
          <p className="text-end">Hola, {user?.firstName}</p>
          <Button
            type="primary"
            danger
            className="float-end"
            onClick={handleLogOut}
          >
            Cerrar sesión
          </Button>
          <br />
          <Button
            type="primary"
            className="d-block"
            onClick={() => history.push("/admin/books")}
          >
            Lista de libros
          </Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          {loaded && user?.role === "admin" ? (
            <AdminNewEditLogic
              processSubmit={id !== undefined ? updateBookById : newBook}
              initialValues={initialData}
              titleButton={id !== undefined ? "Actualizar" : "Crear"}
            />
          ) : (
            <h1>No tiene rol de administrador</h1>
          )}
        </Col>
      </Row>
    </>
  );
};

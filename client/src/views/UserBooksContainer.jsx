import React, { useState, useContext, useEffect } from "react";
import { Button, Row, Col } from "antd";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { BookEditRC } from "../components/BookEditRC";
import Swal from "sweetalert2";
import { axiosWithToken } from "../helpers/axios";

export const UserBooksContainer = () => {
  const history = useHistory();
  const [loaded, setLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [initialData, setInitialData] = useState({});
  const { id } = useParams();

  const getCRByBook = async () => {
    try {
      const CR = await axiosWithToken(`cr/book/user/${id}`);
      // console.log("Data de comentarios/rating de axios", CR.data);
      setInitialData(CR.data);
      setLoaded(true);
    } catch (err) {
      // console.log("Error al obtener comentario/rating por su ID", err);
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

  const newCR = async (values) => {
    try {
      await axiosWithToken("cr/create", { ...values, bookId: `${id}` }, "POST");
      Swal.fire({
        icon: "success",
        title: "Comentario/Rating registrado con éxito",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        history.push("/user/books");
      }, 2100);
    } catch (err) {
      // console.log("Error al crear comentario/rating", err);
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

  const updateCRById = async (values) => {
    // console.log("Value del updateCR", values);
    try {
      await axiosWithToken(
        `cr/edit/${initialData.cr._id}`,
        { ...values, _id: initialData.cr._id },
        "PUT"
      );
      // console.log("Respuesta al actualizar CR", response);
      Swal.fire({
        icon: "success",
        title: "El Comentario/Rating fue modificado",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        history.push("/user/books");
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
    if (!user?._id) {
      history.push("/login");
    }
  }, [user, history]);

  useEffect(() => {
    if (user && user.role === "basic") {
      getCRByBook();
    } else {
      history.push("/login");
    }
  }, [id]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("biblioteca-app");
    history.push("/login");
  };

  const initialValuesAntd = (data) => {
    if (data?.cr === null) {
      return {
        bookImageUrl: data.libro.bookImageUrl,
        title: data.libro.title,
        author: data.libro.author,
        rating: 0,
        comment: "",
      };
    } else {
      // console.log("desde data.libro", data);
      return {
        bookImageUrl: data?.libro?.bookImageUrl,
        title: data?.libro?.title,
        author: data?.libro?.author,
        rating: data?.cr?.rating,
        comment: data?.cr?.comment,
      };
    }
  };
  // console.log("Probando la función", initialValuesAntd(initialData));
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
            onClick={() => history.push("/user/books")}
          >
            Lista de libros
          </Button>
        </Col>
      </Row>

      {loaded ? (
        <BookEditRC
          processSubmit={initialData?.cr === null ? newCR : updateCRById}
          initialValues={initialValuesAntd(initialData)}
          titleButton={initialData?.cr === null ? "Crear" : "Actualizar"}
        />
      ) : (
        <h1>Cargando...</h1>
      )}
    </>
  );
};

import React, { useState, useContext, useEffect } from "react";
import { Button, Row, Col, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { BookEditRC } from "../components/BookEditRC";
import Swal from "sweetalert2";
import { axiosWithToken } from "../helpers/axios";

export const UserBooksContainer = () => {
  const [loaded, setLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [initialData, setInitialData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const getCRByBook = async () => {
    try {
      const CR = await axiosWithToken(`cr/book/user/${id}`);
      // console.log("Data de comentarios/rating de axios", CR.data);
      setInitialData(CR.data);
      setLoaded(true);
    } catch (err) {
      // console.log("Error al obtener comentario/rating por su ID", err);
      if (err) {
        Swal.fire({
          icon: "error",
          title: `${err.response.data.msg}`,
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
        navigate("/user/books");
      }, 2100);
    } catch (err) {
      // console.log("Error al crear comentario/rating", err);
      if (err) {
        Swal.fire({
          icon: "error",
          title: `${err.response.data.msg}`,
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
        navigate("/user/books");
      }, 2100);
    } catch (err) {
      // console.log("Error al modificar el libro", err);
      if (err) {
        Swal.fire({
          icon: "error",
          title: `${err.response.data.msg}`,
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
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "basic") {
      const timer = setTimeout(() => {
        getCRByBook();
      }, 350);
      return () => clearTimeout(timer);
    } else {
      navigate("/login");
    }
  }, [id]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem("biblioteca-app");
    navigate("/login");
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
            onClick={() => navigate("/user/books")}
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
        <div className="mx-auto pb-2 pt-4 light-background w-50 d-flex flex-column align-items-center">
          <Spin size="large" style={{ marginTop: "100px" }} />
        </div>
      )}
    </>
  );
};

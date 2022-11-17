import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";
import { Table, Image, Badge, Button, Row, Col } from "antd";
import { axiosWithToken } from "../helpers/axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import noBookCover from "../images/book-without-cover.gif";
import { UserContext } from "../contexts/UserContext";
import Swal from "sweetalert2";
import { uid } from "../helpers/uniqueId";
import { uniqueArrayData } from "../helpers/uniqueArrayData";
import styles from "../scss/AdminBooksMain.module.scss";

const KEY = "biblioteca-app";

export const AdminBooksMain = () => {
  const [books, setBooks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const navigate = useNavigate();

  //Obtener todos los libros de la base de datos
  const getAllBooks = async () => {
    try {
      const booksData = await axiosWithToken("books");
      // console.log("Todos los libros", booksData.data);
      const result = booksData.data.map((row) => ({
        ...row,
        key: uid(),
      }));
      setBooks(result);
      setLoaded(true);
    } catch (err) {
      // console.log("error", err);
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

  const deleteSingleBook = async (record) => {
    try {
      await Swal.fire({
        icon: "warning",
        title: `¿Seguro que quiere borrar el libro <strong>${record.title}</strong>?`,
        showDenyButton: true,
        denyButtonText: "Mejor no",
        confirmButtonText: "Sí",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("¡Borrado!", "", "success");
          axiosWithToken(`book/delete/${record._id}`, {}, "DELETE");
          setBooks(books.filter((book) => book._id !== record._id));
        } else if (result.isDenied) {
          Swal.fire("No se borrará", "", "info");
        }
      });
    } catch (err) {
      // console.log("Error al borrar", err);
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

  //Valido si usuario existe y si tiene el rol de admin
  useEffect(() => {
    // console.log("User dentro del useEffect", user);
    if (user && user.role === "admin") {
      getAllBooks();
    } else {
      navigate("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem(KEY);
    navigate("/login");
  };

  //Columnas de la tabla de Antd
  const columns = [
    {
      key: uid(),
      title: "Autor",
      dataIndex: "author",
      filters: uniqueArrayData(books, "author").map((author) => ({
        text: author,
        value: author,
      })),
      onFilter: (value, record) => record.author.indexOf(value) === 0,
    },
    {
      key: uid(),
      title: "Título",
      dataIndex: "title",
      filters: uniqueArrayData(books, "title").map((title) => ({
        text: title,
        value: title,
      })),
      onFilter: (value, record) => record.title.indexOf(value) === 0,
    },
    {
      key: uid(),
      title: "Año",
      dataIndex: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      key: uid(),
      title: "Editorial",
      dataIndex: "publisher",
      filters: uniqueArrayData(books, "publisher").map((publisher) => ({
        text: publisher,
        value: publisher,
      })),
      onFilter: (value, record) => record.publisher.indexOf(value) === 0,
    },
    {
      key: uid(),
      title: "Género",
      dataIndex: "subject",
      filters: uniqueArrayData(books, "subject").map((subject) => ({
        text: subject,
        value: subject,
      })),
      onFilter: (value, record) => record.subject.indexOf(value) === 0,
    },
    {
      key: uid(),
      title: "N.º de págs.",
      dataIndex: "numberOfPages",
      align: "right",
      sorter: (a, b) => a.numberOfPages - b.numberOfPages,
    },
    {
      key: uid(),
      title: "Img",
      dataIndex: "bookImageUrl",
      render: (record) => {
        return <Image height={60} src={!record ? noBookCover : record} />;
      },
    },
    {
      key: uid(),
      title: "Acciones",
      render: (record) => {
        return (
          <>
            <EditOutlined
              style={{ color: "#F18F01", marginLeft: 5, fontSize: 18 }}
              onClick={() => navigate(`/admin/book/edit/${record._id}`)}
            />
            <DeleteOutlined
              style={{ color: "#E63F32", marginLeft: 16, fontSize: 18 }}
              onClick={() => {
                deleteSingleBook(record);
              }}
            />
          </>
        );
      },
    },
  ];

  const tableOnChange = (pagination, filters, sorter) => {
    console.log("Table params", pagination, filters, sorter);
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
            onClick={() => navigate("/admin/book/new")}
          >
            Registrar un libro
          </Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={22}>
          <h2 className="text-center">Libros disponibles</h2>
          {loaded && (
            <>
              <div>
                <p className={styles.registeredBooks}>
                  Total de libros registrados
                </p>
                <Badge count={books.length} showZero />
              </div>
              <Table
                columns={columns}
                dataSource={books}
                onChange={tableOnChange}
                pagination={{
                  showSizeChanger: true,
                  current: page,
                  pageSize: pageSize,
                  onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                  },
                }}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

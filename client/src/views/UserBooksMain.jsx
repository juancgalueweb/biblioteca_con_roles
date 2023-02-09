import { EditOutlined, WechatOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Col,
  Image,
  Modal,
  Rate,
  Row,
  Spin,
  Table,
  Timeline
} from 'antd'
import 'antd/dist/antd.min.css'
import moment from 'moment'
import 'moment/locale/es-mx'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { UserContext } from '../contexts/UserContext'
import { axiosWithToken } from '../helpers/axios'
import { uniqueArrayData } from '../helpers/uniqueArrayData'
import { uid } from '../helpers/uniqueId'
import noBookCover from '../images/book-without-cover.gif'
import styles from '../scss/UserBooksMain.module.scss'

const KEY = 'biblioteca-app'

export const UserBooksMain = () => {
  const [books, setBooks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const { user, setUser } = useContext(UserContext)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [allComments, setAllComments] = useState({})
  const navigate = useNavigate()

  //Obtener todos los libros de la base de datos
  const getAllBooks = async () => {
    try {
      const booksData = await axiosWithToken('books/user/crs')
      // console.log("Todos los libros", booksData.data);
      const result = booksData.data.map(row => ({
        ...row,
        key: uid()
      }))
      setBooks(result)
      setLoaded(true)
    } catch (err) {
      // console.log("error", err);
      if (err) {
        Swal.fire({
          icon: 'error',
          title: `${err.response.data.msg}`,
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          handleLogOut()
        }, 2100)
      }
    }
  }
  //Valido si usuario existe y si tiene el rol de admin
  useEffect(() => {
    if (user && user.role === 'basic') {
      getAllBooks()
    } else {
      navigate('/login')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogOut = () => {
    setUser(null)
    localStorage.removeItem(KEY)
    navigate('/login')
  }

  //Columnas de la tabla de Antd
  const columns = [
    {
      key: uid(),
      title: 'Autor',
      dataIndex: 'author',
      filters: uniqueArrayData(books, 'author').map(author => ({
        text: author,
        value: author
      })),
      onFilter: (value, record) => record.author.indexOf(value) === 0
    },
    {
      key: uid(),
      title: 'Título',
      dataIndex: 'title',
      filters: uniqueArrayData(books, 'title').map(title => ({
        text: title,
        value: title
      })),
      onFilter: (value, record) => record.title.indexOf(value) === 0
    },
    {
      key: uid(),
      title: 'Año',
      dataIndex: 'year',
      sorter: (a, b) => a.year - b.year
    },
    {
      key: uid(),
      title: 'Editorial',
      dataIndex: 'publisher',
      filters: uniqueArrayData(books, 'publisher').map(publisher => ({
        text: publisher,
        value: publisher
      })),
      onFilter: (value, record) => record.publisher.indexOf(value) === 0
    },
    {
      key: uid(),
      title: 'Género',
      dataIndex: 'subject',
      filters: uniqueArrayData(books, 'subject').map(subject => ({
        text: subject,
        value: subject
      })),
      onFilter: (value, record) => record.subject.indexOf(value) === 0
    },
    {
      key: uid(),
      title: 'N.º de págs.',
      align: 'right',
      dataIndex: 'numberOfPages',
      sorter: (a, b) => a.numberOfPages - b.numberOfPages
    },
    {
      key: uid(),
      title: 'Img',
      dataIndex: 'bookImageUrl',
      render: record => {
        return <Image width={40} src={!record ? noBookCover : record} />
      }
    },
    {
      key: uid(),
      title: 'Rating',
      width: '15%',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.avgRating - b.avgRating,
      render: record => {
        return (
          <>
            <Rate
              allowHalf
              disabled
              defaultValue={record.avgRating === null ? 0 : record.avgRating}
            />
            {record.comments.length === 1 ? (
              <p className='text-center text-danger'>
                {record.comments.length} reseña
              </p>
            ) : record.comments.length > 1 ? (
              <p className='text-center text-danger'>
                {record.comments.length} reseñas
              </p>
            ) : (
              <p className='text-center text-secondary'>Sin reseñas</p>
            )}
          </>
        )
      }
    },
    {
      key: uid(),
      title: 'Acciones',
      render: record => {
        return (
          <>
            <EditOutlined
              style={{ color: '#F18F01', marginLeft: 5, fontSize: 18 }}
              onClick={() => {
                navigate(`/user/book/${record._id}`)
              }}
            />
            <WechatOutlined
              style={{ color: '#3590ff', marginLeft: 8, fontSize: 22 }}
              onClick={() => showModal(record)}
            />
          </>
        )
      }
    }
  ]

  const tableOnChange = (pagination, filters, sorter) => {
    console.log('Table params', pagination, filters, sorter)
  }

  const getAllCRByBook = async record => {
    try {
      const data = await axiosWithToken(`cr/book/${record._id}`)
      setAllComments(data.data)
    } catch (err) {
      if (err) {
        Swal.fire({
          icon: 'error',
          title: `${err.response.data.msg}`,
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          handleLogOut()
        }, 2100)
      }
    }
  }

  //Modal logic de mostrar comentarios
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = record => {
    setIsModalOpen(true)
    getAllCRByBook(record)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Row justify='center' className='my-4'>
        <Col
          span={22}
          className='d-flex justify-content-between align-items-center mx-auto'
        >
          <Button type='primary' danger onClick={handleLogOut}>
            Cerrar sesión
          </Button>
          <p className='d-inline'>Hola, {user?.firstName}</p>
        </Col>
      </Row>
      <Row justify='center'>
        <Col span={22} style={!loaded ? { textAlign: 'center' } : ''}>
          <h2 className='text-center'>Lista de Libros</h2>
          {loaded ? (
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
                    setPage(page)
                    setPageSize(pageSize)
                  }
                }}
              />
            </>
          ) : (
            <Spin size='large' style={{ marginTop: '250px' }} />
          )}
        </Col>
      </Row>
      <Modal
        title='Comentarios de los usuarios'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {allComments.length === 0 ? (
          <p key={uid()}>
            Aún no hay comentarios, sea el primer usuario en comentar 👏🏼
          </p>
        ) : (
          <Timeline>
            {allComments?.comments?.map(comment => (
              <Timeline.Item key={uid()}>
                <span>
                  <b> Comentario de {comment?.user?.firstName}:</b>
                </span>
                <br />
                <Rate allowHalf disabled defaultValue={comment?.rating} />
                <br />
                <span>
                  "<em>{comment?.comment}</em>"
                </span>
                <br />
                {comment?.createdAt === comment?.updatedAt ? (
                  <span>Creado {moment(comment?.createdAt).calendar()}</span>
                ) : (
                  <span>Editado {moment(comment?.updatedAt).calendar()}</span>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Modal>
    </>
  )
}

import React, { useEffect, useState } from "react";
import {
  Card,
  Modal,
  Form,
  Input,
  Button,
  Row,
  Col,
  message
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HeartOutlined,
  HeartFilled,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import "./App.css";

const { Meta } = Card;

export default function App() {
  const [users, setUsers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => message.error("Failed to load users"));
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website
    });
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form.validateFields().then((values) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u))
      );
      setIsModalVisible(false);
      setEditingUser(null);
      message.success("User details updated");
    });
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    message.info("User deleted");
  };

  return (
    <div className="app-container">
      <Row gutter={[24, 24]} justify="center">
        {users.map((user) => {
          const avatarUrl = `https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`;
          const isFav = favorites.includes(user.id);

          return (
            <Col xs={24} sm={12} md={12} lg={6} key={user.id}>
              <Card
                style={{
                  width: "95%", // wider card
                  margin: "auto",
                  borderRadius: "12px"
                }}
                cover={
                  <div className="avatar-container">
                    <img
                      src={avatarUrl}
                      alt={user.username}
                      className="avatar-img"
                    />
                  </div>
                }
                actions={[
                  isFav ? (
                    <HeartFilled
                      style={{ color: "red" }}
                      onClick={() => toggleFavorite(user.id)}
                    />
                  ) : (
                    <HeartOutlined
                      style={{ color: "red" }}
                      onClick={() => toggleFavorite(user.id)}
                    />
                  ),
                  <EditOutlined onClick={() => handleEdit(user)} />,
                  <DeleteOutlined onClick={() => handleDelete(user.id)} />
                ]}
              >
                <Meta
                  title={user.name}
                  description={
                    <div>
                      <p>
                        <MailOutlined /> {user.email}
                      </p>
                      <p>
                        <PhoneOutlined /> {user.phone}
                      </p>
                      <p>
                        <GlobalOutlined /> {user.website}
                      </p>
                    </div>
                  }
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      <Modal
        title="Edit User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={handleUpdate}>
            OK
          </Button>
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter valid email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Enter phone" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[{ required: true, message: "Enter website" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

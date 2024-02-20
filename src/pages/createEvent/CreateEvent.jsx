import React, { useState } from 'react';
import { Layout, Menu, Button, Form, Input, DatePicker, TimePicker, InputNumber, message } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content } = Layout;

const CreateEvent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem('user');

  // Function to handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Get JWT token from local storage
      const jwtToken = localStorage.getItem('jwtToken');
  
      // Make the API request including the JWT token
      const response = await fetch('https://eventmanagementapi.azurewebsites.net/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}` // Include JWT token in the Authorization header
        },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (response.ok) {
        message.success('Event created successfully!');
        form.resetFields();
      } else {
        throw new Error(data.message || 'Failed to create event');
      }
    } catch (error) {
      message.error(error.message || 'Failed to create event');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Menu.Item>
            <Link to="/">
              <Button type="primary">Home</Button>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <h1>Create Event</h1>
          <Form
            form={form}
            name="create_event"
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter the title of the event' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select the date of the event' }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: 'Please select the time of the event' }]}
            >
              <TimePicker />
            </Form.Item>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: 'Please enter the location of the event' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter the description of the event' }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Organizer"
              name="organizer"
              initialValue={user}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Event ID"
              name="eventId"
              initialValue={Math.floor(Math.random() * (10000 - 10 + 1)) + 10}
              hidden
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Event
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default CreateEvent;

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Signup = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('https://eventmanagementapi.azurewebsites.net/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        // Display success message if response status is 200
        message.success('Signup successful. You can login now!');
      } else {
        // Display error message if response status is not 200
        message.error('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      // Display a generic error message if an unexpected error occurs
      message.error('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', marginTop: 100 }}>
      <h1>Signup</h1>
      <Form
        name="normal_signup"
        className="signup-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your Email!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            Sign up
          </Button>
          Or <a href="/login">login now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;

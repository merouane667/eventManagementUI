import React from 'react';
import { Form, Input, Button, Checkbox, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const onFinish = async (values) => {
    try {
      const response = await fetch('https://eventmanagementapi.azurewebsites.net/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      const data = await response.json(); // Parse response data

      console.log('Login response:', data); // Log the response data

      if (response.ok) {
        // Store JWT token in local storage
        localStorage.setItem('jwtToken', data.loginData?.idToken);
        localStorage.setItem('user', data.loginData?.localId);

        // Redirect to home page if login is successful
        window.location.href = '/';
      } else {
        // Display error message if login fails
        console.error('Login failed:', response.statusText);
        // You can display an error message using Ant Design's message component or any other method
        message.error('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Display a generic error message if an unexpected error occurs
      message.error('An error occurred during login. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: 'auto', marginTop: 100 }}>
      <h1>Login</h1>
      <Form
        name="normal_login"
        className="login-form"
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
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="#">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="/signup">register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

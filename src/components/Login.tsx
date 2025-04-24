import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import authConfig from '../config/auth.json';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface LoginForm {
  username: string;
  password: string;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: LoginForm) => {
    setLoading(true);
    // 模拟登录延迟
    setTimeout(() => {
      if (
        values.username === authConfig.admin.username &&
        values.password === authConfig.admin.password
      ) {
        message.success('登录成功！');
        localStorage.setItem('isLoggedIn', 'true');
        onLoginSuccess();
      } else {
        message.error('用户名或密码错误！');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '100px auto', 
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>管理员登录</h2>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login; 
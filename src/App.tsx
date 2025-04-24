import { Layout } from 'antd';
import { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import Login from './components/Login';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0 }}>HTTP POST发送工具</h1>
        <a 
          onClick={handleLogout}
          style={{ 
            cursor: 'pointer',
            color: '#1890ff'
          }}
        >
          退出登录
        </a>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        <PostForm />
      </Content>
    </Layout>
  );
};

export default App; 
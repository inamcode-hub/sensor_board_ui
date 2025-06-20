import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  background-color: #58a645;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.nav<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? '60px' : '200px')};
  background: #0f172a;
  color: white;
  transition: width 0.3s;
  padding: 1rem 0.5rem;
`;

const SidebarLink = styled(Link)<{ collapsed: boolean }>`
  display: block;
  color: #cbd5e1;
  text-decoration: none;
  padding: 0.5rem;
  font-size: ${({ collapsed }) => (collapsed ? '0.8rem' : '1rem')};
  text-align: ${({ collapsed }) => (collapsed ? 'center' : 'left')};

  &:hover {
    color: white;
    background: #1e293b;
    border-radius: 4px;
  }
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
  padding: 1.5rem;
`;

const Footer = styled.footer`
  background-color: #213966;
  color: white;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper>
      <Header>
        <div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white', marginRight: '1rem' }}
          />
          SENSOR STABILITY TEST SYSTEM
        </div>
        <div>{time}</div>
      </Header>

      <Main>
        <Sidebar collapsed={collapsed}>
          <SidebarLink to="/" collapsed={collapsed}>
            🏠 {collapsed ? '' : 'Home'}
          </SidebarLink>
          <SidebarLink to="/analytics" collapsed={collapsed}>
            📈 {collapsed ? '' : 'Analytics'}
          </SidebarLink>
        </Sidebar>

        <Content>{children}</Content>
      </Main>

      <Footer>© {new Date().getFullYear()} Dryer Master</Footer>
    </Wrapper>
  );
};

export default Layout;

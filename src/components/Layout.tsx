import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
`;

const Sidebar = styled.nav`
  width: 220px;
  background: #1e293b;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const SidebarLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  margin-bottom: 1rem;
  font-weight: 500;

  &:hover {
    color: white;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: #58a645;
  color: white;
  padding: 1rem 2rem;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
`;

const DateTime = styled.div`
  background-color: #58a645;
  text-align: right;
  font-size: 1.2rem;
  padding: 0.5rem 1rem 0 0;
  color: white;
  font-weight: 500;
`;

const Content = styled.main`
  flex: 1;
  background: #f8fafc;
  padding: 2rem;
  overflow-y: auto;
`;

const Footer = styled.footer`
  color: white;
  background-color: #213966;
  border-top: 1px solid #dee2e6;
  text-align: center;
  /* padding: 2rem 1rem 1rem; */
`;

const DryerMasterLogo = styled.div`
  display: inline-block;
  /* margin-bottom: 1rem; */

  .bar {
    width: 80px;
    height: 10px;
    background-color: #66bb45;
    margin: 4px 0;
  }

  .text {
    font-size: 2rem;
    font-weight: 800;
    color: white;
    line-height: 1.1;
    text-align: left;
    margin-left: 12px;
  }

  .logo-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-col {
    display: flex;
    flex-direction: column;
  }
`;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Wrapper>
      <Sidebar>
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
          📊 Dashboard
        </h2>
        <SidebarLink to="/">🏠 Home</SidebarLink>
        <SidebarLink to="/dashboard">📦 Sensors</SidebarLink>
      </Sidebar>
      <ContentWrapper>
        <DateTime>{new Date().toLocaleString('en-US')}</DateTime>
        <Header>SENSOR STABILITY TEST SYSTEM</Header>
        <Content>{children}</Content>
        <Footer>
          <DryerMasterLogo>
            <div className="logo-row">
              <div className="logo-col">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
              <div className="text">
                <div>DRYER</div>
                <div>MASTER</div>
              </div>
            </div>
          </DryerMasterLogo>
          <p>Dryer Master&#8201;&reg;</p>
          <p>
            &copy;{`Copyright ${1900 + new Date().getYear()} Dryer Master Inc.`}
          </p>
        </Footer>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Layout;

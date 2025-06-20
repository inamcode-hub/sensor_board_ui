import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
    background-color: #f8fafc;
    color: #1e293b;
    line-height: 1.5;
    overflow: hidden;
  }

  #root {
    height: 100%;
  }

  // Ant Design overrides
  .ant-btn {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  .ant-select-selector {
    font-size: 1rem !important;
    padding: 0.5rem !important;
  }

  .ant-picker {
    font-size: 1rem;
    padding: 0.4rem;
  }

  .ant-layout {
    background: #f8fafc;
  }

  .ant-menu-item {
    font-size: 1rem;
  }

  .ant-tooltip-inner {
    font-size: 0.9rem;
  }

  .ant-notification-notice-message {
    font-size: 1rem;
  }
`;

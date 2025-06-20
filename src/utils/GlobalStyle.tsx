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

  .datatable-container {
  padding: 1rem;
}

.updated-tag {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: right;
}

.sensor-card .sensor-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 1.25rem;
  color: #d4d4d4;
  margin-bottom: 4px;
}

.value {
  font-size: 2.4rem;
  font-weight: bold;
}

.moisture {
  color: #b6ff41;
}

.temp {
  color: #ff4081;
}

`;

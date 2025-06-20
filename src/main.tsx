import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GlobalStyle } from './utils/GlobalStyle';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from './features/redux-store/index.js';
import 'antd/dist/reset.css'; // Ant Design v5+

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <GlobalStyle />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

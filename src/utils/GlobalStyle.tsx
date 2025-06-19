import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }

  #root {
    height: 100%;
  
  }
`;

import { createGlobalStyle } from 'styled-components';

export const GlobalOverflowXStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    margin-bottom: 40px;
    padding-bottom: 40px;
  }
  ::-webkit-scrollbar-track {
    background: #1414140A;
    border-radius: 512px;
    margin: 16px 50px;
    margin-right:0px;
    padding-bottom: 30px;
    margin-bottom: 50px;

  }
  ::-webkit-scrollbar-thumb {
    background-color: #1414143D;
    border-radius: 512px;
    height:8px ;
    margin: 4px 8px;
  }

`;

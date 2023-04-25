import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import App from "./App";
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap');
  
  html{font-size:3px !important;}
  @media screen and (min-width:216px){html{font-size:4px !important;}}
  @media screen and (min-width:250px){html{font-size:4.5px !important;}}
  @media screen and (min-width:300px){html{font-size:5.5px !important;}}
  @media screen and (min-width:360px){html{font-size:6px !important;}}
  @media screen and (min-width:400px){html{font-size:7px !important;}}
  @media screen and (min-width:445px){html{font-size:8px !important;}}
  @media screen and (min-width:576px){html{font-size:9px !important;}}
  @media screen and (min-width:800px){html{font-size:10px !important;}}
  
  body {font-size:1rem !important;}
  * {
    box-sizing: border-box;
  }
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }  
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }  
  body {
    font-weight: 300;
    font-family: 'Source Sans Pro', sans-serif;
    color: white;
    line-height: 1.2;
    background-color: #000;
    width: 100vw;
    overflow-x: hidden;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button {
    cursor: pointer;
    border-style: solid;
  }
  /* input */
  input,textarea{color: white; font-size:1rem; border:0.05rem solid #000; transition:border .15s; box-sizing:border-box; vertical-align:middle; outline:none;}
  input {
    border: 1px solid ${(props) => props.theme.white.lighter};
    border-radius: 0.5rem;
    background-color: transparent;
    outline: none;
    z-index: -1;
    &::placeholder {
      color: white;
    }
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-transition: background-color 9999s ease-out;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    -webkit-text-fill-color: #000 !important;
  }
  html::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  html::-webkit-scrollbar-thumb {
    background-color: #4e4e4e;
    border-radius: 100px;
  }
  html::-webkit-scrollbar-track {
    background-color: #4e4e4e;
    border-radius: 100px;
    background-clip: padding-box;
    border: 3px solid transparent;
  }
`;

const client = new QueryClient();

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <RecoilRoot>
    <HelmetProvider>
      <QueryClientProvider client={client}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </RecoilRoot>
);

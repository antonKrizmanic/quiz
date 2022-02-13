import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from "./app/layout/App";
import { BrowserRouter, Router, useLocation } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { createMemoryHistory } from "history";
import "bootstrap-icons/font/bootstrap-icons.css";


export const quizHistory = createMemoryHistory();


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

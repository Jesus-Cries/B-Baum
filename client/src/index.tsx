import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import GlobalStyle from "./GlobalStyle";

import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#c62828",
        },
        secondary: {
            main: "#ff9800",
        },
        background: {
            default: "#00ff00",
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

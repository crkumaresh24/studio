import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import CreateComponent from "./routes/components/CreateComponent";
import DataSourcesHome from "./routes/datasources/DatasourcesHome";
import ActionsHome from "./routes/actions/ActionsHome";
import Explorer from "./libs/Explorer";
import { title } from "process";
import ComponentsExplorer from "./routes/components/ComponentsExplorer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/components",
        element: <ComponentsExplorer />,
      },
      {
        path: "/datasources",
        element: <DataSourcesHome />,
      },
      {
        path: "/actions",
        element: <ActionsHome />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

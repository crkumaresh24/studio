import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import ActionsExplorer from "./routes/actions/ActionsExplorer";
import ComponentsExplorer from "./routes/components/ComponentsExplorer";
import DatasourceExplorerHome from "./routes/datasources/DatasourceExplorerHome";
import SettingsPage from "./routes/settings/SettingsPage";
import DesignerHome from "./routes/actions/designer/DesignerHome";

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
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/",
        element: <DatasourceExplorerHome />,
      },
      {
        path: "/actions",
        element: <ActionsExplorer />,
      },
      {
        path: "/designer",
        element: <DesignerHome />,
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

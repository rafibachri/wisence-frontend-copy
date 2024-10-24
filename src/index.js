import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store";
import { Provider } from "react-redux";

import Spinner from "./components/Spinner";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

import "./styles.css";
import "./responsive.css";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = lazy(() => import("./App"));
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </Provider>
  </BrowserRouter>
);

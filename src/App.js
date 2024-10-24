import React, { Suspense, useEffect } from "react";

import Router from "./router/Router";
import { store } from "./redux/store";

import setAxios from "./utility/setAxios";
import setToken from "./utility/setToken";

import { loadUser, logout } from "./actions/auth";

setAxios();
if (localStorage.token) {
  setToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    if (localStorage.token === undefined || localStorage.token === null) {
      store.dispatch(logout({ email: "" }));
    } else store.dispatch(loadUser());
  }, []);

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;

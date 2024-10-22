import React, { useEffect } from "react";
import "./App.css";
import { AuthProvider } from "oidc-react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import configureStore from "./store/setup/configureStore";
import Routers from "./routers";
import { oidcConfig } from "./constants/oidc";
import "@appkit4/styles/appkit.min.css";
import "@appkit4/react-components/dist/styles/appkit4-react.min.css";
import "@appkit4/react-text-editor/dist/appkit4-react-texteditor.min.css";

const store = configureStore();
const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer position="bottom-right" autoClose={2000} />
        <AuthProvider {...oidcConfig} autoSignIn={false}>
          <Routers />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

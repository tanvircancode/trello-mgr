import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";



import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import storage from "redux-persist/lib/storage";
import { BrowserRouter } from "react-router-dom";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

// redux code
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import trelloReducer from "./store/index.jsx";

const persistConfig = {
    key: "root",
    storage: storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, trelloReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});
export const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    closeOnClick
                />
                <App />
            </BrowserRouter>
        </PersistGate>
    </Provider>
    // </React.StrictMode>,
);

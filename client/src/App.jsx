import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Pages/AuthPage/Auth";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import { BASE_URL } from "./config";
import {
    setFetchSingleCard,
    setLogin,
    setProjects,
    setSelectedProject,
    setTasks,
    setStages
} from "./store";

function App() {
    const authChecked = Boolean(useSelector((state) => state.token));

    return (
        <>
            {authChecked && <Layout />}

            <InitUser />
            <Routes>
                <Route path="/login" element={<Auth />} />

                <Route
                    path="/"
                    element={authChecked ? <Home /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    );
}

function InitUser() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const userId = localStorage.getItem("user_id");

    const init = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.user) {
                dispatch(
                    setLogin({
                        user: response.data.user,
                        token: token,
                    })
                );
            } else {
                dispatch(
                    setLogin({
                        user: null,
                        token: null,
                    })
                );
                dispatch(setProjects(null));
                dispatch(setTasks(null));
                dispatch(setStages(null));
                dispatch(setSelectedProject(null));
                dispatch(setFetchSingleCard(null));
                dispatch(setMakeBlur({ makeBlur: false }));
                dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
            }
        } catch (e) {
            dispatch(
                setLogin({
                    user: null,
                    token: null,
                })
            );
            dispatch(setProjects(null));
            dispatch(setTasks(null));
            dispatch(setStages(null));
            dispatch(setSelectedProject(null));
            dispatch(setFetchSingleCard(null));
            dispatch(setMakeBlur({ makeBlur: false }));
            dispatch(setMakeCardModalBlur({ makeCardModalBlur: false }));
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>;
}

export default App;

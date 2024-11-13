import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL, REGISTER_TOKEN } from "../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./auth.scss";
import { setLogin } from "../../store";

const AuthForm = ({ mode, setMode }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordHint, setPasswordHint] = useState("");

    const handleSubmit = async (e, mode) => {
        setLoading(true);
        e.preventDefault();

        if (mode === "login") {
            if (email.length === 0) {
                toast.error("Email is Required");
            } else if (password.length === 0 || password.length > 255) {
                toast.error("Invalid Input For Password");
            } else {
                // console.log("before axios");
                await axios
                    .post(
                        `${BASE_URL}/api/login`,
                        {
                            email,
                            password,
                        },
                        {
                            headers: {
                                "Content-type": "application/json",
                            },
                        }
                    )
                    .then((res) => {
                        console.log(res);
                        if (res.data.status && res.data.data.token) {
                            toast.success("Logged in Successfully");
                            dispatch(
                                setLogin({
                                    user: res.data.data.user,
                                    token: res.data.data.token,
                                })
                            );
                            localStorage.setItem("token", res.data.data.token);
                            localStorage.setItem(
                                "user_id",
                                res.data.data.user.id
                            );

                            navigate("/");
                        } else {
                            toast.error("Server is not responding");
                        }
                    })
                    .catch((error) => {
                        if (
                            error?.response &&
                            error.response?.status &&
                            error.response?.data
                        ) {
                            toast.error(error.response.data.message);
                        } else {
                            toast.error("Server is not responding");
                        }
                    });
            }
        } else {
            if (name.length === 0) {
                toast.error("Name is Required");
            } else if (email.length === 0) {
                toast.error("Email is Required");
            } else if (password.length === 0 || password.length < 5) {
                toast.error("Password should be at least 5 characters");
            } else {
                var formData = new FormData();
                formData.append("name", name);
                formData.append("email", email);
                formData.append("password", password);
                formData.append("password_hint", passwordHint);
                formData.append("token", REGISTER_TOKEN);
                // console.log(formData);

                await axios
                    .post(`${BASE_URL}/api/register`, formData)
                    .then((res) => {
                        if (res.data.status) {
                            // setMode("signup");

                            toast.success("Registration Successful");
                            navigate("/login");
                        } else {
                            toast.error(res.data.message);
                        }
                        setEmail("");
                        setName("");
                        setPassword("");
                        setPasswordHint("");
                        setMode("login");
                    })
                    .catch((error) => {
                        if (
                            error?.response &&
                            error.response?.status &&
                            error.response?.data
                        ) {
                            toast.error(error.response.data.message);
                        } else {
                            toast.error("Server is not responding");
                        }
                    });
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        setEmail("");
        setName("");
        setPassword("");
        setPasswordHint("");
    }, [mode]);

    return (
        <form onSubmit={(e) => handleSubmit(e, mode)}>
            <div className="form-block__input-wrapper">
                {mode === "login" ? (
                    <div className="form-group form-group--login">
                        <input
                            type="email"
                            className="form-group__input"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="form-group__input"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="form-group form-group--signup">
                        <input
                            type="text"
                            className="form-group__input"
                            id="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            className="form-group__input"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            className="form-group__input"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="text"
                            className="form-group__input"
                            id="password-hint"
                            placeholder="Password Hint"
                            value={passwordHint}
                            onChange={(e) => setPasswordHint(e.target.value)}
                            required
                        />
                    </div>
                )}
            </div>
            <button
                type="submit"
                className={`button button--primary full-width ${
                    mode === "login" ? "mt-2" : "mt-4"
                } ${loading ? "disabled" : ""}`}
                disabled={loading}
                style={{
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "wait" : "pointer",
                }}
            >
                {loading
                    ? "Loading..."
                    : mode === "login"
                    ? "Log In"
                    : "Sign Up"}
            </button>
        </form>
    );
};

export default AuthForm;

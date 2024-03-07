import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
import { BASE_URL, REGISTER_TOKEN } from "../../config";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./auth.scss";

const AuthForm = ({ mode }) => {
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
                style={{ opacity: loading ? 0.5 : 1 }}
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

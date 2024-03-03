import { useState } from "react";
import "./login.scss";
import AuthForm from "./AuthForm";

const Auth = () => {
    const [mode, setMode] = useState("login");

    const toggleMode = () => {
        const newMode = mode === "login" ? "signup" : "login";
        setMode(newMode);
    };

    return (
        <div className={`app app--is-${mode}`}>
            <div
                className={`form-block-wrapper form-block-wrapper--is-${mode}`}
            ></div>
            <section className={`form-block form-block--is-${mode}`}>
                <header className="form-block__header">
                    <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
                    <div className="form-block__toggle-block">
                        <span>
                            {mode === "login" ? "Don't" : "Already"} have an
                            account?{" "}
                            <span className="auth-link" onClick={toggleMode}>
                                {mode === "login" ? "Register" : "Login"} here
                            </span>
                        </span>

                    </div>
                </header>
                <AuthForm mode={mode} />
            </section>
        </div>
    );
};

export default Auth;

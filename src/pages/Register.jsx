import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.scss";
import { Link, useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8051";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const userData = await res.json();
            localStorage.setItem("userID", userData.id.toString());
            localStorage.setItem("user_email", email);
            navigate("/chat", { replace: true });
            return;
        }

        const msg = await res.text();
        setError(msg || "Registration failed");
    };

    return (
        <div className="register min-vh-100 d-flex justify-content-center align-items-center px-1">
            <div style={{ width: 320 }}>
                <h1 className="register__name h3 mb-4">Registration</h1>

                <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
                    <div className="mb-3">
                        <label className="register__label form-label">Email</label>
                        <input
                            type="email"
                            className="form-control register__input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label register__label">Password</label>
                        <input
                            type="password"
                            className="form-control register__input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn btn-primary register__btn">
                        Sign up
                    </button>

                    <p className="mt-3 mb-0 text-center register__text">
                        Already have an account?{" "}
                        <Link to="/login" className="register__link text-decoration-none">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

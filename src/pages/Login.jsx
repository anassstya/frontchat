import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Invalid email or password");
            }

            const userData = await res.json();

            localStorage.setItem("userID", userData.id.toString());
            localStorage.setItem("user_email", email);
            navigate("/chat", { replace: true });

        } catch (err) {
            setError(err.message ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register min-vh-100 d-flex justify-content-center align-items-center">
            <div style={{ width: 420 }}>
                <h1 className="register__name h3 mb-4">Sign in</h1>

                <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>

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

                    <button type="submit" className="btn btn-primary register__btn" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <p className="mt-3 mb-0 text-center register__text">
                        Don’t have an account?{" "}
                        <Link to="/register" className="register__link text-decoration-none">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

import React, {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.scss";
import {useNavigate} from "react-router-dom";

export default function Header({isGenerating}) {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setEmail(localStorage.getItem("user_email") || "");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user_email");
        navigate("/login", { replace: true });
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-body sticky-top" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand fw-semibold" href="#">
                    Chat
                </a>

                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary-emphasis">

                        {isGenerating ? (
                            <div className="d-flex align-items-center">
                                <span className="spinner-grow spinner-grow-sm me-3" role="status" aria-label="Loading"></span>
                                <span>Generating...</span>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center m-1">
                                <span>Ask a question</span>
                            </div>
                        )}

                    </span>

                    <div className="dropdown">
                        <button
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"

                        >
                            Settings
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end my-3">
                            <li>
                                <h6 className="dropdown-header">Email</h6>
                            </li>
                            <li>
                                <span className="dropdown-item-text">{email || "-"}</span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item" type="button" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}
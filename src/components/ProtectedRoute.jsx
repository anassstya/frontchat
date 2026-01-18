import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const isAuthed = Boolean(localStorage.getItem("user_email"));
    return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}

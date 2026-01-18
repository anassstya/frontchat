import { Navigate, Outlet } from "react-router-dom";

export default function PublicOnlyRoute() {
    const isAuthed = Boolean(localStorage.getItem("user_email"));
    return isAuthed ? <Navigate to="/chat" replace /> : <Outlet />;
}

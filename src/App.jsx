import './App.scss'
import ChatWindow from "./pages/ChatWindow.jsx";
import Register from "./pages/Register.jsx";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />

            <Route element={<PublicOnlyRoute />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={<ChatWindow />} />
            </Route>
        </Routes>
      )
}

export default App

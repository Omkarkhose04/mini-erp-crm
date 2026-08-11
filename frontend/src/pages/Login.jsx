import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log("Login response:", response.data);

            const data = response.data;

            if (!data.success) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            navigate("/");
        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form
                className="login-card"
                onSubmit={handleLogin}
            >
                <h1>Mini ERP + CRM</h1>

                <p className="login-subtitle">
                    Operations Portal
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <label>Email</label>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
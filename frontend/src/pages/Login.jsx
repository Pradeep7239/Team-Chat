import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/AuthForm";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { username, password });

      // save token + user
      localStorage.setItem("teamchat_token", res.data.token);
      localStorage.setItem("teamchat_user", JSON.stringify(res.data.user));

      // redirect to chat dashboard
      navigate("/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = (
    <>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        className="w-full p-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <p className="text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600">
          Signup
        </Link>
      </p>
    </>
  );

  return (
    <AuthForm
      title="Login to Team Chat"
      buttonText={loading ? "Logging in..." : "Login"}
      onSubmit={submit}
      fields={fields}
    />
  );
}

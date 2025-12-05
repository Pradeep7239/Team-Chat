import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthForm from "../components/AuthForm";
import API from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/signup", {
        username,
        password,
        displayName,
      });

      // Save token and user in localStorage
      localStorage.setItem("teamchat_token", res.data.token);
      localStorage.setItem("teamchat_user", JSON.stringify(res.data.user));

      // Redirect to chat page
      navigate("/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
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
        type="text"
        placeholder="Display Name (optional)"
        className="w-full p-2 border rounded"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        autoComplete="nickname"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600">
          Login
        </Link>
      </p>
    </>
  );

  return (
    <AuthForm
      title="Create Your Team Chat Account"
      buttonText={loading ? "Creating..." : "Signup"}
      onSubmit={submit}
      fields={fields}
    />
  );
}

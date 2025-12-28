import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@bookstore.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail = userCred.user.email;

      // 🔐 ROLE DECISION HERE
      if (userEmail === ADMIN_EMAIL) {
        navigate("/books"); // admin dashboard
      } else {
        navigate("/books"); // customer browsing
      }
    } catch (err) {
  console.log("🔥 FIREBASE ERROR CODE:", err.code);
  console.log("🔥 FIREBASE ERROR MESSAGE:", err.message);
  setError(err.message);
}

  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-3 text-center">Login</h2>

      <form onSubmit={handleLogin}>
        <input
          className="form-control mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

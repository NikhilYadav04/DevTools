import { useState } from "react";
import SpinnerMini from "../../ui/SpinnerMini";
import useLogin from "./useLogin";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, login } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail(""), setPassword("");
        },
      }
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subHeading}>Sign in to your account</p>

        {/* Email Input */}
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email address</label>
          <input
            type="email"
            id="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={styles.input}
          />
        </div>

        {/* Password Input */}
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={styles.input}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? <SpinnerMini /> : "Login"}
        </button>

        <div style={{color:"white"}}>
              <span>
                Don't have an account?{" "}
                <a href="/sign-up">
                  Sign up
                </a>
              </span>
            </div>
      </form>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#000", // Black background
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    backgroundColor: "#1E1E1E", // Dark gray form background
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(255, 255, 255, 0.1)", // Subtle shadow
    textAlign: "center",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "10px",
  },
  subHeading: {
    fontSize: "14px",
    color: "#aaa",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #444",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#222", // Darker input background
    color: "#fff",
    outline: "none",
    transition: "border 0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg,rgb(140, 83, 154),rgb(140, 63, 152))", // Cool gradient button
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "opacity 0.3s",
  },
};


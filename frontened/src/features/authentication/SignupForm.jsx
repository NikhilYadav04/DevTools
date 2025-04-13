import { useForm } from "react-hook-form";
import { useSignup } from "./useSignup";

export default function SignupForm() {
  const { isLoading, signup } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password, phoneNumber }) {
    signup(
      { name: fullName, email, password, phone: phoneNumber },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <h2 style={styles.heading}>Create an Account</h2>

        {/* Full Name */}
        <div style={styles.inputGroup}>
          <label htmlFor="fullName" style={styles.label}>Full Name</label>
          <input
            type="text"
            id="fullName"
            disabled={isLoading}
            {...register("fullName", { required: "This field is required" })}
            style={styles.input}
          />
          {errors.fullName && <p style={styles.error}>{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div style={styles.inputGroup}>
          <label htmlFor="email" style={styles.label}>Email Address</label>
          <input
            type="email"
            id="email"
            disabled={isLoading}
            {...register("email", {
              required: "This field is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please provide a valid email address",
              },
            })}
            style={styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div style={styles.inputGroup}>
          <label htmlFor="password" style={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            disabled={isLoading}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            style={styles.input}
          />
          {errors.password && <p style={styles.error}>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div style={styles.inputGroup}>
          <label htmlFor="passwordConfirm" style={styles.label}>Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            disabled={isLoading}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value) =>
                value === getValues().password || "Passwords need to match",
            })}
            style={styles.input}
          />
          {errors.passwordConfirm && <p style={styles.error}>{errors.passwordConfirm.message}</p>}
        </div>

        {/* Phone Number */}
        <div style={styles.inputGroup}>
          <label htmlFor="phoneNumber" style={styles.label}>Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            disabled={isLoading}
            {...register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter a valid 10-digit phone number",
              },
            })}
            style={styles.input}
          />
          {errors.phoneNumber && <p style={styles.error}>{errors.phoneNumber.message}</p>}
        </div>

        {/* Buttons */}
        <div style={styles.buttonGroup}>
          <button type="button" onClick={reset} disabled={isLoading} style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading} style={styles.submitButton}>
            Create Account
          </button>
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
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "12px 20px",
    backgroundColor: "#444",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  submitButton: {
    padding: "12px 20px",
    background: "linear-gradient(90deg,rgb(140, 83, 154),rgb(140, 63, 152))", // Cool gradient button
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "opacity 0.3s",
  },
};


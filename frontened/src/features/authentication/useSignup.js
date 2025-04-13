import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../../services/authService";
import { setUser } from "../../services/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      dispatch(setUser(user));
      toast.success(
        "Account successfully created! Please verify the new account from the user's email address."
      );
      navigate("/home", { replace: true });
    },
    onError: () => {
      toast.error("Signup failed. Please try again.");
    },
  });

  return { isLoading, signup };
}

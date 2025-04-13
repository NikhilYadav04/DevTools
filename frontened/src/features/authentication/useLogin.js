import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { loginApi } from "../../services/authService";
import { setUser } from "../../services/authSlice";
import { toast } from "react-toastify";

export default function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      if (!data?.token || !data?.user) {
        toast.error("Login failed: No token or user data received.");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(setUser(data.user));

      toast.success("Welcome back!");
      navigate("/home", { replace: true });
    },

    onError: () => {
      toast.error("Login failed. Please check your credentials.");
    },
  });

  return { isLoading, login };
}

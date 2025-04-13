import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logoutApi } from "../../services/authService";
import { setUser } from "../../services/authSlice";
import { toast } from "react-toastify";

export function useLogout() {
  const dispatch = useDispatch();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(setUser(null));
      toast.success("Logged out successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  return { isLoading, logout };
}

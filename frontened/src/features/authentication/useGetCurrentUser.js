import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUserApi } from "../../services/authService";
import { setUser } from "../../services/authSlice";

export function useGetCurrentUser() {
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.auth.user);
  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserApi,
    onSuccess: (data) => {
      if (!storedUser || storedUser.id !== data.user.id) {
        dispatch(setUser(data.user));
      }
    },
    onError: (error) => {
      console.error("Error fetching current user:", error.message);

      if (error.response?.status === 401) {
        console.warn("Unauthorized: Logging out user...");
        dispatch(setUser(null)); // Clear user data
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return { isLoading, user: data?.user || storedUser };
}   

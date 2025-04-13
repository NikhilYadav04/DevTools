import { useSelector } from "react-redux";

export function useUser() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = !!user;

  console.log(user);

  return { user, token, isAuthenticated };
}

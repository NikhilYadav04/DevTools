import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchHistory = async () => {
  const response = await axios.get(`${API_URL}/history`);
  return response.data;
};

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
  });
}

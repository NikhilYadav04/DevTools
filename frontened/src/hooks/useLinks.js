import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  scanWebsite as scanWebsiteAPI,
  getGeminiReplacement,
  saveToHistory,
  notifyWebsite,
} from "../services/linkService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setLinks } from "../services/linkSlice";
import { useNavigate } from "react-router-dom";

export function useScanWebsite() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate: scanWebsite, isPending: isScanning } = useMutation({
    mutationFn: ({ userLink, maxPage, category }) =>
      scanWebsiteAPI({ userLink, maxPage, category }),

    onSuccess: (data) => {
      toast.success("Scan completed!");
      dispatch(setLinks(data)); // 🔄 Client state
      queryClient.invalidateQueries({ queryKey: ["scan-history"] }); // 🔄 Server state
      navigate("/dashboard");
    },

    onError: (err) => {
      console.error("❌ Scan Failed:", err);
      toast.error(`Scan failed: ${err.message}`);
    },
  });

  return { scanWebsite, isScanning };
}

export function useNotifyWebsite() {
  const queryClient = useQueryClient();

  const { mutate: notifyWebsiteFn, isPending: isNotifying } = useMutation({
    mutationFn: (data) => {
      console.log("🔄 Sending notify API request with data:", data);
      return notifyWebsite(data); // Make sure this function is imported correctly
    },

    onSuccess: (data) => {
      console.log("✅ Notify sent successfully:", data);
      toast.success("Notification scheduled!");
      queryClient.invalidateQueries({ queryKey: ["notify-history"] }); // optional
    },

    onError: (err) => {
      console.error("❌ Notify failed:", err);
      toast.error(`Notify failed: ${err.message}`);
    },
  });

  return { notifyWebsite: notifyWebsiteFn, isNotifying };
}

export function useGeminiReplacement() {
  return useMutation({
    mutationFn: getGeminiReplacement,
    onMutate: () => {
      console.log("🔄 Replacing Started...");
    },
    onSuccess: (data) => {
      console.log("✅ Replacements generated successfully!", data);
      toast.success("Replacements generated successfully!");
      onSuccess?.(data);
    },
    onError: (err) => {
      console.error("❌ Replacement Failed:", err);
      toast.error(`Replacement failed: ${err.message}`);
    },
  });
}

export function useSaveToHistory() {
  return useMutation({
    mutationFn: saveToHistory,
    onMutate: () => {
      console.log("🔄 Saving Started...");
    },
    onSuccess: () => {
      console.log("✅ History saved successfully!");
      toast.success("History saved successfully!");
    },
    onError: (err) => {
      console.error("❌ Failed to save history:", err);
      toast.error(`Failed to save history: ${err.message}`);
    },
  });
}

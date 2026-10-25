import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeToast, openToast } from "../slices/globalSlice";

export function useToast(text, isSuccess, name, time = 5000) {
  const dispatch = useDispatch();
  dispatch(openToast({ text, isSuccess, name }));
  useEffect(() => {
    const toastTimeout = setTimeout(() => dispatch(closeToast(name)), time);
    return () => clearTimeout(toastTimeout);
  }, [dispatch, time, name]);

  return { closeToast: () => dispatch(closeToast(name)) };
}

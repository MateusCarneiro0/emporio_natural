import { closeToast, openToast } from "../slices/globalSlice";
import store from "../app/store";

export function createToast(text, isSuccess, name, time = 5000000) {
  const dispatch = store.dispatch;
  dispatch(
    openToast({
      text,
      isSuccess,
      name,
    }),
  );

  let toastTimeout = setTimeout(() => {
    dispatch(closeToast(name));
    toastTimeout = null;
  }, time);
}

export function deleteToast(name) {
  store.dispatch(closeToast(name));
}

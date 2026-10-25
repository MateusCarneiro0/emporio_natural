import { createSelector, createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
  isOpenModal: false,
  toasts: [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    revertModal(sta) {
      sta.isOpenModal = !sta.isOpenModal;
    },
    closeModal(sta) {
      sta.isOpenModal = false;
    },
    openToast(sta, act) {
      sta.toasts.filter((toast) => act.payload.name !== toast.name);
      sta.toasts.push(act.payload);
    },
    closeToast(sta, act) {
      sta.toasts = sta.toasts.filter((toast) => toast.name !== act.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (sta) => {
      sta.isOpenModal = false;
    });
  },
});
const getGlobal = (store) => store.global;
export const toastSelector = createSelector(
  [getGlobal],
  (state) => state.toasts,
);

export const { revertModal, closeModal, openToast, closeToast } =
  globalSlice.actions;
export default globalSlice.reducer;

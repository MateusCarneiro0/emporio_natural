import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

const initialState = {
  isOpenModal: false,
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
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (sta) => {
      sta.isOpenModal = false;
    });
  },
});
export const { revertModal, closeModal } = globalSlice.actions;
export default globalSlice.reducer;

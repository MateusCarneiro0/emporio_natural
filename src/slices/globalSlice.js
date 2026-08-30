import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalOperationText: "",
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
});
export const {
  revertModal,
  closeModal,
} = globalSlice.actions;
export default globalSlice.reducer;

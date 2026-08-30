import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalOperationText: "",
  isOpenModal: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    openModal(sta) {
      sta.isOpenModal = true;
    },
    closeModal(sta) {
      sta.isOpenModal = false;
    },
    addGlobalOperationText(sta, act) {
      sta.globalOperationText = act.payload;
    },
    clearGlobalOperationText(sta) {
      sta.globalOperationText = "";
    },
  },
});
export const {
  openModal,
  closeModal,
  addGlobalOperationText,
  clearGlobalOperationText,
} = globalSlice.actions;
export default globalSlice.reducer;

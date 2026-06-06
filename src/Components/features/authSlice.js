import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user:"",
    password:"",
}

const authReducer = createSlice({
    name:"auth",
    initialState
})

export default authReducer.reducer
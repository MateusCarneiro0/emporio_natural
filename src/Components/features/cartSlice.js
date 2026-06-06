import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products:[]
}

const cartReducer = createSlice({
    name:"cart",
    initialState
})

export default cartReducer.reducer
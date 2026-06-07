import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    products:[],
    isLoading:false
}

const cartReducer = createSlice({
    name:"cart",
    initialState
})

export default cartReducer.reducer
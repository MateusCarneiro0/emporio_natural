import { useEffect } from "react"
import { fetchProducts } from "../features/productsSlice"
import { useDispatch } from "react-redux"

function ProductMain() {
    const dispatch = useDispatch() 

    useEffect(() => {
        dispatch(fetchProducts())
    },[dispatch])

    return (
        <div>
            Hello
        </div>
    )
}

export default ProductMain

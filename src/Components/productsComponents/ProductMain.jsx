import { useEffect } from "react";
import { fetchProducts } from "../features/productsSlice";
import { useDispatch } from "react-redux";
import { memo } from "react";
import CardProduct from "./CardProduct";

const ProductMain = memo(function ProductMain() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <CardProduct
        src="/icons/icon_1.png"
        title="AAA"
        price={25}
      >
        Rica em potássio e energia. Perfeita para vitaminas ou consumo in natura.
      </CardProduct>
    </div>
  );
});

export default ProductMain;

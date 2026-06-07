import { useParams } from "react-router-dom";
import { getProduct } from "../features/productsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThreeDots } from "react-loader-spinner";
import Error from "../Error";

function Product() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isLoading, currentProduct, error } = useSelector(
    (store) => store.products,
  );
  useEffect(() => {
    dispatch(getProduct(id));
  }, [id,dispatch]);

  if (isLoading) return <ThreeDots />;

  if (error) return <Error />;

  return (
    <div>
      {currentProduct.id}:{currentProduct.nome}
    </div>
  );
}

export default Product;

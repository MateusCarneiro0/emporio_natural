import requestJson from "./requestJson";
import { verifyProductCart } from "../utils/ProductChecker";
/*
{ 
      "nome": "Maçã Fuji",
      "descricao": "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      "imagem": "/products/maca.png",
      "alias": "Fuji Apple",
      "categorias": [
        "frutas",
        "frescos"
      ],
      "preco": 8.9,
      "link": "https://pt.wikipedia.org/wiki/Fuji_(ma%C3%A7%C3%A3)",
      "categoria": "kg",
      "id": "ow7FDsA0hfg"
    }
*/

export function addProductCart(product) {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;

    verifyProductCart(product);

    dispatch({ type: "cart/loadingCart" });
    try {
      await requestJson(`users/${userId}/addproductcart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });
      dispatch({
        type: "cart/addProductCart",
        payload: product,
      });
    } catch (err) {
      if (err.name === "ProductNotFound" && product?.id) {
        dispatch(deleteProductCart(product.id))
      }
      dispatch({ type: "cart/rejected", payload: err.message });
    }
  };
}

export function deleteProductCart(productId) {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;
    const { cartProducts } = getState().cart;

    const product = cartProducts
      .filter((productCart) => productCart?.id === productId)
      .at(0);
    if (!product) throw new Error("Produto inexistente para deletar");

    verifyProductCart(product);

    dispatch({ type: "cart/loadingCart" });
    try {
      await requestJson(`users/${userId}/removeProductCart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });

      dispatch({
        type: "cart/removeProductCart",
        payload: productId,
      });
    } catch (err) {
      if (err.name === "ProductNotFound") {
        dispatch({ type: "cart/rejected", payload: err.message });
      } else {
        dispatch({ type: "cart/rejected", payload: "Erro em deletar o produto, tente novamente mais tarde" });
      }
    }
  };
}

export function payCart() {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;
    dispatch({ type: "cart/loadingCart" });
    try {
      const data = await requestJson(`users/${userId}/clearCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [],
        }),
      });
      if (data?.status === "clean") {
        dispatch({
          type: "cart/payCart",
        });
      } else {
        throw new Error("Erro em pagar o carrinho, reinicie a página ou tente novamente mais tarde");
      }
    } catch (err) {
      dispatch({ type: "cart/rejected", payload: "Error on pay cart" });
    }
  };
}

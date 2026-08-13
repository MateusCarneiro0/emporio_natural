import requestJson from "./requestJson";
import { verifyProductCart } from "../utils/ProductChecker";
import {
  loadingCart,
  addProductCart as addProductCartAction,
  cartRejected,
  removeProductCart,
  payCart as payCartAction,
  addOperationText,
} from "../slices/cartSlice";
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

export function addProductCart(product, isInCart) {
  return async (dispatch, getState) => {

    dispatch(loadingCart());
    try {
      verifyProductCart(product);
      await requestJson(`users/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });
      dispatch(addProductCartAction(product));
      dispatch(
        addOperationText(
          `A operação de ${isInCart ? "editar" : "adicionar"} o produto ${product.nome} foi bem-sucedida`,
        ),
      );
    } catch (err) {
      if (err.name === "ProductNotFound" && product?.id) {
        dispatch(deleteProductCart(product.id));
      }
      dispatch(cartRejected(err.message));
      dispatch(
        addOperationText(
          `A operação de adicionar o produto ${product.nome} foi mal-sucedida, tente novamente`,
        ),
      );
    }
  };
}

export function deleteProductCart(productId) {
  return async (dispatch, getState) => {
    const { cartProducts } = getState().cart;

    const product = cartProducts
      .filter((productCart) => productCart?.id === productId)
      .at(0);
    if (!product) throw new Error("Produto inexistente para deletar");

    dispatch(loadingCart());
    try {
      verifyProductCart(product);
      await requestJson(`users/cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId }),
      });

      dispatch(removeProductCart(productId));
      dispatch(
        addOperationText(
          `A operação de remover o produto ${product.nome} foi bem-sucedida`,
        ),
      );
    } catch (err) {
      if (err.name === "ProductNotFound") {
        dispatch(cartRejected(err.message));
      } else {
        dispatch(
          cartRejected("Erro em deletar o produto, tente novamente mais tarde"),
        );
      }
      dispatch(
        addOperationText(
          `A operação de remover o produto ${product.nome} foi mal-sucedida, tente novamente`,
        ),
      );
    }
  };
}

export function payCart() {
  return async (dispatch, getState) => {
    const { authUserId: userId } = getState().auth;
    dispatch(loadingCart());
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
        dispatch(payCartAction());
      } else {
        throw new Error(
          "Erro em pagar o carrinho, reinicie a página ou tente novamente mais tarde",
        );
      }
    } catch (err) {
      dispatch(cartRejected("Erro em pagar carrinho"));
    }
  };
}

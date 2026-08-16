import { describe, it, expect } from "vitest";
import { verifyProductCart, ProductNotFound } from "../utils/ProductChecker";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer, {
  addProductCart,
  payCart,
  removeProductCart,
} from "../slices/cartSlice";
import productsSlice from "../slices/productsSlice";
const initializeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      products: productsSlice,
    },
  });
  return store;
};

describe("Testando validação de dados em adicionar um produto em um carrinho", () => {
  it("Deve ver se o produto é validado com todas as chaves no produto adicionado(não deve retornar nada)", () => {
    const value = verifyProductCart({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      categorias: ["frutas", "frescos"],
      categoria: "kg",
      id: "ow7FDsA0hfg",
      total: 1000,
      quantity: 1000,
    });
    expect(value).toBeUndefined();
  });

  it("Deve ver se o produto é validado com a falta de uma chave no produto adicionado(deve retornar um erro)", () => {
    expect(() =>
      verifyProductCart({
        nome: "Maçã Fuji",
        descricao:
          "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
        imagem: "/products/maca.png",
        categorias: ["frutas", "frescos"],
        categoria: "kg",
        id: "ow7FDsA0hfg",
        total: 1000,
      }),
    ).toThrow(ProductNotFound);
  });

  it("Deve ver se o produto é validado com um valor falso(deve retornar um erro)", () => {
    expect(() =>
      verifyProductCart({
        nome: "Maçã Fuji",
        descricao:
          "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
        imagem: "/products/maca.png",
        categorias: ["frutas", "frescos"],
        categoria: "kg",
        id: "ow7FDsA0hfg",
        total: 1000,
        quantity: 0,
      }),
    ).toThrow(ProductNotFound);
  });
});

describe("Testando o reducer do carrinho para criar,ler e remover produtos do carrinho.", async () => {
  describe("Testando a action de criar produto", () => {
    it("Em casos normais", () => {
      const store = initializeStore();
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "OOOOOOOOOOOOOOO",
          quantity: 3,
          categoria: "kg",
        }),
      );
      expect(store.getState().cart.cartProducts.length).toBe(1);
    });
    it("Em multiplas adições", () => {
      const store = initializeStore();
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "3",
          quantity: 3,
          categoria: "kg",
        }),
      );
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "1",
          quantity: 3,
          categoria: "kg",
        }),
      );
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "2",
          quantity: 3,
          categoria: "kg",
        }),
      );
      expect(store.getState().cart.cartProducts.length).toBe(3);
    });
    it("Em adições com mesmo identificador", () => {
      const store = initializeStore();
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "3",
          quantity: 3,
          categoria: "kg",
        }),
      );
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "3",
          quantity: 5,
          categoria: "kg",
        }),
      );
      const quantity = store.getState().cart.cartProducts.at(0).quantity;
      const lenghtCart = store.getState().cart.cartProducts.length;
      expect(lenghtCart).toBe(1);
      expect(quantity).toBe(5);
    });
  });
  describe("Testando o removedor de produtos", () => {
    it("Em casos ideais", () => {
      const store = initializeStore();
      store.dispatch(
        addProductCart({
          nome: "Melancia",
          imagem: "Imagem",
          categorias: ["top", "legal"],
          descricao: "Melancia muito boa",
          total: Number((15 * 3).toFixed(2)),
          id: "3",
          quantity: 5,
          categoria: "kg",
        }),
      );

      expect(store.getState().cart.cartProducts.length).toBe(1);

      store.dispatch(removeProductCart("3"));

      expect(store.getState().cart.cartProducts.length).toBe(0);
    });
    it("Em multiplas remoções", () => {
      const store = initializeStore();
      for (let i = 0; i < 3; i++) {
        store.dispatch(
          addProductCart({
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: `${i}`,
            quantity: 5,
            categoria: "kg",
          }),
        );
      }
      expect(store.getState().cart.cartProducts.length).toBe(3);
      for (let i = 0; i < 3; i++) {
        store.dispatch(removeProductCart(`${i}`));
      }
      expect(store.getState().cart.cartProducts.length).toBe(0);
    });
    it("Em uma remoção de um produto que não existe", () => {
      const store = initializeStore();
      store.dispatch(removeProductCart("4444454787798652"));
      expect(store.getState().cart.error).toMatch(/\S+/);
    });
  });
  describe("Testando o pagador de carrinho", () => {
    it("Em casos ideais", () => {
      const store = initializeStore();
      for (let i = 0; i < 4; i++) {
        store.dispatch(
          addProductCart({
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: `${i}`,
            quantity: 5,
            categoria: "kg",
          }),
        );
      }
      expect(store.getState().cart.cartProducts.length).toBe(4);
      store.dispatch(payCart());
      expect(store.getState().cart.cartProducts.length).toBe(0);
    });
    it("Quando não tem produtos no carrinho", () => {
      const store = initializeStore();
      store.dispatch(payCart());
      expect(store.getState().cart.error).toMatch(/\S+/);
    });
  });
});

/*

describe("Testando o de adicionar produtos", () => {
    it("Testando em um caso normal onde todos os requisitão são preenchidos", async () => {
      const store = initializeStore();
      await store.dispatch(
        addProductCart(
          {
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: "OOOOOOOOOOOOOOO",
            quantity: 3,
            categoria: "kg",
          },
          true,
          acess_token_bearer,
        ),
      );
      const cart = store.getState().cart.cartProducts;
      expect(cart.length >= 1).toBe(true);
    });
    it("Testando com a falta de uma chave no objeto", async () => {
      const store = initializeStore();

      await store.dispatch(
        addProductCart(
          {
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: "OOOOOOOOOOOOOOO",
          },
          false,
          acess_token_bearer,
        ),
      );
      const cart = store.getState().cart;

      expect(Boolean(cart.error) && cart.cartProducts.length === 0).toBe(true);
    });
    it("Sem argumentos", async () => {
      const store = initializeStore();

      await store.dispatch(addProductCart());
      const error = store.getState().cart.error;
      expect(Boolean(error)).toBe(true);
    });
    it("Produtos com mesmo identificador", async () => {
      const store = initializeStore();
      await store.dispatch(
        addProductCart(
          {
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: "OOOOOOOOOOOOOOO",
            quantity: 3,
            categoria: "kg",
          },
          true,
          acess_token_bearer,
        ),
      );
      await store.dispatch(
        addProductCart(
          {
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: "OOOOOOOOOOOOOOO",
            quantity: 6,
            categoria: "kg",
          },
          true,
          acess_token_bearer,
        ),
      );

      const cart = store.getState().cart.cartProducts;
      const productQuantity = store.getState().cart.cartProducts.at(0).quantity;
      expect(cart.length === 1 && productQuantity === 6).toBe(true);
    });
  });
  describe("Testando a API de remover produtos", () => {
    it("Caso ideal", async () => {
      const store = initializeStore();

      await store.dispatch(
        addProductCart(
          {
            nome: "Melancia",
            imagem: "Imagem",
            categorias: ["top", "legal"],
            descricao: "Melancia muito boa",
            total: Number((15 * 3).toFixed(2)),
            id: "OOOOOOOOOOOOOOO",
            quantity: 3,
            categoria: "kg",
          },
          true,
          acess_token_bearer,
        ),
      );
      await store.dispatch(
        deleteProductCart(
          "OOOOOOOOOOOOOOO",
          acess_token_bearer,
        ),
      );
      const cart = store.getState().cart;
      expect(
        cart.cartProducts.length === 0 && Boolean(cart.operationText),
      ).toBe(true);
    });
    it("Testando sem um produto no carrinho", async () => {
      const store = initializeStore();

      await store.dispatch(
        deleteProductCart(
          "OOOOOOOOOOOOOOO",
          acess_token_bearer,
        ),
      );

      const error = store.getState().cart.error;
      const cart = store.getState().cart.cartProducts;
      expect(
        error === "Produto inexistente pare remover" && cart.length === 0,
      ).toBe(true);
    });
  describe("Testando clean cart",() => {
    it("Caso ideal",() => {
      const store = initializeStore()
      store.dispatch(payCart(acess_token_bearer))
      const cart = store.getState().cart.cartProducts
      expect(cart.length === 0).toBe(true)
    })
  })
  });
});

*/

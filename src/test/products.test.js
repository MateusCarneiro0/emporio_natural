import { describe, it, expect } from "vitest";
import { verifyProduct } from "../utils/ProductChecker";
import requestJson from "../api/requestJson";
import {
  fetchProducts,
  getProduct,
} from "../Components/productsComponents/actionProduct";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import productsSlice, {
  receivedCurrentProduct,
  receiveProducts,
} from "../slices/productsSlice";

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
describe("Testando validação nos produtos na hora de carregar", () => {
  it("Deve ver se o produto é validado com todas as chaves no produto adicionado(deve retornar true)", () => {
    const value = verifyProduct({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      alias: "Fuji Apple",
      categorias: ["frutas", "frescos"],
      preco: 8.9,
      link: "https://pt.wikipedia.org/wiki/Fuji_(ma%C3%A7%C3%A3)",
      categoria: "kg",
      id: "ow7FDsA0hfg",
    });
    expect(value).toBe(true);
  });

  it("Deve ver se o produto é validado com a falta de uma chave no produto adicionado(deve retornar false)", () => {
    const value = verifyProduct({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      alias: "Fuji Apple",
      categorias: ["frutas", "frescos"],
      preco: 8.9,
      link: "https://pt.wikipedia.org/wiki/Fuji_(ma%C3%A7%C3%A3)",
      categoria: "kg",
    });
    expect(value).toBe(false);
  });

  it("Deve ver se o produto é validado com um valor falso(deve retornar false)", () => {
    const value = verifyProduct({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      alias: "Fuji Apple",
      categorias: ["frutas", "frescos"],
      preco: 8.9,
      link: "https://pt.wikipedia.org/wiki/Fuji_(ma%C3%A7%C3%A3)",
      categoria: "",
      id: "ow7FDsA0hfg",
    });
    expect(value).toBe(false);
  });
});

describe("Testando a API de produtos", async () => {
  const data = await requestJson(`users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "TEST_CART",
      password: "TEST_CART",
    }),
  });
  const acess_token_bearer = data.acess_token;

  it("Testando a busca dos produtos", async () => {
    const store = initializeStore();
    const products = await fetchProducts();
    store.dispatch(receiveProducts(products));

    const reducerProducts = store.getState().products.displayProducts;

    expect(products.length >= 1 && reducerProducts.length >= 1).toBe(true);
  });
  it("Testando a resposta do slice quando vem resposta com chaves faltando", () => {
    const FAKE_PRODUCTS = [
      { id: "62544" },
      { id: "dbsbdhs" },
      { id: "dhbdhsgd", name: "bhdsvfgdc" },
    ];
    const store = initializeStore();
    store.dispatch(receiveProducts(FAKE_PRODUCTS));
    const products = store.getState().products.displayProducts;
    expect(products.length).toBe(0);
  });
  it("Testando a busca de produtos em um caso ideal", async () => {
    const product = await getProduct(
      { params: { id: "2IKmBL0eRv4" } },
      acess_token_bearer,
    );

    const store = initializeStore();
    store.dispatch(receivedCurrentProduct(product));
    const currentProduct = store.getState().products.currentProduct;
    expect(
      Object.keys(product).length >= 1 &&
        Object.keys(currentProduct).length >= 1,
    ).toBe(true);
  });
  it("Testando o slice de buscar somente um produto em caso de erro", async () => {
    const data = await getProduct({params:{id:"ERROR"}},acess_token_bearer)
    const dataError = data?.error
    expect(dataError).match(/.+/)
  })
});

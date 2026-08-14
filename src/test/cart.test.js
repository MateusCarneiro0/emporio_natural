import { describe, it, expect } from "vitest";
import { verifyProductCart, ProductNotFound } from "../utils/ProductChecker";
import "@testing-library/jest-dom";
import { addProductCart } from "../api/cartApi";
import store from "../app/store";
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

describe("Testando a API do carrinho para criar,ler e remover produtos do carrinho.", () => {
  describe("Testando o de adicionar produtos", () => {
    it("Testando em um caso normal onde todos os requisitão são preenchidos", async () => {
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
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4NjczNDU3MSwianRpIjoiNWIxZDM3Y2UtYmZjYy00YzIwLWE5ZGEtNDBlMDdmOWViMjg1IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImQ2MWU2MGEyZGY2ZjQ3NDliOTA5YmE5ZThjMmU0MDU4IiwibmJmIjoxNzg2NzM0NTcxLCJjc3JmIjoiMWVkNGNhMTAtOTMxMS00YzcwLWJlYWItZmEwYzY4MDQ0OTk1IiwiZXhwIjoxNzg3OTQ0MTcxfQ.swbcvSri508ZCZDJE3HS3dSqfCUQAWpccint8vhOiqw"
        ),
      );
      const cart = store.getState().cart.cartProducts;
      expect(cart.length >= 1).toBe(true);
    });
    it("Testando com a falta de uma chave no objeto", async () => {
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
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc4NjczNDU3MSwianRpIjoiNWIxZDM3Y2UtYmZjYy00YzIwLWE5ZGEtNDBlMDdmOWViMjg1IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImQ2MWU2MGEyZGY2ZjQ3NDliOTA5YmE5ZThjMmU0MDU4IiwibmJmIjoxNzg2NzM0NTcxLCJjc3JmIjoiMWVkNGNhMTAtOTMxMS00YzcwLWJlYWItZmEwYzY4MDQ0OTk1IiwiZXhwIjoxNzg3OTQ0MTcxfQ.swbcvSri508ZCZDJE3HS3dSqfCUQAWpccint8vhOiqw"
        ),
      );
      const cart = store.getState().cart
      expect(Boolean(cart.error)).toBe(true)
    });
    it("Sem argumentos", async () => {
      await store.dispatch(addProductCart())
      const error = store.getState().cart.error;
      expect(Boolean(error)).toBe(true)
    })
  });
  describe("Testando a API de remover produtos",() => {
    it("Caso ideal")
  })
});

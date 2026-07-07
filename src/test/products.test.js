import { describe, it, expect } from "vitest";
import { verifyProduct } from "../utils/ProductChecker";

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

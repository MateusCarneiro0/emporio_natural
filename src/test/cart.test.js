import { describe, it, expect } from "vitest";
import { verifyProductCart } from "../utils/ProductChecker";
describe("Testando validação de dados em adicionar um produto em um carrinho", () => {
  it("Deve ver se o produto é validado com todas as chaves no produto adicionado(deve retornar true)", () => {
    const value = verifyProductCart({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      categorias: ["frutas", "frescos"],
      categoria: "kg",
      id: "ow7FDsA0hfg",
      total:1000,
      quantity:1000
    })
    expect(value).toBeUndefined()
  });

  it("Deve ver se o produto é validado com a falta de uma chave no produto adicionado(deve retornar false)", () => {
    expect(() => verifyProductCart({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      categorias: ["frutas", "frescos"],
      categoria: "kg",
      id: "ow7FDsA0hfg",
      total:1000,
    })).toThrow()
  });

  it("Deve ver se o produto é validado com um valor falso(deve retornar false)", () => {
    expect(() => verifyProductCart({
      nome: "Maçã Fuji",
      descricao:
        "Maçã fresca, doce e crocante. Excelente para lanches saudáveis e preparo de sucos.",
      imagem: "/products/maca.png",
      categorias: ["frutas", "frescos"],
      categoria: "kg",
      id: "ow7FDsA0hfg",
      total:1000,
      quantity:0
    })).toThrow()
  });
});

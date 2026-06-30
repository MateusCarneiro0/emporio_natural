class ProductNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductNotFound";
  }
}

export function verifyProductCart(currentProduct) {
  if (!Object.keys(currentProduct).length) {
    console.log("ERROR");
    throw new ProductNotFound("Product not found");
  } else {
    const listOfKeys = [
      "nome", //
      "id", //
      "descricao", //
      "imagem",
      "categorias", //
      "categoria", //
      "total",
      "quantity",
    ];
    const verified =
      listOfKeys.filter((key) => {
        return key in currentProduct;
      }).length === listOfKeys.length;
    console.log(listOfKeys.filter((key) => key in currentProduct));
    console.log(verified);

    console.log(currentProduct);
    if (!verified) {
      throw new ProductNotFound("Product not found");
    }
  }
}
export function verifyProduct(currentProduct) {
  if (!Object.keys(currentProduct).length) {
    console.log(currentProduct);
    return false;
  } else {
    const listOfKeys = [
      "nome",
      "id",
      "descricao",
      "imagem",
      "categorias",
      "preco",
      "categoria",
      "alias",
      "link",
    ];

    const verified =
      listOfKeys.filter((key) => {
        return key in currentProduct;
      }).length === listOfKeys.length;
    if (!verified) {
      return false;
    }
  }
  return true;
}

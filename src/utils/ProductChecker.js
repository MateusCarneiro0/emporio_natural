class ProductNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductNotFound";
  }
}

function verifyKeys(listOfKeys, currentProduct) {
  if (!Object.keys(currentProduct).length) {
    return false;
  } else {
    const verified =
      listOfKeys.filter((key) => {
        return key in currentProduct && currentProduct[key];
      }).length === listOfKeys.length;
    return verified;
  }
}
export function verifyProductCart(currentProduct) {
  const listOfKeys = [
    "nome",
    "id", 
    "descricao", 
    "imagem",
    "categorias", 
    "categoria", 
    "total",
    "quantity",
  ];
  const verified = verifyKeys(listOfKeys, currentProduct);

  console.log(listOfKeys.filter((key) => key in currentProduct));
  console.log(verified);
  console.log(currentProduct);
  
  if (!verified) {
    throw new ProductNotFound("Product not found");
  }
}
export function verifyProduct(currentProduct) {
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

  const verified = verifyKeys(listOfKeys, currentProduct);
  return verified;
}

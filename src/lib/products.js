export async function getProducts() {
  const products = await fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .catch(() => []);
  return products;
}

// admin ajax
const deleteProduct = btn => {
  const productId = btn.parentNode.querySelector("[name = productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name = _csrf]").value;
  const productElement = btn.closest("article");

  // send Ajax request
  fetch("/admin/product/" + productId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrfToken
    }
  })
    .then(result => {
      return result.json();
    })
    .then(data => {
      // remove element
      productElement.remove();
      // productElement.parentNode.removeChild(productElement) // for older browsers
    })
    .catch();
};

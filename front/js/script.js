const apiURL = `http://localhost:3000/api/products`;

// fetch tous les produits
fetch(apiURL)
  .then((response) => response.json())
  .then((products) => {
    //Créer un produit pour chaque index
    for (let product of products) {
      document.querySelector("#items").insertAdjacentHTML(
        "afterbegin",
        `<a href="./product.html?id=${product._id}">
        <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}, ${product.name}">
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
        </article>
        </a>`
      );
    }
  })
  .catch((error) => alert("Erreur : " + error));

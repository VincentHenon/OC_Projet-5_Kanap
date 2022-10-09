var getId = new URL(window.location.href); //Obtenir l'URL en cours
var idSub = getId.search; //Ne garder que la partie "search" de l'URL.
var _id = idSub.substring(4, 200); //ne garder que l'id en enlevant les 4 premiers caractères ("?=_id")
const apiURL = `http://localhost:3000/api/products`; //adresse de l'API de tous les produits
let productURL = apiURL + "/" + _id; //construction de l'adresse de l'API produit

const productImage = document.querySelector(".item__img");
const productTitle = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDescription = document.querySelector("#description");
const productColors = document.querySelector("#colors");

fetch(productURL)
  .then((response) => response.json())
  .then((getProduct) => {
    let product = getProduct;
    productImage.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productTitle.innerHTML += product.name;
    productPrice.innerHTML += product.price;
    productDescription.innerHTML += product.description;
    //boucle pour obtenir chaque index de l'array "product.colors"
    for (i = 0; i < product.colors.length; i++) {
      productColors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
    }
  })
  .catch((error) => alert("Erreur : " + error));

/*document.querySelector("#addToCart").addEventListener("click", function() {
    send(sendCart);
  };*/ // pour écouter le bouton lorsqu'il sera cliquer

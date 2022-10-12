// DECLARATION VARIABLES
const productImage = document.querySelector(".item__img");
const productTitle = document.querySelector("#title");
const productPrice = document.querySelector("#price");
const productDescription = document.querySelector("#description");
const productColors = document.querySelector("#colors");
const productQuantity = document.querySelector("#quantity");
const addToCart = document.querySelector("#addToCart");
const goToCart = document.querySelector(".item__content__addButton");

let dataToBeSend = {};

// OBTENTION DE L'ID DU PRODUIT
let getId = new URL(window.location.href); //Obtenir l'URL en cours
let idSub = getId.search; //Ne garder que la partie "search" de l'URL.
let _id = idSub.substring(4, 200); //ne garder que l'id en enlevant les 4 premiers caractères ("?=_id")
const apiURL = `http://localhost:3000/api/products`; //adresse de l'API de tous les produits
let productURL = apiURL + "/" + _id; //construction de l'adresse de l'API produit

// RECUPERATION DES DATAS DU PRODUIT
fetch(productURL)
  .then((response) => response.json())
  .then((getProduct) => {
    product = getProduct;

    // AJOUT DES BALISES + DATA DANS LE DOM
    document.title = product.name; // inscrit le nom du produit dans le titre de la page
    productImage.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productTitle.innerHTML += product.name;
    productPrice.innerHTML += product.price;
    productDescription.innerHTML += product.description;

    // BOUCLE POUR TOUS LES INDEXS DE L'ARRAY "product.colors"
    for (i = 0; i < product.colors.length; i++) {
      productColors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
    }
  })
  .catch((error) => alert("Erreur : " + error));

// ECOUTE DU BOUTON POUR RASSEMBLER LES DATAS DANS UN ARRAY POUR LES ENVOYER SUR LE SERVEUR
addToCart.addEventListener("click", sendData);

function sendData(dataToBeSend) {
  // ON VERIFIE SI UNE COULEUR ET UNE QUANTITE ONT ETE SELECTIONNEES
  if (productColors.value === "" || productQuantity.value == 0) {
    alert(
      "Choississez une couleur et/ou une quantité avant de valider votre commande."
    );
  } else {
    dataToBeSend = {
      ID: _id,
      color: productColors.value,
      quantity: productQuantity.value,
    };

    fetch(apiURL + "/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToBeSend),
    })
      .then((response) => response.json())
      .catch(() => {
        alert("Le serveur ne répond pas. Veuillez éssayer plus tard.");
      });
    return dataToBeSend;
  }
}
console.log(dataToBeSend);
console.log(apiURL + "/order");

/*fetch(apiURL + "/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToBeSend),
  }).then(function (dataCart) {
    if (dataCart.ok) {
      console.log(dataCart.json);
    }
  });
}*/

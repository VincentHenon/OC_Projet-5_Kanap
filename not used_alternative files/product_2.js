// Obtention de l'id de l'article.
let currentID = new URL(window.location).searchParams.get("id"); //Obtenir l'id de l'article
const apiURL = `http://localhost:3000/api/products`; //adresse de l'API de tous les artciles
let productURL = apiURL + "/" + currentID; //construction de l'adresse de l'API de l'article

//Déclaration variables.
let productColors = document.querySelector("#colors");
let productQuantity = document.querySelector("#quantity");
let product = "";
/*let cart = JSON.parse(localStorage.getItem("cart"));
console.log("type of cart :" + typeof cart);
console.log("cart stringified :" + JSON.stringify(cart));*/
let item = {};
let cart = [];

// Récupération des données du produit.
fetch(productURL)
  .then((response) => response.json())
  .then(
    /*async*/ function (getProduct) {
      product = /*await*/ getProduct;
      productToDom(product);
    }
  );

// Modification du DOM pour afficher dynamiquement la page selon le produit.
function productToDom(product) {
  document.title = product.name;

  let productImage = document.querySelector(".item__img");
  productImage.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  let productTitle = document.querySelector("#title");
  productTitle.innerHTML += product.name;

  let productPrice = document.querySelector("#price");
  productPrice.innerHTML += product.price;

  let productDescription = document.querySelector("#description");
  productDescription.innerHTML += product.description;

  for (i = 0; i < product.colors.length; i++) {
    productColors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }
  addToCart(product);
}

//Lancement de la fonction principale au click du bouton "ajouter au panier".
function addToCart() {
  document.querySelector("#addToCart").addEventListener("click", function () {
    checkUserSelection();
    if (selectionOK) {
      createItem(product);
      let parsedCart = getCart();
      //isCartEmpty(cart);
      //productAdded();
      saveCart(item, parsedCart);
    }
  });
}

// Vérification que la couleur a été selectionnée + que la quantité figure entre 1 et 100.
function checkUserSelection() {
  if (
    productColors.value === "" ||
    productQuantity.value == 0 ||
    productQuantity >= 100
  ) {
    alert(
      "Choississez une couleur et/ou une quantité entre 1 et 100 avant de valider votre commande."
    );
    selectionOK = false;
  } else {
    selectionOK = true;
  }
}

//Création de l'objet "product".
function createItem(product) {
  item = {
    id: currentID,
    name: product.name,
    image: product.imageUrl,
    altImage: product.altTxt,
    price: product.price,
    color: productColors.value,
    quantity: productQuantity.value,
  };
  //item = Object.entries(item);
  //console.log(item);
  return item;
}

function getCart() {
  //on interroge le localstorage
  cart = localStorage.getItem("cart");
  if (cart === null) {
    console.log("getCart: empty cart is -> " + cart);
    console.log("getCart: the type of empty cart is -> " + typeof cart);
    return [];
  } else {
    console.log("getCart: full cart is -> " + cart);
    console.log("getCart: the type of full cart is -> " + typeof cart);
    console.log("getCart: full cart is parsed -> " + JSON.parse(cart));
    console.log(
      "getCart: the type of full cart parsed is ->  " + typeof JSON.parse(cart)
    );
    return JSON.parse(cart);
  }
}

function saveCart(item, cart) {
  //si cart VIDE on enregistre item dedans.
  //si cart n'est pas vide alors on push le nouvel item dans le cart.
  //getCart();
  if (cart.length === 0) {
    localStorage.setItem("cart", JSON.stringify(item));
    console.log(
      "saveCart:cart is empty and the stringified item is -> " +
        JSON.stringify(item)
    );
    console.log("saveCart: cart is saved now");
  } else {
    let isIdExist = checkCartItemsId(item, parsedCart);
    if (isIdExist == true) {
      let isColorSame = checkCartItemsColor(item, parsedCart);
      if (isColorSame == true) {
      }
    }
  }
  console.log("saveCart: cart is full and it needs to get ID checked");
  //cart.add(item);
}

function isCartEmpty(item, cart) {
  //check si le cart est vide.
  //si vide -> on storeItemInCart()
  //si non vide -> checkCartItemsId()
  getCart();
  if (cart != null) {
    checkCartItemsId(cart);
    console.log(
      "isCartEmpty: cart is full and we need to check items id in it"
    );
  } else {
    saveCart(item);
    console.log("isCartEmpty:cart was empty and is saved now");
  }
}

function checkCartItemsId(item, cart) {
  //check id des items dans le cart.
  //si même id -> checkCartitemsColor()
  //si id différente -> storeItemInCart()
  let cartCheckId = cart.find((e) => e.id == item.id);
  if (cartCheckId != undefined) {
    return true; //checkCartItemsColor();
  } else {
    return false;
  }
}

function checkCartItemsColor(item) {
  //check la couleur des items du cart.
  //si même couleur -> CheckCartItemsQuantity()
  //si couleur différente -> storeItemInCart()
  getCart();
  let cartCheckColor = cart.find((e) => e.color == item.color.value);
  if (cartCheckColor) {
    checkCartItemsQuantity();
  } else {
    saveCart();
  }
}

function checkCartItemsQuantity() {
  //check la quantité de l'item dans le cart et l'additionner a la valeur de l'input de item.
  /*let cartCheckQuantity = cart.find((e) => e.quantity == item.quantity.value)*/
  //quantityToAdd = input.value
  //cartItemQuantity = cart.item.quantity
  //newQuantity = cartItemQuantity + quantityToAdd
  //on remplace quantity de l'item du cart par newQuantity
  //getCart();
}

function productAdded() {
  window.confirm(`Vous venez d'ajouter ${productQuantity.value} exmplaire(s) de l'article ${product.name} à votre pannier.
  Voulez allez être rediriger sur la page de votre pannier.`);
  window.location = "http://127.0.0.1:5500/front/html/cart.html"; //envoie à la page cart.
}

//si la couleur de l'id est la même que celle dans le basket, alors on check la quantité de de l'id du basket et on y ajoute l'input quantité de l'item.
//si la couleur n'est pas la même alors on push l'item dans le basket.

//si le localstorage est vide, alors on enregistre item dans le basket.
//si le localstorage n'est pas vide, alors on doit vérifier que un des ids dans le storage est le même que l'item.
//si l'id de l'item est le même que celui dans le basket, alors on vérifie que la couleur de de cette id est la même que celle de l'item.
//check color

//Si l'id de l'item n'est pas dans le basket, alors on le push dans le basket.
//push item dans le basket.

//on regarde si il y a déjà un item dans le localstorage
//si ce n'est pas le cas on ajoute l'item au localstorage.
//si il y a déjà un item alors on compare les ids et la couleur
// si même id et couleur on récupère la nouvelle quantité et on l'additionne avec l'ancienne.
//sinon on push le nouvelle item dans le tableau.

//sur le fichier product.js juste la construction du tableau data et l'envoyer dans le localstorage. Puis fetch POST c'est sur le fichier cart.js
//avant d'ajouter dans le localstorage vérifier qu'on a bien un data et si il y a déjà un data dans le localstorage.
//add addToCart sert à construire l'objet envoyer l'objet sur le localstorage vérifier le localstorage et ensuite aller sur la page cart.html

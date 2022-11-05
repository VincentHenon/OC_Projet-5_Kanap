// Obtention de l'id du produit
let currentID = new URL(window.location).searchParams.get("id"); //Obtenir l'id de l'article
const apiURL = `http://localhost:3000/api/products/`; //adresse de l'API de tous les artciles
let productURL = apiURL + currentID; //construction de l'adresse de l'API de l'article

// Déclaration variables.
let productColors = document.querySelector("#colors");
let productQuantity = document.querySelector("#quantity");
let product = "";
let cart = [];

// Récupération depuis l'API.
fetch(productURL)
  .then((response) => response.json())
  .then(function (product) {
    if (product != null) {
      productToDom(product);
    }
    console.log(product);
  });

// Modification du DOM pour afficher dynamiquement la page selon le produit.
function productToDom(product) {
  document.title = product.name;

  //item img
  document.querySelector(
    ".item__img"
  ).innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  //item name
  document.querySelector("#title").innerHTML += product.name;
  //item price
  document.querySelector("#price").innerHTML += product.price;
  //item description
  document.querySelector("#description").innerHTML += product.description;

  //item color selection
  for (i = 0; i < product.colors.length; i++) {
    productColors.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }

  // Lancement de la fonction principale "ajouter au panier".
  addToCart(product);
}

function addToCart(product) {
  // Ecoute le bouton "ajouter au panier" pour déclencher des évênements.
  document.querySelector("#addToCart").addEventListener("click", function () {
    // Vérification si le user a bien selectionné une couleur ou une quantité entre 1 et 100.
    if (
      productColors.value === "" ||
      productQuantity.value == 0 ||
      productQuantity.value > 100
    ) {
      alert(
        "Choississez une couleur et/ou une quantité entre 1 et 100 avant de valider votrecommande."
      );
      return;

      // Si la sélection a bien était faite alors on construit l'objet "item" à envoyer dans le local storage.
    }
    let item = {
      id: currentID,
      name: product.name,
      color: productColors.value,
      quantity: Number(productQuantity.value),
      //price: Number(product.price),
      image: product.imageUrl,
      altImage: product.altTxt,
    };
    console.log("The item has been created.");

    // On regarde ce qu'il y a dans le local storage.
    cart = getCart();

    // Si le local storage est vide alors on enregistre l'item dans le cart.
    if (cart.length === 0) {
      console.log("Time to store the item in the cart...");
      storeItemToCart(item, cart);
      console.log("...Item's been stored in the cart.");
      return;

      // Si il y a quelque chose on récupère ce qui se trouve dans le cart.
    }
    if (cart.length > 0) {
      let itemsInCart = JSON.parse(localStorage.getItem("cartItem"));

      // Recherche dans le local storage si un item possède la même id et la même couleur que l'item que l'on veut ajouter.
      if (itemsInCart != null) {
        console.log(
          "Let's see if an other item with the ID: " +
            currentID +
            " and with the color: " +
            productColors.value +
            "  exists in the cart."
        );
        const sameItemInCart = itemsInCart.find(
          (itm) => itm.id === currentID && itm.color === productColors.value
        );

        // Si on trouve bien un item semblable alors on additione la quantité de l'item dans le local storage et la quantité que le user a sélectionnée.
        if (sameItemInCart == null) {
          console.log(
            "No... There is no item like the one you want to add in the cart!"
          );
          storeItemToCart(item, cart);
          console.log("The item has been stored among others in the cart.");
          return;
        }
        console.log(
          "Yes! The item you want to add, already exists within the cart!"
        );
        let totalQuantity =
          Number(sameItemInCart.quantity) + Number(productQuantity.value);
        console.log(
          "The total quantity for the two items is " + totalQuantity + "."
        );

        // Scanning des indexes du tableau itemsInCart pour retrouver l'item dont on veut remplacer la quantité.
        for (i = 0; i < itemsInCart.length; i++) {
          if (
            itemsInCart[i].id === currentID &&
            itemsInCart[i].color === productColors.value
          ) {
            // On remplace la quantité de l'item dans le cart.
            itemsInCart[i].quantity = totalQuantity;
          }
        }
        // On enregistre le changement de l'item du cart dans le cart.
        localStorage.setItem("cartItem", JSON.stringify(itemsInCart));
        console.log("The item's quantity has been updated.");
        goToCart();

        // Si on ne trouve pas un même item dans le local storage alors on rajoute un item à la liste.
      } else {
        itemsInCart = [];
        itemsInCart.push(item);
        storeItemToCart(item, cart);
        console.log("item's been added to the cart.");
        console.log(item);
      }
    }
  });
}

//Pour récupérer ce qu'il y a dans le cart.
function getCart() {
  cart = localStorage.getItem("cartItem");
  if (cart === null) {
    console.log("The cart is empty.");
    return [];
  } else {
    console.log("Oh! There is something in the cart! Let's check it out!");
    return JSON.parse(cart);
  }
}

// Pour enregistrer l'item dans le cart.
function storeItemToCart(item, cart) {
  cart.push(item);
  console.log(cart);
  localStorage.setItem("cartItem", JSON.stringify(cart));
  goToCart();
}

// Renvoie à la page Cart.html si le cart a été sauvé.
function goToCart() {
  let choice = confirm("Vous allez être redirigé vers votre panier.");
  if (choice) {
    window.location = "http://127.0.0.1:5500/front/html/cart.html";
  }
}

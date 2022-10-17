// Obtention de l'id du produit
let currentID = new URL(window.location).searchParams.get("id"); //Obtenir l'id de l'article
const apiURL = `http://localhost:3000/api/products`; //adresse de l'API de tous les artciles
let productURL = apiURL + "/" + currentID; //construction de l'adresse de l'API de l'article

// Déclaration variables.
let productColors = document.querySelector("#colors");
let productQuantity = document.querySelector("#quantity");
let product = "";
let userSelection = false;
let cart = [];
let itemOrdered = false;

// Récupération depuis l'API.
fetch(productURL)
  .then((response) => response.json())
  .then(async function (getProduct) {
    product = await getProduct;
    if (product != null) {
      productToDom(product);
    }
  });

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

      // Si la sélection a bien était faite alors on construit l'objet "item" à envoyer dans le local storage.
    } else {
      let item = {
        id: currentID,
        name: product.name,
        color: productColors.value,
        quantity: productQuantity.value,
        price: product.price,
        image: product.imageUrl,
        altImage: product.altTxt,
      };

      // On regarde ce qu'il y a dans le local storage.
      cart = getCart();

      // Si le local storage est vide alors on enregistre l'item dans le cart.
      if (cart.length === 0) {
        storeItemToCart(item, cart);

        // Si il y a quelque chose on récupère ce qui se trouve dans le cart.
      } else {
        let itemsInCart = JSON.parse(localStorage.getItem("cart"));

        // Recherche dans le local storage si un item possède la même id et la même couleur que l'item que l'on veut ajouter.
        if (itemsInCart != null) {
          const sameItemInCart = itemsInCart.find(
            (itm) => itm.id === currentID && itm.color === productColors.value
          );

          // Si on trouve bien un item semblable alors on additione la quantité de l'item dans le local storage et la quantité que le user a sélectionnée.
          if (sameItemInCart != null) {
            let sameItemInCartQuantity = sameItemInCart.quantity;
            let totalQuantity =
              Number(sameItemInCartQuantity) + Number(productQuantity.value);

            // Scanning des indexes du tableau itemsInCart pour retrouver l'item dont on veut remplacer la quantité.
            for (i = 0; i < itemsInCart.length; i++) {
              if (
                itemsInCart[i].id === currentID &&
                itemsInCart[i].color === productColors.value
              ) {
                // On remplace la quantité de l'item dans le cart.
                itemsInCart[i].quantity = Number(totalQuantity);
              }
            }
            // On enregistre le changement de l'item du cart dans le cart.
            localStorage.setItem("cart", JSON.stringify(itemsInCart));

            // Si l'item ne se trouve pas dans le cart alors on l'ajoute dans cart
          } else {
            storeItemToCart(item, cart);
          }

          // Si on ne trouve pas un même item dans le local storage alors on rajoute un item à la liste.
        } else {
          itemsInCart = [];
          itemsInCart.push(item);
          storeItemToCart(item, cart);
        }
      }
    }
  });
}

//Pour récupérer ce qu'il y a dans le cart.
function getCart() {
  cart = localStorage.getItem("cart");
  if (cart === null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

// Pour enregistrer l'item dans le cart.
function storeItemToCart(item, cart) {
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  goToCart(itemOrdred);
}

// Renvoie à la page Cart.html si le cart a été sauvé.
function goToCart(itemOrdered) {
  window.location = "http://127.0.0.1:5500/front/html/cart.html";
}

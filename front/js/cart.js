let cart = [];
let item = [];
//let item = {};

const itemsDOM = document.querySelector("#cart__items");
const itemDOM = document.querySelector("#cart__item");
const itemImgDOM = document.querySelector(".cart__item__img");
const nbrArticlesDOM = document.querySelector("#totalQuantity");
const itemsTotalDOM = document.querySelector("#totalQuantity");
const totalPriceDOM = document.querySelector("#totalPrice");

getCart(cart);

for (i = 0; i < cart.length; i++) {
  item = cart[i];
  //console.log(item);
  itemsDOM.insertAdjacentHTML(
    "afterbegin",
    `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
                <div class="cart__item__img">
                  <img src="${item.image}" alt="${item.altImage}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${item.name}</h2>
                    <p>${item.color}</p>
                    <p>${item.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`
  );
}

//Somme du total de toutes les quantitées de tous les articles + le total du prix.
let totalQuantity = 0;
let totalPrice = 0;
for (i = 0; i < cart.length; i++) {
  totalQuantity += cart[i].quantity;
  totalPrice += cart[i].quantity * cart[i].price;
}
nbrArticlesDOM.insertAdjacentHTML("afterbegin", `${totalQuantity}`);
totalPriceDOM.insertAdjacentHTML("afterbegin", `${totalPrice}`);

//Affichage de input pour la quantité de chaque article
const inputQuantityDOM = document.querySelectorAll(".itemQuantity");

let inputQuantity = 0;
// for (i = 0; i < inputQuantityDOM.value.length; i++) {
//   inputQuantity += inputQuantityDOM.value[i];
//   console.log(inputQuantityDOM.value[i]);
// }

itemQuantity.add.addEventListener("change", function () {
  inputQuantity = inputQuantityDOM.value;
  //console.log(inputQuantity);
  console.log(inputQuantityDOM);
});

//deux méthodes pour avoir la quantité de chaque article de manière dynamique.
//#1 on lit l'input de chaque item et on doit muliplier l'input.quantity * item.price.
//#2 on sauve a chaque changement de l'input quantité le cart et on a juste a faire la muliplicaton item.quantity * item.price

//Pour récupérer ce qu'il y a dans le cart.
function getCart() {
  cart = JSON.parse(localStorage.getItem("cart"));
  //console.log(cart);
  //   if (cart === null) {
  //     return [];
  //   } else {
  //     return JSON.parse(cart);
  //   }
}

//récupere tout le contenu du locastorage.

//form => validation regex

//format pour "order button"

/*
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */

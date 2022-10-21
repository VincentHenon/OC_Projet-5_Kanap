let cart = getCart(); // √

const itemDOM = document.querySelector("#cart__items");

displayItems(cart); // √
inputQuantityEvent(); // √
calcTotalQuantity(cart); // √
calcTotalPrice(cart); // √
deleteEvent(cart); // √

//////////////////////////////
// Récupère le panier en array
function getCart() {
  return JSON.parse(localStorage.getItem("cartItem"));
}

////////////////////////////////
// Affiche le panier dans l'HTML
function displayItems(cart) {
  itemDOM.innerHTML = "";
  if (cart === null) {
    itemDOM.innerHTML = "<h2>Désolé, votre panier est vide!</h2>";
    console.log("le pannier est vide");
    return;
  }
  for (itm = 0; itm < cart.length; itm++) {
    item = cart[itm];
    itemDOM.insertAdjacentHTML(
      "beforeend",
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
                                  <input type="number" class="itemQuantity" data-id="${item.id}" data-color="${item.color}"  name="itemQuantity" min="1" max="100" value="${item.quantity}">
                                </div>
                                <br>
                                <div class="cart__item__content__settings__delete">
                                  <p class="deleteItem" data-id="${item.id}" data-color="${item.color}">Supprimer</p>
                                </div>
                              </div>
                            </div>
                          </article>`
    );
  }
}

////////////////////////////////////////////////
// Met à jour les quantités dans le localstorage
function inputQuantityEvent() {
  let inputsDOM = document.querySelectorAll(".itemQuantity");

  //on scanne toutes les inputs pour la quantité.
  inputsDOM.forEach((inputDOM) => {
    inputDOM.addEventListener("change", function (e) {
      let newQuantity = this.value;
      let getDataId = this.getAttribute("data-id");
      let getDataColor = this.getAttribute("data-color");
      let cart = getCart();

      //On cherche l'item qui possède la même Id et Color que l'input.
      let foundIndex = cart.findIndex(
        (obj) => obj.id === getDataId && obj.color === getDataColor
      );
      //On assigne la bonne quantité à l'item trouvé dans le cart et on sauve le cart.
      cart[foundIndex].quantity = newQuantity;
      localStorage.setItem("cartItem", JSON.stringify(cart));
      location.reload(); //On réactualise la page pour afficher le changement.
    });
  });
}

///////////////////////////////////////////
// Calcule le total de toutes les quantités
function calcTotalQuantity() {
  let totalQuantity = 0;
  cart.forEach((item) => {
    totalQuantity += Number(item.quantity);
    return totalQuantity;
  });
  document.querySelector("#totalQuantity").innerText = `${totalQuantity}`;
}

///////////////////////////
// Calcule le total goblal
function calcTotalPrice() {
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += Number(item.quantity) * Number(item.price);
    return totalPrice;
  });
  document.querySelector("#totalPrice").innerText = `${totalPrice}`;
}

///////////////////////////////////////////////////////////////
// Gestion des boutons supprimer et mise à jour du locastorage
function deleteEvent() {
  let btnsDeleteDOM = document.querySelectorAll(".deleteItem");

  //on scanne toutes les boutons.
  btnsDeleteDOM.forEach((btnDeleteDOM) => {
    btnDeleteDOM.addEventListener("click", function (e) {
      let getDataId = this.getAttribute("data-id");
      let getDataColor = this.getAttribute("data-color");

      //On cherche les items qui ne possèdent pas la même Id et Color que le bouton.
      cart = cart.filter(
        (obj) => !(obj.id == getDataId && obj.color == getDataColor)
      );
      console.log(cart);

      localStorage.setItem("cartItem", JSON.stringify(cart));
      location.reload(); //On réactualise la page pour afficher le changement.
    });
  });
}

//ajouter une condition lorsqu'on supprime le dernier article du panier alors on doit faire un localStorage.removeItem ou un localStorage.clear()????

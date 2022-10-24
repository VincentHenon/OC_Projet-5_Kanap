let cart = getCart(); // √
let formDOM = document.querySelector(".cart__order__form");
let orderBtn = document.querySelector("#order");

displayItems(cart); // √
inputQuantityEvent(); // √
calcTotalQuantity(cart); // √
calcTotalPrice(cart); // √
deleteEvent(cart); // √

orderBtn.addEventListener("click", (e) => {
  let userForm = {
    firstName: formDOM.firstName.value,
    lastName: formDOM.lastName.value,
    address: formDOM.address.value,
    city: formDOM.city.value,
    email: formDOM.email.value,
  };
  console.log(userForm);
  e.preventDefault();
  checkingForm(this);
});

//////////////////////////////
// Récupère le panier en array
function getCart() {
  return JSON.parse(localStorage.getItem("cartItem"));
}

////////////////////////////////
// Affiche le panier dans l'HTML
function displayItems(cart) {
  const itemDOM = document.querySelector("#cart__items");
  itemDOM.innerHTML = "";

  if (cart === null || cart.length === 0) {
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

function checkingForm() {
  formDOM.lastName.addEventListener("change", function () {
    lastNameCheck(this);
  });

  formDOM.address.addEventListener("change", function () {
    addressCheck(this);
  });

  formDOM.city.addEventListener("change", function () {
    cityCheck(this);
  });
  formDOM.email.addEventListener("change", function () {
    emailCheck(this);
  });

  formDOM.firstName.addEventListener("change", function () {
    firstNameCheck(this);
  });

  if (
    firstNameCheck() &&
    lastNameCheck() &&
    addressCheck() &&
    cityCheck() &&
    emailCheck()
  ) {
    //sending data
  }
}

function firstNameCheck() {
  let firstNameFormat = /^([a-zAZéèêëàâäöôüûïî']*?[ ]?)*$/;
  let firstNameMsg = document.querySelector("#firstNameErrorMsg");

  if (formDOM.firstName.value.match(firstNameFormat)) {
    console.log(formDOM.firstName.value);
    firstNameMsg.textContent = "Le prénom saisi semble valide.";
    //return true;
  } else if (
    !formDOM.firstName.value.match(firstNameFormat) ||
    formDOM.firstName === "" ||
    formDOM.firstName === null
  ) {
    firstNameMsg.textContent = "Veuillez saisir un prénom valide.";
    //return false;
  }
}
function lastNameCheck() {
  let lastNameFormat = /^([a-zAZéèêëàâäöôüûïî']*?[ ]?)*$/;
  let lastNameMsg = document.querySelector("#lastNameErrorMsg");

  if (formDOM.lastName.value.match(lastNameFormat)) {
    lastNameMsg.textContent = "Le nom saisi semble valide.";
    //return true;
  } else {
    lastNameMsg.textContent = "Veuillez saisir un nom valide.";
    //return false;
  }
}

function addressCheck() {
  let addressFormat =
    ///^[0-9]*+[ ]+[a-zAZéèêëàâäöôüûïî']{1}*+?[ ]+?[a-zAZéèêëàâäöôüûïî']*$/;
    /^[0-9]$/;
  let addressMsg = document.querySelector("#addressErrorMsg");

  if (formDOM.address.value.match(addressFormat)) {
    addressMsg.textContent = "L'adresse saisie semble valide.";
    //return true;
  } else {
    addressMsg.textContent = "Veuillez saisor une adresse postale valide.";
    //return false;
  }
}

function cityCheck() {
  let cityFormat = /^[a-zAZéèêëàâäöôüûïî']*$/;
  let cityMsg = document.querySelector("#cityErrorMsg");

  if (formDOM.city.value.match(cityFormat)) {
    cityMsg.textContent = "La ville saisie semble valide.";
    //return true;
  } else {
    cityMsg.textContent = "Veuillez saisir le nom d'une ville valide.";
    //return false;
  }
}

function emailCheck() {
  let emailFormat =
    /^[\w-\+\.\_]+(\.[\w-\+\.\_]+)*@[\w-\+\.\_]+(\.[\w\+\.\_]+)*(\.[A-Za-z]{2,})$/;
  let emailMsg = document.querySelector("#emailErrorMsg");

  if (formDOM.email.value.match(emailFormat)) {
    emailMsg.textContent = "Votre adresse email est valide.";
    return true;
  } else {
    emailMsg.textContent = "Veuillez saisir une adresse email valide.";
    return false;
  }
}

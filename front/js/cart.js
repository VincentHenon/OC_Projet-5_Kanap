// Déclaration constantes pour les sélecteurs HTML.
const formDOM = document.querySelectorAll(".cart__order__form");
const orderBtn = document.querySelector("#order");
const itemDOM = document.querySelector("#cart__items");
const inputFirstName = document.querySelector("#firstName");
const inputLastName = document.querySelector("#lastName");
const inputAddress = document.querySelector("#address");
const inputCity = document.querySelector("#city");
const inputEmail = document.querySelector("#email");

// Déclaration variables pour le localstorage.
let cart = getCart();
let products = getItemId();
let orderId;

///////////////////////////////////////////////////
// Récupération du prix de chaque produit par l'API
const getPrice = async (id) => {
  urlAPI = "http://localhost:3000/api/products/";
  await fetch(urlAPI + id)
    .then((response) => response.json())
    .then(function (product) {
      priceAPI = Number(product.price);
    });
  return Number(priceAPI);
};

/////////////
// Affichage
displayItems(cart);

//////////////////////
// Formulaire checking
checkingForm();

/////////////////////////////
// Action bouton "commander!"
orderBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // on vérifie si le formulaire est correct et si le panier n'est pas vide.
  if (
    firstNameCheck() &&
    lastNameCheck() &&
    addressCheck() &&
    cityCheck() &&
    emailCheck() &&
    !isCartEmpty()
  ) {
    // si tout est ok, on crée l'objet contact à partir du formulaire et on le stocke dans le localstorage.
    contact = {
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value,
    };
    localStorage.setItem("contact", JSON.stringify(contact));

    sendData();
  } else {
    // sinon on insère un message d'erreur dans le HTML.
    if (!document.querySelector("#warningMsg")) {
      itemDOM.innerHTML = `<p id="warningMsg" style="color: rgb(251, 188, 188);">Vous ne pouvez pas passer commande car soit votre panier est vide soit le formulaire est incomplet.</p>`;
    }
  }
});

//////////////////////////////////////////////
// Récupèration du panier dans le localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cartItem"));
}

///////////////////////////////////////////////////////////
// Récupère l'id de tous les produits dans le localstorage
function getItemId() {
  if (isCartEmpty()) {
    return;
  } else {
    return cart.map((item) => item.id);
  }
}

///////////////////////////////////////////////////////////////////////////
// Affiche le panier dans l'HTML si le panier existe sinon message d'erreur
async function displayItems(cart) {
  itemDOM.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;
  if (isCartEmpty()) {
    itemDOM.innerHTML = "Le panier est vide.";
    return;
  }
  for (i = 0; i < cart.length; i++) {
    item = cart[i];
    let priceAPI = await getPrice(item.id);
    totalQuantity += Number(item.quantity);
    totalPrice += Number(item.quantity) * Number(priceAPI);
    cart[i]["price"] = priceAPI;

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
                                <p>${priceAPI} €</p>
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

  inputQuantityEvent(cart);

  deleteEvent(cart);

  document.querySelector("#totalQuantity").innerText = `${totalQuantity}`;
  document.querySelector("#totalPrice").innerText = `${totalPrice}`;
}

////////////////////////////////
// Vérifie si le panier est vide
function isCartEmpty() {
  if (getCart() === null || cart.length === 0) {
    itemDOM.innerHTML = "Votre panier est vide...";
    return true;
  } else {
    return false;
  }
}

////////////////////////////////////////////////
// Met à jour les quantités dans le localstorage
function inputQuantityEvent(cart) {
  let inputsQuantity = document.querySelectorAll(".itemQuantity");

  inputsQuantity.forEach((input) => {
    input.addEventListener("click", function (e) {
      let newQuantity = this.value;
      let getDataId = this.getAttribute("data-id");
      let getDataColor = this.getAttribute("data-color");

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

///////////////////////////////////////////////////////////////
// Gestion des boutons "supprimer" et mise à jour du locastorage
function deleteEvent() {
  let btnsDeleteDOM = document.querySelectorAll(".deleteItem");

  //on scanne toutes les boutons.
  btnsDeleteDOM.forEach((btnDeleteDOM) => {
    btnDeleteDOM.addEventListener("click", function (e) {
      let getDataId = this.getAttribute("data-id");
      let getDataColor = this.getAttribute("data-color");

      //On cherche l'item' qui ne possède pas la même Id et Color que le bouton.
      cart = cart.filter(
        (obj) => !(obj.id == getDataId && obj.color == getDataColor)
      );

      localStorage.setItem("cartItem", JSON.stringify(cart));
      location.reload(); //On réactualise la page pour afficher le changement.
    });
  });
}

/////////////////////////////
// Vérification du formulaire
function checkingForm() {
  const wholeForm = document.querySelectorAll(".cart__order__form__question");
  wholeForm.forEach((i) => {
    let input = i.childNodes[3];
    input.addEventListener("change", function (e) {
      e.preventDefault();

      const otherPattern = /[a-zA-Z\u00C0-\u00FF]/gm;
      const addressPattern = /^\d+ \D+$/gm;
      const emailPattern =
        /^[\w-\+\.\_]+(\.[\w-\+\.\_]+)*@[\w-\+\.\_]+(\.[\w\+\.\_]+)*(\.[A-Za-z]{2,})$/gm;

      firstNameCheck(otherPattern);
      lastNameCheck(otherPattern);
      addressCheck(addressPattern);
      cityCheck(otherPattern);
      emailCheck(emailPattern);
    });
  });
}

////////////////////
// Validation Prénom
function firstNameCheck(pattern) {
  if (inputFirstName.value.match(pattern) && inputFirstName.value != "") {
    inputFirstName.nextElementSibling.innerText = "";
    inputFirstName.style.border = "2px solid lightgreen";
    return true;
  } else {
    inputFirstName.nextElementSibling.innerText =
      "Veuillez entrer un prénom valide";
    inputFirstName.style.border = "2px solid red";
    return false;
  }
}

//////////////////
// Validation Nom
function lastNameCheck(pattern) {
  if (inputLastName.value.match(pattern) && inputLastName.value != "") {
    inputLastName.nextElementSibling.innerText = "";
    inputLastName.style.border = "2px solid lightgreen";
    return true;
  } else {
    inputLastName.nextElementSibling.innerText =
      "Veuillez entrer un nom valide";
    inputLastName.style.border = "2px solid red";
    return false;
  }
}

//////////////////////
// Validation Adresse
function addressCheck(pattern) {
  if (inputAddress.value.match(pattern) && inputAddress.value != "") {
    inputAddress.nextElementSibling.innerText = "";
    inputAddress.style.border = "2px solid lightgreen";
    return true;
  } else {
    inputAddress.nextElementSibling.innerText =
      "Veuillez entrer une adresse valide";
    inputAddress.style.border = "2px solid red";
    return false;
  }
}

////////////////////
// Validation Ville
function cityCheck(pattern) {
  if (inputCity.value.match(pattern) && inputCity.value != "") {
    inputCity.nextElementSibling.innerText = "";
    inputCity.style.border = "2px solid lightgreen";
    return true;
  } else {
    inputCity.nextElementSibling.innerText = "Veuillez entrer une ville valide";
    inputCity.style.border = "2px solid red";
    return false;
  }
}

///////////////////
// Validation Email
function emailCheck(pattern) {
  if (inputEmail.value.match(pattern) && inputEmail.value != "") {
    inputEmail.nextElementSibling.innerText = "";
    inputEmail.style.border = "2px solid lightgreen";
    return true;
  } else {
    inputEmail.nextElementSibling.innerText =
      "Veuillez entrer une adresse email valide";
    inputEmail.style.border = "2px solid red";
    return false;
  }
}

/////////////////////////////////////////////////////////////////
// On envoie l'objet contact et le tableau des id de chaque item.
async function sendData() {
  const sendData = await fetch("http://localhost:3000/api/products/order/", {
    method: "POST",
    body: JSON.stringify({ contact, products }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    // On récupère la réponse de l'API pour obtenir l'orderId.
    .then((response) => {
      return response.json();
    })
    .then((dataAPI) => {
      orderId = dataAPI.orderId;
    })
    .catch((err) => {
      console.error(err);
    });

  // On teste orderId et on redirige vers la page de confirmation.
  if (orderId != "") {
    location.href = "confirmation.html?id=" + orderId;
    localStorage.clear();
  }
}

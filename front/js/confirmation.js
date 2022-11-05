let orderId = new URL(window.location).searchParams.get("id");
console.log(new URL(window.location));
console.log(orderId);
document.querySelector("#orderId").innerText = orderId;

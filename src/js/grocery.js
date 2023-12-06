import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

// clear grocery
const clearGroceryBtn = document.querySelector(".clear-grocery");
clearGroceryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userConfirmation = window.confirm("Do you want to proceed?");
  if (userConfirmation) {
    setLocalStorage("grocery-list", []);
    renderGroceryList();
  }
});

function groceryListTemplate(item) {
  let brand;
  let image;
  let price;

  if (!item.food.brand) {
    brand = "";
  } else {
    brand = item.food.brand;
  }

  if (!item.food.image) {
    image = "../images/filled-basket.jpg";
  } else {
    image = item.food.image;
  }

  if (!item.price) {
    price = 0;
  } else {
    price = item.price;
  }

  return `<li class="grocery-card divider">
        <img src="${image}" 
         alt = "${item.food.label}"
        />
        <h3>${brand} ${item.food.knownAs}<h3>
        <span>Unit Price $<input class="input-price" type="number" placeholder="${price}" value="${price}" data-id="${item.food.foodId}"/></span><p>${item.GroceryQuantity}x</p>
    </li>`;
}

function renderGroceryList() {
  const groceryListItems = getLocalStorage("grocery-list");
  const element = document.querySelector(".grocery-list");
  const htmlItems = groceryListItems.map((item) => groceryListTemplate(item));
  element.innerHTML = htmlItems.join("");
}

function estimateGroceryTotalPrice() {
  const groceryListItems = getLocalStorage("grocery-list");
  const pricesInput = document.querySelectorAll(".input-price");
  pricesInput.forEach((input) => {
    const itemIndex = groceryListItems.findIndex(
      (item) => item.food.foodId === input.dataset.id
    );
    groceryListItems[itemIndex].price = parseFloat(input.value) || 0;
    // update the grocery list data
    setLocalStorage("grocery-list", groceryListItems);
  });
  // get the updated grocery list
  const updatedGroceryListItems = getLocalStorage("grocery-list");
  const totalPrice = updatedGroceryListItems.reduce((accumulator, item) => {
    const total = item.GroceryQuantity * item.price;
    return accumulator + total;
  }, 0);
  document.querySelector(".est-total-price").innerHTML = totalPrice;
}

// allow users to update price and calculate total
const calculatePriceBtn = document.querySelector(".calculate-total-price");
calculatePriceBtn.addEventListener("click", (e) => {
  e.preventDefault();
  estimateGroceryTotalPrice();
});

renderGroceryList();

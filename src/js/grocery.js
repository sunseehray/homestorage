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

// checkout grocery
const checkoutGroceryBtn = document.querySelector(".checkout-grocery");
checkoutGroceryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userConfirmation = window.confirm(
    "Checkout grocery items and add to inventory?"
  );
  // get grocery items and inventory items
  const groceryItems = getLocalStorage("grocery-list") || [];
  const inventoryItems = getLocalStorage("inventory");
  // if user says yes AND the grocery list is not empty
  if (userConfirmation && groceryItems != []) {
    //plug in the grocery items into the inventory
    groceryItems.forEach((groceryItem) => {
      const itemMatch = inventoryItems.find(
        (inventory) => inventory.food.foodId === groceryItem.food.foodId
      );
      const itemMatchIndex = inventoryItems.findIndex(
        (inventory) => inventory.food.foodId === groceryItem.food.foodId
      );
      //if the item is found, update the inventory quantity by adding the grocery quantity
      if (itemMatch) {
        inventoryItems[itemMatchIndex].InventoryQuantity +=
          groceryItem.GroceryQuantity;
        setLocalStorage("inventory", inventoryItems);
      } else {
        //if item is not found, groceryItem is added to the inventory with its inventory quantity as the grocery quantity
        groceryItem.InventoryQuantity = groceryItem.GroceryQuantity;
        inventoryItems.push(groceryItem);
        setLocalStorage("inventory", inventoryItems);
      }
    });

    // empty grocery list
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
  const groceryListItems = getLocalStorage("grocery-list") || [];
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

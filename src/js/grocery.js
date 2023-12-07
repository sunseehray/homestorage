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
// prevent default in form submission
const groceryForm = document.querySelector(".grocery-form");
groceryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  estimateGroceryTotalPrice();
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
          inventoryItems[itemMatchIndex].price = groceryItem.price;
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

  return `<li class="grocery-card">
    <h3 class="card__name divider">${brand} ${item.food.knownAs.toUpperCase()}</h3>
    <div class="container">
      <img src="${image}" 
      alt = "${item.food.label}"
      />          
      <span class="removeFromGrocery btneffect item-detail__add" data-id="${
        item.food.foodId
      }">❌</span>
    </div>

      <div class="card__price">
        <span class="card__price__amount">$<input class="input-price" type="number" placeholder="${price}" value="${price}" data-id="${
    item.food.foodId
  }"/></span>
      </div>
      <div class="card__quantity">
        <span class="decreaseGrocery btneffect" data-id="${
          item.food.foodId
        }">➖</span> <span class="grocery__quantity__value">${
    item.GroceryQuantity
  } </span><span class="increaseGrocery btneffect" data-id="${
    item.food.foodId
  }">➕</span>
      </div>

    </li>`;
}

function renderGroceryList() {
  const groceryListItems = getLocalStorage("grocery-list") || [];
  const element = document.querySelector(".grocery-list");
  const htmlItems = groceryListItems.map((item) => groceryListTemplate(item));
  element.innerHTML = htmlItems.join("");

  // add event listener to x button
  const removeButtons = document.querySelectorAll(".removeFromGrocery");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () =>
      removeFromGrocery(button.dataset.id)
    );
  });

  // decrease grocery item quantity
  const decreaseQtyBtn = document.querySelectorAll(".decreaseGrocery");
  decreaseQtyBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      decreaseQty(button.dataset.id);
      estimateGroceryTotalPrice();
    });
  });
  // increase grocery item qty
  const increaseQtyBtn = document.querySelectorAll(".increaseGrocery");
  increaseQtyBtn.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      increaseQty(button.dataset.id);
      estimateGroceryTotalPrice();
    });
  });
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

function decreaseQty(key) {
  const groceryItems = getLocalStorage("grocery-list");
  const foundItemIndex = groceryItems.findIndex(
    (item) => item.food.foodId === key
  );
  const quantity = groceryItems[foundItemIndex].GroceryQuantity;
  if (quantity > 0) {
    groceryItems[foundItemIndex].GroceryQuantity -= 1;
  } else {
    groceryItems[foundItemIndex].InventoryQuantity = 0;
  }
  setLocalStorage("grocery-list", groceryItems);
  renderGroceryList();
}

function increaseQty(key) {
  const groceryItems = getLocalStorage("grocery-list");
  const foundItemIndex = groceryItems.findIndex(
    (item) => item.food.foodId === key
  );
  groceryItems[foundItemIndex].GroceryQuantity += 1;
  setLocalStorage("grocery-list", groceryItems);
  renderGroceryList();
}

function removeFromGrocery(key) {
  // update the cart by removing the specified product
  const groceryItems = getLocalStorage("grocery-list");

  const udpatedGroceryItems = groceryItems.filter(
    (product) => product.food.foodId != key
  );
  setLocalStorage("grocery-list", udpatedGroceryItems);

  renderGroceryList();
}

renderGroceryList();

import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
} from "./utils.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

// clear inventory
const clearInventoryBtn = document.querySelector(".clear-inventory");
clearInventoryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userConfirmation = window.confirm("Do you want to proceed?");
  if (userConfirmation) {
    setLocalStorage("inventory", []);
    renderInventory();
  }
});

function renderInventory() {
  const inventoryItems = getLocalStorage("inventory") || [];
  const htmlItems = inventoryItems.map((item) => inventoryTemplate(item));
  document.querySelector(".inventory-list").innerHTML = htmlItems.join("");
  // add event listener to x button
  const removeButtons = document.querySelectorAll(".removeFromInventory");
  removeButtons.forEach((button) => {
    button.addEventListener("click", () =>
      removeFromInventory(button.dataset.id)
    );
  });
  // allow users to add to grocery list
  const addToGroceryButtons = document.querySelectorAll(".addToGrocery");
  addToGroceryButtons.forEach((button) => {
    button.addEventListener("click", () => addToGrocery(button.dataset.id));
  });
  // allow users to increase inventory
  const increaseInventoryBtn = document.querySelectorAll(".increaseInventory");
  increaseInventoryBtn.forEach((button) => {
    button.addEventListener("click", () => increaseStock(button.dataset.id));
  });
  // allow users to decrease inventory
  const decreaseInventoryBtn = document.querySelectorAll(".decreaseInventory");
  decreaseInventoryBtn.forEach((button) => {
    button.addEventListener("click", () => decreaseStock(button.dataset.id));
  });
}

function inventoryTemplate(item) {
  let image;
  let serving;

  if (!item.food.image) {
    image = "../images/filled-basket.jpg";
  } else {
    image = item.food.image;
  }
  
  if (!item.food.servingSizes) {
    serving = "";
  } else {
    serving = `<tr>
        <th>Serving Size</th>
        <td>${item.food.servingSizes[0].quantity} ${item.food.servingSizes[0].label}</td>
    </tr>
    `;
  }

  const newItem = `<li class="inventory-card">
  <h3 class="card__name divider">${item.food.knownAs.toUpperCase()}</h3>
  <div class="container">
    <img
      src="${image}"
      alt="${item.food.label}"
    />
    <div class="item-detail__add">
      <p class="inventory-card__quantity"><button class="addToGrocery btneffect" data-id="${
        item.food.foodId
      }">📃</button><button class="removeFromInventory btneffect" data-id="${
        item.food.foodId
      }">❌</button></p>
    </div>
  </div>
  <p class="inventory-card__quantity"><span class="decreaseInventory btneffect" data-id="${
    item.food.foodId
  }">➖</span> ${
    item.InventoryQuantity
  } <span class="increaseInventory btneffect" data-id="${
    item.food.foodId
  }">➕</span> in stock</p>
  <table>
        <tr>
            <th>Calories</th>
            <td>${item.food.nutrients.ENERC_KCAL.toFixed(0)}</td>
        </tr>
        ${serving}
        <tr>
            <th>Carbs</th>
            <td>${item.food.nutrients.CHOCDF.toFixed(1)} g</td>
        </tr>
        <tr>
            <th>Fat</th>
            <td>${item.food.nutrients.FAT.toFixed(1)} g</td>
        </tr>
        <tr>
            <th>Protein</th>
            <td>${item.food.nutrients.PROCNT.toFixed(1)} g</td>
        </tr>
        <tr>
            <th>Fiber</th>
            <td>${item.food.nutrients.FIBTG.toFixed(1)} g</td>
        </tr>
        </table>  
</li>`;

  return newItem;
}

function addToGrocery(key) {
  // load up grocery Items
  const groceryItems = getLocalStorage("grocery-list") || [];
  // check first if the item is found in the grocery already, save the item and index for updating local storage
  const foundItem = groceryItems.find((item) => item.food.foodId === key);
  const foundItemIndex = groceryItems.findIndex(
    (item) => item.food.foodId === key
  );
  if (foundItem) {
    groceryItems[foundItemIndex].GroceryQuantity += 1;
    setLocalStorage("grocery-list", groceryItems);
  } else {
    // add a quantity property to the product
    const inventoryItems = getLocalStorage("inventory");
    const itemToAdd = inventoryItems.find((item) => item.food.foodId === key);
    itemToAdd.GroceryQuantity = 1;
    // add this product to the grocery items array
    groceryItems.push(itemToAdd);
    // update the local storage with this array including the new product
    setLocalStorage("grocery-list", groceryItems);
  }
}

function removeFromInventory(key) {
  // update the cart by removing the specified product
  const inventoryItems = getLocalStorage("inventory");

  const updatedInventoryItems = inventoryItems.filter(
    (product) => product.food.foodId != key
  );
  setLocalStorage("inventory", updatedInventoryItems);

  renderInventory();
}

function increaseStock(key) {
  const inventoryItems = getLocalStorage("inventory");
  const foundItemIndex = inventoryItems.findIndex(
    (item) => item.food.foodId === key
  );
  inventoryItems[foundItemIndex].InventoryQuantity += 1;
  setLocalStorage("inventory", inventoryItems);
  renderInventory();
}

function decreaseStock(key) {
  const inventoryItems = getLocalStorage("inventory");
  const foundItemIndex = inventoryItems.findIndex(
    (item) => item.food.foodId === key
  );
  const quantity = inventoryItems[foundItemIndex].InventoryQuantity;
  if (quantity > 0) {
    inventoryItems[foundItemIndex].InventoryQuantity -= 1;
  } else {
    inventoryItems[foundItemIndex].InventoryQuantity = 0;
  }
  setLocalStorage("inventory", inventoryItems);
  renderInventory();
}

renderInventory();

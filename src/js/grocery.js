import { loadHeaderFooter, getLocalStorage, setLocalStorage } from "./utils.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

function groceryListTemplate(item) {
  let brand;
  let image;

  if (!item.food.brand) {
    brand = "generic";
  } else {
    brand = item.food.brand;
  }

  if (!item.food.image) {
    image = "../images/filled-basket.jpg";
  } else {
    image = item.food.image;
  }

  return `<li class="divider">
        <img src="${image}" 
         alt = "${item.food.label}"
        />
        <h3>${brand} ${item.food.knownAs}<h3>
        <span>$<input class="input-price" type="number" placeholder="Enter price" data-id="${item.food.foodId}"/></span><p>${item.GroceryQuantity}x</p>
    </li>`;
}

function renderGroceryList() {
  const groceryListItems = getLocalStorage("grocery-list");
  const element = document.querySelector(".grocery-list");
  const htmlItems = groceryListItems.map((item) => groceryListTemplate(item));
  element.innerHTML = htmlItems.join("");

  // allow users to print grocery list
  //  const printGroceryList = document.querySelector("#print-glist");
  //  printGroceryList.addEventListener("click", () => {
  //    alert("Hello");
  //  });

    // allow users to update price and calculate total
    const calculatePriceBtn = document.querySelector(".calculate-total-price");
    console.log(calculatePriceBtn);
    calculatePriceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      estimateGroceryTotalPrice();
    });
  
}

function estimateGroceryTotalPrice() {
  const groceryListItems = getLocalStorage("grocery-list");
  const pricesInput = document.querySelectorAll(".input-price");
  pricesInput.forEach((input) => {
      const itemIndex = groceryListItems.findIndex((item) => item.food.foodId === input.dataset.id);
      if (itemIndex) {
        groceryListItems[itemIndex].price = input.value;
        setLocalStorage("grocery-list", groceryListItems);
      }
    });
  const updatedGroceryListItems = getLocalStorage("grocery-list");
  const totalPrice = updatedGroceryListItems.reduce((item) => item.GroceryQuantity * item.price);
  document.querySelector(".est-total-price").innerHTML = totalPrice;
}

renderGroceryList();
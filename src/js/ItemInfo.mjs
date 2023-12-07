//this helps generate search results
import { getLocalStorage, setLocalStorage, changeCart } from "./utils.mjs";

function itemInfoTemplate(item) {
    let brand;
    let image;
    let serving;
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
    if (!item.food.servingSizes) {
        serving = "";
    } else {
        serving = `<tr>
            <th>Serving Size</th>
            <td>${item.food.servingSizes[0].quantity} ${item.food.servingSizes[0].label}</td>
        </tr>
        `;
    }

    return `<section class="item-detail">
        <h3 class="divider">${item.food.knownAs.toUpperCase()}</h3>
        <div class="container">
        <img
            src="${image}"
            alt="${item.food.label}"
        />
        <div class="item-detail__add">
            <button class="btneffect" id="addToInventory" data-id="${item.food.foodId}">📦</button>
            <button class="btneffect" id="addToGroceryList" data-id="${item.food.foodId}">🧺</button>
        </div>
        </div>
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
        </section>`;
}

export default class ItemInfo {
    constructor(foodItem) {
        this.foodId = foodItem.food.foodId;
        this.food = foodItem;
    }

    async init() {
        // removed await since dataSource will be from localstorage "search-results"
        // this.food = findProductById(this.dataSource, this.foodId);
        this.renderSearchResultDetail(".product-detail");

        document
            .getElementById("addToInventory")
            .addEventListener("click", this.addToInventory.bind(this));

        document
            .getElementById("addToGroceryList")
            .addEventListener("click", this.addToGroceryList.bind(this));

        document
            .getElementById("addToInventory")
            .addEventListener("click", this.wiggleInventory.bind(this));

        document
            .getElementById("addToGroceryList")
            .addEventListener("click", this.wiggleBasket.bind(this));

    }

    addToInventory() {
        const inventory = getLocalStorage("inventory") || [];
        const searchId = this.foodId;
        const foundItem = inventory.find((item) => item.food.foodId === searchId);
        const foundItemIndex = inventory.findIndex((item) => item.food.foodId === searchId);
        if (foundItem) {
            inventory[foundItemIndex].InventoryQuantity += 1;
            setLocalStorage("inventory", inventory);
        } else {
            this.food.InventoryQuantity = 1;
            inventory.push(this.food);
            setLocalStorage("inventory", inventory);
        }
    }

    addToGroceryList() {
        const groceryList = getLocalStorage("grocery-list") || [];
        const searchId = this.foodId;
        const foundItem = groceryList.find((item) => item.food.foodId === searchId);
        const foundItemIndex = groceryList.findIndex((item) => item.food.foodId === searchId);
        if (!foundItem) {
            this.food.GroceryQuantity = 1;
            groceryList.push(this.food);
            setLocalStorage("grocery-list", groceryList);
            changeCart();
        } else {
            // if item is already in grocery list, increase quantity instead
            groceryList[foundItemIndex].GroceryQuantity += 1;
            setLocalStorage("grocery-list", groceryList);
        }
    }

    renderSearchResultDetail(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            itemInfoTemplate(this.food)
        );
    }

    wiggleInventory() {
        const element = document.querySelector(".inventory-icon");
        this.wiggle(element);
    }

    wiggleBasket() {        
        const element = document.querySelector(".cart-icon");
        this.wiggle(element);
    }

    wiggle(element) {
        // Remove animation to reset it
        element.style.animation = "none";
        // Trigger a reflow to ensure the animation restarts
        void element.offsetWidth;
        element.style.animation = "wiggleAnimation 1s 1";

    }
}

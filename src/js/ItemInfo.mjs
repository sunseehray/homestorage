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
        serving = `<p>Serving Size: ${item.food.servingSizes[0].quantity} ${item.food.servingSizes[0].label}</p>`;
    }

    return `<section class="item-detail">
        <img
            src="${image}"
            alt="${item.food.label}"
        />
        <h3>${item.food.knownAs}</h3>
        <p class="item-card-calories">Calories: ${item.food.nutrients.ENERC_KCAL.toFixed(0)}</p>
        ${serving}
        <div class="item-detail__add">
            <button id="addToInventory" data-id="${item.food.foodId}">Add to Inventory</button>
            <button id="addToGroceryList" data-id="${item.food.foodId}">Add to Grocery List</button>
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

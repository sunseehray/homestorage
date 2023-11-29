//this helps generate search results
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function searchResultDetailTemplate(item) {
    return `<section class="item-detail">
        <h3>${item.food.brand}</h3>
        <h2 class="divider">${item.food.label}</h2>
        <img
            class="divider"
            src="${item.food.image}"
            alt="${item.food.label}"
        />
        <p class="item-card-calories">Calories: ${item.food.nutrients.ENERC_KCAL}</p>
        <div class="item-detail__add">
            <button id="addToInventory" data-id="${item.food.foodId}">Add to Inventory</button>
            <button id="addToGroceryList" data-id="${item.food.foodId}">Add to Grocery List</button>
        </section>`;
}

export default class SearchResult {
    constructor(foodItem) {
        this.foodId = foodItem.food.foodId;
        this.food = foodItem;
    }

    async init() {
        // removed await since dataSource will be from localstorage "search-results"
        // this.food = findProductById(this.dataSource, this.foodId);
        this.renderSearchResultDetail("main");

        document
            .getElementById("addToInventory")
            .addEventListener("click", this.addToInventory.bind(this));

        document
            .getElementById("addToGroceryList")
            .addEventListener("click", this.addToGroceryList.bind(this));
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
        if (!foundItem) {
            groceryList.push(this.food);
            setLocalStorage("grocery-list", groceryList);
        }
    }

    renderSearchResultDetail(selector) {
        const element = document.querySelector(selector);
        element.insertAdjacentHTML(
            "afterBegin",
            searchResultDetailTemplate(this.food)
        );
    }
}

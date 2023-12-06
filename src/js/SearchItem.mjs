import { renderWithTemplate, setLocalStorage, getLocalStorage } from "./utils.mjs";

function searchResultTemplate(item) {
    let image;
    if (!item.food.image) {
      image = "../images/filled-basket.jpg";
    } else {
      image = item.food.image;
    }
    let brand;
    if (!item.food.brand) {
      brand = "";
    } else {
      brand = item.food.brand;
    }
  
    const newItem = `<li class="result-card divider">
          <a href="../product/index.html" class="result-card__image see-detail" id="${item.food.foodId}" data-id="${item.food.foodId}">
              <img
                  src="${image}"
                  alt="${brand}${item.food.label}"
              />
              <h2 class="result-card__name">${brand} ${item.food.knownAs}</h2>
          </a>
          <p class="result-card__calories">Calories: ${item.food.nutrients.ENERC_KCAL}</p>
          </li>`;
  
    return newItem;
  }

  function saveId(selector) {
    const id = selector.getAttribute("data-id");
    selector.addEventListener("click", () => {
      setLocalStorage("food-id", id);
    });
  }

  function saveIndex(selector) {
    const id = selector.getAttribute("data-id");
    const searchResults = getLocalStorage("search-results");
    selector.addEventListener("click", () => {
      const foundItemIndex = searchResults.findIndex((item) => item.food.foodId === id);
      setLocalStorage("food-index", foundItemIndex);
    });
  }

export default class SearchItem {
  constructor(foodId, dataSource, listElement) {
      this.foodId = foodId;
      this.food = {};
      this.dataSource = dataSource;
      this.listElement = listElement
  }

  async init() {
    // Get the specific food from the dataSource
    this.food = this.dataSource.find((item) => item.food.foodId === this.foodId);
    renderWithTemplate(searchResultTemplate(this.food), this.listElement, this.food, "beforeend");
    const selector = document.querySelector(`#${this.foodId}`);
    saveId(selector);
    saveIndex(selector);
  }
}


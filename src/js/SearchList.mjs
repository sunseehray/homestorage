import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function searchResultTemplate(item) {
    let image;
    if (!item.food.image) {
      image = "../images/filled-basket.jpg";
    } else {
      image = item.food.image;
    }
    let brand;
    if (!item.food.brand) {
      brand = "Generic";
    } else {
      brand = item.food.brand;
    }
  
    const newItem = `<li class="result-card divider">
          <a href="../product/index.html" class="result-card__image see-detail" id="${item.food.foodId}" data-id="${item.food.foodId}">
              <img
                  src="${image}"
                  alt="${brand}${item.food.label}"
              />
              <h2 class="result-card__name">${brand} ${item.food.label}</h2>
          </a>
          <p class="result-card__calories">Calories: ${item.food.nutrients.ENERC_KCAL}</p>
          </li>`;
  
    return newItem;
  }


export default class ProductListing {
  constructor(listElement, position) {
      this.listElement = listElement;
      this.position = position;
  }

  async init() {
    // Get the list of results
    const list = getLocalStorage("search-results");
    // render the list
    renderListWithTemplate(searchResultTemplate, this.listElement, list);
  }
}

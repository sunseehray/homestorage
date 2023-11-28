import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
  <a href="/product_pages/index.html?product=${product.food.foodId}">
  <img
    src="${product.Images.PrimaryMedium}"
    alt="Image of ${product.Name}"
  />
  <h3 class="card__brand">${product.Brand.Name}</h3>
  <h2 class="card__name">${product.Name}</h2>
  <p class="product-card__price">$${product.FinalPrice}</p></a>
  <p class="product-card_discount">Discount: ${Math.round((parseInt(product.FinalPrice) % parseInt(product.ListPrice)) * 100)}%</p></a>
</li>`;
}


export default class ProductListing {
  constructor(term, dataSource, listElement, position) {
      this.term = term;
      this.dataSource = dataSource;
      this.listElement = listElement;
      this.position = position;
  }

  async init() {
    // our dataSource will return a Promise...so we can use await to resolve it.
    const list = await this.dataSource.getData(this.term);
    // render the list
    renderListWithTemplate(productCardTemplate, this.listElement, list);
    //set the title to the current category
    document.querySelector(".title").innerHTML = this.term;
  }
}

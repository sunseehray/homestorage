import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function productDetailsTemplate(product) {
  return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img
      class="divider"
      src="${product.Images.PrimaryLarge}"
      alt="${product.NameWithoutBrand}"
    />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p>Discount: ${Math.round((parseInt(product.FinalPrice) % parseInt(product.ListPrice)) * 100)}%</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">
    ${product.DescriptionHtmlSimple}
    </p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
    <button id="addToWishlist" data-id="${product.Id}">Add to Wishlist 💖</button>

    </section>`;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }
  async init() {
    // use our datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // once we have the product details we can render out the HTML
    this.renderProductDetails("main");
    // once the HTML is rendered we can add a listener to Add to Cart button
    // Notice the .bind(this). Our callback will not work if we don't include that line. Review the readings from this week on 'this' to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addToCart.bind(this));

    document
      .getElementById("addToWishlist")
      .addEventListener("click", this.addToWishList.bind(this));

  }

  addToCart() {
    // save localStorage contents into an array, cartItems
    const cartItems = getLocalStorage("so-cart") || [];
    // check first if the item is found in the cart already, save the item and index for updating local storage
    const searchId = this.product.Id;
    const foundItem = cartItems.find((item) => item.Id === searchId);
    const foundItemIndex = cartItems.findIndex((item) => item.Id === searchId);
    if (foundItem) {
       cartItems[foundItemIndex].CartQuantity += 1;
       setLocalStorage("so-cart", cartItems);
    } else {
      // add a CartQuantity property to the product
      this.product.CartQuantity = 1;
      // add this product to the cartItems array
      cartItems.push(this.product);
      // update the local storage with this array including the new product
      setLocalStorage("so-cart", cartItems); 
    }
    
    }

    addToWishList() {
      const wishlist = getLocalStorage("wishlist") || [];

      const searchId = this.product.Id;
      const foundItem = wishlist.find((item) => item.Id == searchId);
      if (!foundItem) {
       wishlist.push(this.product);
       setLocalStorage("wishlist", wishlist); 
      }
    }

  renderProductDetails(selector) {
    const element = document.querySelector(selector);
    element.insertAdjacentHTML(
      "afterBegin",
      productDetailsTemplate(this.product)
    );
  }
}
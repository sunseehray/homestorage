import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getTerm } from "./search";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

// const category = getParam("category");
// const dataSource = new ExternalServices();
// const element = document.querySelector(".product-list");
// const listing = new ProductList(category, dataSource, element);

// listing.init();

const dataSource = new ExternalServices();
const term = getTerm();
const results = dataSource.findProductBySearchTerm(term);
console.log(results);


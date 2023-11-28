import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

const dataSource = new ExternalServices();

document.querySelector("#search-button").addEventListener("click", (e) => {
  e.preventDefault();
  dataSource.findProductBySearchTerm();
});

//console.log(.PromiseResult);

import { getLocalStorage, loadHeaderFooter, setLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

document.querySelector("#search-button").addEventListener("click", () => {
    const term = document.querySelector("#search-term").value;
    setLocalStorage("searchTerm", term);
});


const dataSource = new ExternalServices();
const queryTerm = getLocalStorage("searchTerm") || "milk";
const json = await dataSource.findProductBySearchTerm(queryTerm);
console.log(json);
//console.log(.PromiseResult);


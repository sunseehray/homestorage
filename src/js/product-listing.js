import { loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

document.querySelector("#search-button").addEventListener("click", async (e) => {
    e.preventDefault();
    const dataSource = new ExternalServices();
    const term = document.querySelector("#search-term").value;
    const json = await dataSource.findProductBySearchTerm(term);
    console.clear();
    console.log(json);
    console.log(json.hints[0]);
});

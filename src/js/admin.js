import { loadHeaderFooter } from "./utils.mjs";
import Admin from "./admin.mjs";

const headerPath = "../partials/header.html";
const footerPath = "../partials/footer.html";
loadHeaderFooter(headerPath, footerPath);

const myAdmin = new Admin("main");
myAdmin.showLogin();



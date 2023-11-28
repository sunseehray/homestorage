// this is the script for the search page
import { setLocalStorage } from "./utils.mjs";

const element = document.querySelector("search-term");

element.addEventListener("click", (e) => {
  e.preventDefault();
  const searchTerm = element.value;
  setLocalStorage("search", searchTerm);
});

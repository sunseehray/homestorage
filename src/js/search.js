import { setClick } from "./utils.mjs"

export async function getTerm() {
  // get the button element that submits for the search
  const searchBtn = document.querySelector("#search-button");
  // set the event listener for click to this button
  setClick(searchBtn, extractTerm());
}

// callback function when the search term button is submitted
async function extractTerm() {
  const searchInput = document.querySelector("#search-term");
  const searchValue = await searchInput.value;
  return searchValue;
}

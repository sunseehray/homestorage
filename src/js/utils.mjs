// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  //clear parent element if clear === true  
  if (clear === true) {
      parentElement.innerHTML = "";
    }  
    const htmlStrings = list.map(templateFn);
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
   

}
export function renderWithTemplate(template, parentElement, data, position = "afterbegin", callback) {
  parentElement.insertAdjacentHTML(position, template);

  if (callback) {
      callback(data);
    }     
}

export async function loadTemplate(path) {

  const html = await fetch(path);
  const template = await html.text();
  return template;
}

export async function loadHeaderFooter(headerPath, footerPath) {
  // load the header and footer templates in from partials
  const headerTemplate = await loadTemplate(headerPath);
  const footerTemplate = await loadTemplate(footerPath);

  //grab the header and footer elements out of the DOM
  const headerId = document.querySelector("#main-header");
  const footerId = document.querySelector("#main-footer");

  // render the header and footer
  renderWithTemplate(headerTemplate, headerId);
  renderWithTemplate(footerTemplate, footerId);
  changeCart();
}

export function changeCart() {
  const cartIcon = document.querySelector(".cart-icon");
  const gList = getLocalStorage("grocery-list");

  if (gList.length > 0) {
      cartIcon.setAttribute("src", "../images/filled-basket.jpg");
  } else {
    cartIcon.setAttribute("src", "../images/empty-basket.jpg")
  }
}

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  // setTimeout(function () {
  //   main.removeChild(alert);
  // }, duration);
}

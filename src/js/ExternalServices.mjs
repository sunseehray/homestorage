const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  const jsonResponse = res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "services error", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    //this.category = category;
    //this.path = `../json/${this.category}.json`;
  }

  async findProductById(id) {
    const response = await fetch(baseURL + `${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async getSearchProducts() {
    const term = document.getElementById("search-term").value;
    const url = baseURL + term;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "eda7c27a9amsh1622cc4957f1c19p14e87fjsnb72c0de78d03",
        "X-RapidAPI-Host": "edamam-food-and-grocery-database.p.rapidapi.com"
      }
    };
    
    try {
      const response = await fetch(url, options);
      const result = await convertToJson(response);
      return result.hints;
    } catch (error) {
      throw (error.message);
      
    }
  }

  // async checkout(payload) {
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //     // timeout: 120000,
  //   };
  //   return await fetch("https://wdd330-backend.onrender.com:3000/checkout/", options).then(convertToJson);
  // }
}
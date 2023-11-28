//this helps generate search results
import ExternalServices from "./ExternalServices.mjs";
import { getLocalStorage } from "./utils.mjs";

export default class SearchResult {
    constructor(foodId, dataSource) {
        this.foodId = foodId;
        this.food = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.food = await this.dataSource.findProductBySearchTerm();
    }
}
async function GenerateResults() {
    const dataSource = new ExternalServices;
    dataSource.findProductBySearchTerm()
}


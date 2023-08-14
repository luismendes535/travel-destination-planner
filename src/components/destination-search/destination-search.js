import { API_URL } from "../../api/constants";
import "../../api/types";

class DestinationSearch extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
    <style>input[type="search"] {
      width: 100%;
      height: 36px;
      padding: 8px;
      border: none;
      border-bottom: 2px solid #2196F3;
      border-radius: 0;
      background-color: #2196F3;
      background: url('../assets/icons/parasol-icon.png') left center no-repeat,
                  url('../assets/icons/mg-icon.png') right center no-repeat;
      background-size: 20px 20px, 20px 20px;
      padding-left: 30px;
      padding-right: 30px;
      outline: none;
      transition: border-bottom 0.3s ease;
    }

    input[type="search"]:focus {
      border-bottom: 3px solid #1976D2;
    }
  
    ul.result-list {
      display: none;
      padding: 10px 30px;
      background-color: #E3F2FD;
      max-width: 100%;
      margin-top: 8px;
      list-style-type: none;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    ul.result-list li {
      padding: 8px 30px;
      display: flex;
      align-items: center;
      background: url('../assets/icons/pin-icon.png');
      background-repeat: no-repeat;
      background-size: 20px 20px;
      background-position: left;
      cursor: Pointer;
      margin: 4px 0;
    }
    ul.result-list li:hover {
      background-color: #BBDEFB;
    }</style>
  `;

    // Input field and autocomplete result list
    this.input = document.createElement("input");
    this.input.type = "search";
    this.input.setAttribute("placeholder", "Search destinations...");

    // Error message element
    this.errorMsg = document.createElement("p");
    this.errorMsg.classList.add("error-message");
    this.errorMsg.style.color = "red";

    this.resultList = document.createElement("ul");
    this.resultList.classList.add("result-list");

    // Append the input field and result list to the shadow DOM
    this.shadowRoot.appendChild(this.input);
    this.shadowRoot.appendChild(this.errorMsg);
    this.shadowRoot.appendChild(this.resultList);

    this.debounceTime = 200;
  }

  connectedCallback() {
    // Add event listeners when the component is connected to the DOM
    this.input.addEventListener("input", this.onInput.bind(this));
    this.resultList.addEventListener(
      "click",
      this.onResultItemClick.bind(this)
    );
  }

  disconnectedCallback() {
    // Remove event listeners when the component is disconnected from the DOM
    this.input.removeEventListener("input", this.onInput.bind(this));
    this.resultList.removeEventListener(
      "click",
      this.onResultItemClick.bind(this)
    );
  }

  async onInput(event) {
    const keyword = event.target.value.trim();

    this.currentInputText = keyword;

    this.clearResultList();

    // Validate the input length
    if (keyword.length < 3) {
      this.showErrorMessage("Search term must be at least 3 characters.");
      return;
    }

    this.hideErrorMessage();

    this.debounceTimeout = setTimeout(async () => {
      this.fetchData(keyword);
    }, this.debounceTime);
  }

  /**
   * Fetches data from the API based on the provided keyword.
   * @param {string} keyword - The search keyword.
   * @returns {ApiResponseCategory[]} The API response data.
   */
  async fetchData(keyword) {
    try {
      const response = await fetch(`${API_URL}${keyword}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the API.");
      }
      const data = await response.json();

      this.clearResultList();
      this.displayResults(data);

      return data;
    } catch (error) {
      this.showErrorMessage("Failed to fetch data. Please try again.");
    }
  }

  /**
   * Displays autocomplete results based on the API response.
   * @param {ApiResponseCategory[]} results - The API response with categories and items.
   */
  displayResults(results) {
    // Early return if there are no results
    if (results.length === 0) {
      return;
    }

    this.resultList.style.display = "block";

    const { category, items } = results[0] || {};

    // Create a title element for the category
    const title = document.createElement("h4");
    title.textContent = category;
    this.resultList.appendChild(title);

    items.forEach((result) => {
      const listItem = document.createElement("li");

      const resultName = result.name;
      const currentInputText = this.currentInputText;
      const highlightedText = this.getHighlightedText(
        resultName,
        currentInputText
      );

      if (highlightedText) {
        listItem.innerHTML = highlightedText;
      } else {
        listItem.textContent = resultName;
      }

      this.resultList.appendChild(listItem);
    });
  }

  /**
   * Highlights the matching part of the text.
   * @param {string} text - The original text.
   * @param {string} query - The query text to highlight.
   * @returns {string} The text with highlighted matches.
   */
  getHighlightedText(text, query) {
    const indexOfMatch = text.toLowerCase().indexOf(query.toLowerCase());

    if (indexOfMatch !== -1) {
      const beforeMatch = text.substring(0, indexOfMatch);
      const matchedText = text.substring(
        indexOfMatch,
        indexOfMatch + query.length
      );
      const afterMatch = text.substring(indexOfMatch + query.length);

      return `${beforeMatch}<b>${matchedText}</b>${afterMatch}`;
    }

    return null;
  }

  clearResultList() {
    while (this.resultList.firstChild) {
      this.resultList.removeChild(this.resultList.firstChild);
    }
    this.resultList.style.display = "none";
  }

  /**
   * Handles the click event on a result item.
   * @param {Event} event - The click event.
   */
  onResultItemClick(event) {
    // Early return if target isn't a list item tag or a bold tag
    if (!["LI", "B"].includes(event.target.tagName)) {
      return;
    }

    // Transfer the value from the clicked result item to the input field
    const selectedValue = event.target.textContent;
    this.input.value = selectedValue;
    this.clearResultList();

    const destinationTravelInfo = document.querySelector(
      "destination-travel-info"
    );
    destinationTravelInfo.dispatchEvent(
      new CustomEvent("destination-selected", { detail: selectedValue })
    );
  }

  /**
   * Shows an error message.
   * @param {string} message - The error message to display.
   */
  showErrorMessage(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = "block";
  }

  hideErrorMessage() {
    this.errorMsg.textContent = "";
    this.errorMsg.style.display = "none";
  }
}

customElements.define("destination-search", DestinationSearch);

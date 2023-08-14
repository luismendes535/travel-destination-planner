class TravelDate extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
    <style>
      /* Your existing styles */

      /* ... */

      input[type="date"] {
        padding: 12px; /* Increase padding for larger input */
        border: 1px solid #ccc;
        border-radius: 4px;
        background: url('../assets/icons/calendar-icon.png') left 10px no-repeat; /* Adjust icon spacing */
        background-size: 20px 20px;
        box-sizing: border-box; /* Include padding and border in width calculation */
      }

    </style>
  `;

    // Create the input field for the date
    this.input = document.createElement("input");
    this.input.type = "date";

    // Create an error message element (hidden by default)
    this.errorMsg = document.createElement("p");
    this.errorMsg.classList.add("error-message");
    this.errorMsg.style.color = "red"; // Customize the error message color
    this.errorMsg.style.display = "none";

    // Append the input field and error message to the shadow DOM
    this.shadowRoot.appendChild(this.input);
    this.shadowRoot.appendChild(this.errorMsg);
  }

  connectedCallback() {
    // Add event listeners when the component is connected to the DOM
    this.input.addEventListener("change", this.onDateChange.bind(this));
  }

  disconnectedCallback() {
    // Remove event listeners when the component is disconnected from the DOM
    this.input.removeEventListener("change", this.onDateChange.bind(this));
  }

  onDateChange(event) {
    const chosenDate = new Date(event.target.value);

    // Validate dates
    if (!this.isValidDate(chosenDate)) {
      this.showErrorMessage(
        "Invalid travel date. Please choose a date within the allowed range."
      );
      return;
    }

    this.hideErrorMessage();

    const formattedDate = `${chosenDate
      .getDate()
      .toString()
      .padStart(2, "0")}.${(chosenDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${chosenDate.getFullYear()}`;

    document
      .querySelector("destination-travel-info")
      .dispatchEvent(
        new CustomEvent("date-selected", { detail: formattedDate })
      );
  }

  isValidDate(date) {
    const currentDate = new Date();
    const maxAllowedDate = new Date(currentDate.getFullYear() + 2, 11, 31); // Two years from now
    return date >= currentDate && date <= maxAllowedDate;
  }

  showErrorMessage(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = "block";
  }

  hideErrorMessage() {
    this.errorMsg.textContent = "";
    this.errorMsg.style.display = "none";
  }
}

customElements.define("travel-date", TravelDate);

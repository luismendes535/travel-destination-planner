class DestinationTravelInfo extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open", delegatesFocus: true });

    this.shadowRoot.innerHTML = `
      <style>
        .display {
          margin-bottom: 8px;
        }
      </style>
      <div>
        <div class="display destination-display">Selected Destination:</div>
        <div class="display date-display">Selected Travel Date:</div>
      </div>
    `;
  }

  connectedCallback() {
    // Add event listeners when the component is connected to the DOM
    this.addEventListener(
      "destination-selected",
      this.updateDestinationDisplay.bind(this)
    );
    this.addEventListener("date-selected", this.updateDateDisplay.bind(this));
  }

  disconnectedCallback() {
    // Remove event listeners when the component is disconnected from the DOM
    this.removeEventListener(
      "destination-selected",
      this.updateDestinationDisplay.bind(this)
    );
    this.removeEventListener(
      "date-selected",
      this.updateDateDisplay.bind(this)
    );
  }

  updateDestinationDisplay(event) {
    const selectedDestination = event.detail;
    this.shadowRoot.querySelector(
      ".destination-display"
    ).textContent = `Selected Destination: ${selectedDestination}`;
  }

  updateDateDisplay(event) {
    const selectedDate = event.detail;
    this.shadowRoot.querySelector(
      ".date-display"
    ).textContent = `Selected Travel Date: ${selectedDate}`;
  }
}

customElements.define("destination-travel-info", DestinationTravelInfo);

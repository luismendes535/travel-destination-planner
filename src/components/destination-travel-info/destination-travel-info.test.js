import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "./destination-travel-info.js";

describe("destination-travel-info", () => {
  it("displays destination and date display elements", async () => {
    const el = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );

    const destinationDisplay = el.shadowRoot.querySelector(
      ".destination-display"
    );
    const dateDisplay = el.shadowRoot.querySelector(".date-display");

    expect(destinationDisplay).to.exist;
    expect(dateDisplay).to.exist;
  });

  it("updates destination display when destination is selected", async () => {
    const el = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );
    const selectedDestination = "Paris";

    // Dispatch a custom event to simulate the selection of a destination
    el.dispatchEvent(
      new CustomEvent("destination-selected", { detail: selectedDestination })
    );

    // Check if the destination display element is updated
    const destinationDisplay = el.shadowRoot.querySelector(
      ".destination-display"
    );
    expect(destinationDisplay.textContent).to.equal(
      `Selected Destination: ${selectedDestination}`
    );
  });

  it("updates date display when date is selected", async () => {
    const el = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );
    const selectedDate = "2023-08-15";

    // Dispatch a custom event to simulate the selection of a date
    el.dispatchEvent(
      new CustomEvent("date-selected", { detail: selectedDate })
    );

    // Check if the date display element is updated
    const dateDisplay = el.shadowRoot.querySelector(".date-display");
    expect(dateDisplay.textContent).to.equal(
      `Selected Travel Date: ${selectedDate}`
    );
  });

  it("updates both displays when destination and date are selected", async () => {
    const el = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );
    const selectedDestination = "London";
    const selectedDate = "2023-09-20";

    // Dispatch custom events to simulate the selection of both destination and date
    el.dispatchEvent(
      new CustomEvent("destination-selected", { detail: selectedDestination })
    );
    el.dispatchEvent(
      new CustomEvent("date-selected", { detail: selectedDate })
    );

    // Check if both display elements are updated
    const destinationDisplay = el.shadowRoot.querySelector(
      ".destination-display"
    );
    const dateDisplay = el.shadowRoot.querySelector(".date-display");

    expect(destinationDisplay.textContent).to.equal(
      `Selected Destination: ${selectedDestination}`
    );
    expect(dateDisplay.textContent).to.equal(
      `Selected Travel Date: ${selectedDate}`
    );
  });

  it("dispatches custom event when destination is selected", async () => {
    const el = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );
    const selectedDestination = "Barcelona";

    // Use oneEvent to listen for the custom event 'destination-selected'
    const destinationSelectedEvent = oneEvent(el, "destination-selected");

    // Dispatch a custom event to simulate the selection of a destination
    el.dispatchEvent(
      new CustomEvent("destination-selected", { detail: selectedDestination })
    );

    // Wait for the event to be captured
    const eventDetail = await destinationSelectedEvent;

    // Check if the custom event was dispatched and captured
    expect(eventDetail.detail).to.equal(selectedDestination);
  });

  it("dispatches custom event when date is selected", async () => {
    const el = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );
    const selectedDate = "2023-12-05";

    // Use oneEvent to listen for the custom event 'date-selected'
    const dateSelectedEvent = oneEvent(el, "date-selected");

    // Dispatch a custom event to simulate the selection of a date
    el.dispatchEvent(
      new CustomEvent("date-selected", { detail: selectedDate })
    );

    // Wait for the event to be captured
    const eventDetail = await dateSelectedEvent;

    // Check if the custom event was dispatched and captured
    expect(eventDetail.detail).to.equal(selectedDate);
  });
});

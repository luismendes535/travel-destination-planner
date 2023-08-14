import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "./travel-date.js";
import "../destination-travel-info/destination-travel-info.js";

describe("travel-date", () => {
  it("displays input field for date", async () => {
    const el = await fixture(html`<travel-date></travel-date>`);
    const input = el.shadowRoot.querySelector('input[type="date"]');

    expect(input).to.exist;
  });

  it("dispatches custom event with formatted selected date and render data in the right format", async () => {
    // Create both components and attach them to the DOM
    const travelDateEl = await fixture(html`<travel-date></travel-date>`);
    const destinationTravelInfoEl = await fixture(
      html`<destination-travel-info></destination-travel-info>`
    );

    const selectedDate = "2024-08-15";

    // Use oneEvent to listen for the custom event 'date-selected' in the destination-travel-info component
    const dateSelectedEvent = oneEvent(
      destinationTravelInfoEl,
      "date-selected"
    );

    // Dispatch a change event to simulate the selection of a date
    travelDateEl.input.value = selectedDate;
    travelDateEl.input.dispatchEvent(new Event("change"));

    // Wait for the event to be captured
    const event = await dateSelectedEvent;

    // Check if the custom event was dispatched and captured
    expect(event.detail).to.equal("15.08.2024");

    expect(
      destinationTravelInfoEl.shadowRoot.querySelector(".date-display")
        .textContent
    ).to.equal("Selected Travel Date: 15.08.2024");
  });
});

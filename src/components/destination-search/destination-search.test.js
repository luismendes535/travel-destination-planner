import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import "./destination-search.js";

describe("destination-search", () => {
  let originalFetch;

  before(() => {
    // Save the original fetch function before tests
    originalFetch = globalThis.fetch;
  });

  after(() => {
    // Restore the original fetch function after tests
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    // Mock the fetch API to return a predefined response
    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
  });

  it("displays search input and result list", async () => {
    const el = await fixture(html`<destination-search></destination-search>`);
    const input = el.shadowRoot.querySelector('input[type="search"]');
    const resultList = el.shadowRoot.querySelector("ul.result-list");

    expect(input).to.exist;
    expect(resultList).to.exist;
  });

  it("fetches and displays autocomplete results", async () => {
    const mockResponse = [
      {
        category: "REISEZIELE VON A-Z",
        icon: "location",
        items: [
          {
            key: "hub_7043",
            name: "Disneyland Paris",
            level: 1,
            parent: "hub_7033",
            source: "peakwork",
          },
          {
            key: "hub_7059",
            name: "Paris & Umgebung",
            level: 1,
            parent: "hub_7033",
            source: "peakwork",
          },
        ],
        type: "regions",
      },
    ];

    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

    const el = await fixture(html`<destination-search></destination-search>`);
    const input = el.shadowRoot.querySelector('input[type="search"]');

    // Set a value in the input field
    input.value = "Paris";

    // Trigger an input event to initiate the autocomplete search
    input.dispatchEvent(new Event("input"));

    // Wait for the debounce to complete
    await aTimeout(200);

    const resultListItems = el.shadowRoot.querySelectorAll("ul.result-list li");
    expect(resultListItems.length).to.equal(mockResponse[0].items.length);
  });

  it("handles empty autocomplete results", async () => {
    const mockResponse = [];

    globalThis.fetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

    const el = await fixture(html`<destination-search></destination-search>`);
    const input = el.shadowRoot.querySelector('input[type="search"]');

    // Set a value in the input field
    input.value = "nonexistentdestination";

    // Trigger an input event to initiate the autocomplete search
    input.dispatchEvent(new Event("input"));

    // Wait for the debounce to complete
    await aTimeout(200);

    const resultListItems = el.shadowRoot.querySelectorAll("ul.result-list li");
    expect(resultListItems.length).to.equal(0);
  });
});

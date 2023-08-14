import "./components/destination-search/destination-search.js";
import "./components/travel-date/travel-date.js";
import "./components/destination-travel-info/destination-travel-info.js";

import "./styles/app.css";

const appContent = `
    <div id="app" class="app">
        <h2>Destination Search</h2>
        <destination-search></destination-search>

        <h2>Travel Date</h2>
        <travel-date></travel-date>

        <h2>Selected Destination and Travel Date</h2>
        <destination-travel-info></destination-travel-info>
    </div>
`;

const appDiv = document.getElementById("root");
appDiv.innerHTML = appContent;

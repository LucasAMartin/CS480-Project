// Get the parent element to add the divs
let parentElement = document.body;

for (let symbol in stockData) {
    let div = document.createElement("div");
    div.className = "dashboard-grid";

    let ticker = document.createElement("h3");
    ticker.className = "ticker accent";
    ticker.textContent = symbol;
    div.appendChild(ticker);

    let recentData = stockData[symbol];
    let previousDataOfSymbol = previousData[symbol]; // Retrieve previous data for current symbol

    // Calculate average price for recent data
    let recentOpenPrice = parseFloat(recentData['1. open']);
    let recentClosePrice = parseFloat(recentData['4. close']);
    let recentAveragePrice = (recentOpenPrice + recentClosePrice) / 2;

    // Calculate average price for previous data
    let previousOpenPrice = parseFloat(previousDataOfSymbol['1. open']);
    let previousClosePrice = parseFloat(previousDataOfSymbol['4. close']);
    let previousAveragePrice = (previousOpenPrice + previousClosePrice) / 2;

    let dataPoints = [
        { label: 'Current', value: recentAveragePrice.toFixed(2) },
        { label: 'High', key: '2. high', value: parseFloat(recentData['2. high']).toFixed(2) },
        { label: 'Low', key: '3. low', value: parseFloat(recentData['3. low']).toFixed(2) },
        { label: 'Open', key: '1. open', value: parseFloat(recentData['1. open']).toFixed(2) },
        { label: 'Close', key: '4. close', value: parseFloat(recentData['4. close']).toFixed(2) }
    ];

    for (let dataPoint of dataPoints) {
        let dataDiv = document.createElement("div");
        dataDiv.className = "data-point";

        let label = document.createElement("h3");
        label.className = "label accent";
        label.textContent = dataPoint.label + ":";
        dataDiv.appendChild(label);

        let value = document.createElement("h3");
        value.className = "value";

        // Compare current and previous values and assign color class
        if (dataPoint.label === 'Current') {
            let previousValue = previousAveragePrice;
            let currentValue = recentAveragePrice;
            if (!isNaN(previousValue)) {
                if (currentValue > previousValue) {
                    value.classList.add("green");
                    console.log("Changed value to green for:", dataPoint.label);
                } else if (currentValue < previousValue) {
                    value.classList.add("red");
                    console.log("Changed value to red for:", dataPoint.label);
                }
            }
        } else if (dataPoint.key && previousDataOfSymbol) {
            let previousValue = parseFloat(previousDataOfSymbol[dataPoint.key]);
            if (!isNaN(previousValue)) {
                let currentValue = parseFloat(dataPoint.value);
                if (currentValue > previousValue) {
                    value.classList.add("green");
                    console.log("Changed value to green for:", dataPoint.label);
                } else if (currentValue < previousValue) {
                    value.classList.add("red");
                    console.log("Changed value to red for:", dataPoint.label);
                }
            }
        }

        value.textContent = "$" + dataPoint.value;
        dataDiv.appendChild(value);

        div.appendChild(dataDiv);
    }

    // Add the onclick event
    div.onclick = function() {
        window.location.href = url + "?symbol=" + ticker.textContent;
    };

    parentElement.appendChild(div);
}


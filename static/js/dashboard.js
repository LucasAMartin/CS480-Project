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

   let openPrice = parseFloat(recentData['1. open']);
   let closePrice = parseFloat(recentData['4. close']);
   let averagePrice = (openPrice + closePrice) / 2;

   let dataPoints = [
      { label: 'Current', value: averagePrice.toFixed(2) },
      { label: 'High', value: parseFloat(recentData['2. high']).toFixed(2) },
      { label: 'Low', value: parseFloat(recentData['3. low']).toFixed(2) },
      { label: 'Open', value: parseFloat(recentData['1. open']).toFixed(2) },
      { label: 'Close', value: parseFloat(recentData['4. close']).toFixed(2) }
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

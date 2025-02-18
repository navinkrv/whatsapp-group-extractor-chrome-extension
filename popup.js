document.getElementById("scrapeBtn").addEventListener("click", () => {
	console.log("Scrape button clicked!");

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		console.log("Executing content script in active tab...");

		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ["content.js"]
		});
	});
});

// Listen for the scraped content
chrome.runtime.onMessage.addListener((message) => {
	console.log("Received message from content script:", message);

	if (message.text) {
		document.getElementById("output").innerText = "Data Scraped Successfully!";
		console.log("Scraped Data:", message.text);
		downloadCSV(message.text);
	} else {
		console.warn("No data received from content script.");
	}
});

// Convert scraped data to CSV and trigger download
function downloadCSV(content) {
	console.log("Preparing CSV file...");

	const numbers = content
		.split(",")
		.map((num) => num.trim())
		.filter((num) => num !== "");
	console.log("Processed Numbers for CSV:", numbers);

	let csvContent = "data:text/csv;charset=utf-8,Number\n";
	numbers.forEach((num) => {
		csvContent += `${num}\n`;
	});

	console.log("CSV Content:\n", csvContent);

	const encodedUri = encodeURI(csvContent);
	const link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "scraped_data.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	console.log("CSV file downloaded successfully.");
}

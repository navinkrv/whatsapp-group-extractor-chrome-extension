(() => {
	console.log("Content script running...");

	let textElements = document.querySelectorAll(".copyable-text");
	console.log(
		`Found ${textElements.length} elements with class "copyable-text"`
	);

	if (textElements.length > 0) {
		let extractedText = Array.from(textElements)
			.map((el) => el.innerText || el.textContent)
			.join(",");

		console.log("Extracted Text:", extractedText);

		chrome.runtime.sendMessage({ text: extractedText });
	} else {
		console.warn("No elements with class 'copyable-text' found.");
	}
})();

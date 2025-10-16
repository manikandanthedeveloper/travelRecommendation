(function () {
	const HOST = "./travel_recommendation_api.json";
	const searchInput = document.getElementById("searchInput");
	const dropdown = document.getElementById("dropdownResults");
	const clearBtn = document.getElementById("btnClear");
	const searchBtn = document.getElementById("btnSearch");

	let rawData = {};
	let destinations = []; // flattened list: cities, temples, beaches, countries

	fetch(HOST)
		.then((response) => {
			if (!response.ok) throw new Error("Network response was not ok");
			return response.json();
		})
		.then((data) => {
			console.log("travel_recommendation_api.json loaded:", data);
			rawData = data || {};
			flattenData(rawData);
		})
		.catch((error) => console.error("Error fetching JSON:", error));

	// Convert nested JSON into a flat array for easier searching
	function flattenData(data) {
		destinations = [];

		data.countries.forEach((country) => {
			const options = {
				timeZone: "America/New_York",
				hour12: true,
				hour: "numeric",
				minute: "numeric",
				second: "numeric",
			};
			const newYorkTime = new Date().toLocaleTimeString("en-US", options);
			destinations.push({
				id: `country-${country.id}`,
				name: country.name,
				category: "countries",
				imageUrl: country.cities[0].imageUrl,
				description: country.cities[0].description,
				timeNow: newYorkTime,
				meta: country,
			});
		});

		data.temples.forEach((t) => {
			destinations.push({
				id: `temple-${t.id}`,
				name: t.name,
				category: "temples",
				imageUrl: t.imageUrl || "",
				description: t.description || "",
			});
		});

		data.beaches.forEach((b) => {
			destinations.push({
				id: `beach-${b.id}`,
				name: b.name,
				category: "beaches",
				imageUrl: b.imageUrl || "",
				description: b.description || "",
			});
		});
	}

	function renderResults(list) {
		dropdown.innerHTML = "";

		if (!list || list.length === 0) {
			dropdown.innerHTML = `<div class="result-item"><div class="card result-row"><div class="p-3 text-muted">No results found</div></div></div>`;
			dropdown.style.display = "block";
			return;
		}

		const container = document.createElement("div");
		container.className = "results-list";

		list.forEach((item) => {
			const imgPath = item.imageUrl ? `./images/${item.imageUrl}` : "";
			const node = document.createElement("div");
			node.className = "result-item";
			node.innerHTML = `
                <div class="result-row card mb-2">
                    ${
						imgPath
							? `<img src="${imgPath}" alt="${item.name}" class="result-thumb">`
							: ""
					}
                    <div class="card-body">
                        <h6 class="result-title d-flex justify-content-between"><span>${
							item.name
						}</span><span class="text-muted">${
				item.timeNow ? item.timeNow : ""
			}</span></h6>
                        <p class="result-desc">${item.description}</p>
                        <button class="btn-visit">Visit</button>
                    </div>
                </div>
            `;
			container.appendChild(node);
		});

		dropdown.appendChild(container);
		dropdown.style.display = "block";
	}

	if (searchBtn) {
		searchBtn.addEventListener("click", function (e) {
			e.preventDefault();
			const rawQuery = searchInput.value.trim();
			const query = rawQuery.toLowerCase();

			if (!query) {
				dropdown.innerHTML = `<div class="p-3 text-muted">Please enter a search term</div>`;
				dropdown.style.display = "block";
				return;
			}

			let results = [];

			if (query.includes("beaches")) {
				results = destinations.filter((d) => d.category === "beaches");
			} else if (query.includes("temples")) {
				results = destinations.filter((d) => d.category === "temples");
			} else if (query.includes("countries")) {
				results = destinations.filter(
					(d) => d.category === "countries"
				);
			}

			console.log("Search results for:", rawQuery, results);
			renderResults(results);
		});
	} else {
		console.warn("Search button (#btnSearch) not found.");
	}

	if (clearBtn) {
		clearBtn.addEventListener("click", function () {
			searchInput.value = "";
			dropdown.style.display = "none";
			dropdown.innerHTML = "";
		});
	}
})();

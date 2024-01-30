const { readFile, writeFile } = require("fs");
const superagent = require("superagent");

readFile(`${__dirname}/selected_cat.txt`, "utf-8", (err, data) => {
	if (err) {
		console.error("Error reading selected category file:", err);
		return;
	}

	console.log(`Selected Category: ${data}`);

	function getCat(callback) {
		readFile(`${__dirname}/cloth.txt`, "utf-8", (err, data) => {
			if (err) {
				console.error("Error reading cloth file:", err);
				callback(err, null);
				return;
			}
			callback(null, JSON.parse(data));
		});
	}

	getCat((err, catData) => {
		if (err) {
			console.error("Error getting category data:", err);
			return;
		}

		const filtered = catData.find((item) => item.catName === data);
		console.log(">>>>", filtered.catId);
		const id = filtered.catId;

		superagent
			.get(`https://api.escuelajs.co/api/v1/categories/${id}`)
			.end((err, res) => {
				if (err) {
					console.error("Error making API request:", err);
					return;
				}

				console.log(res.body);

				// const allProducts = res.body.map((el) => ({
				// 	catId: el.id,
				// 	catName: el.name,
				// }));
				// const allProductsString = JSON.stringify(allProducts);

				// console.log("this all product", allProducts);

				writeFile("history.txt", JSON.stringify(res.body), "utf-8", (err) => {
					if (err) {
						console.error("Error writing to cloth file:", err);
						return;
					}
					console.log("File written");
				});
			});
	});
});

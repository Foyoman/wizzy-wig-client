const intro = require('../files/intro.md');

fetch(intro).then((response) => response.text()).then((text) => {
	console.log(text);
});

export {};
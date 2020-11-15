const fs = require("fs");
const disgen = require("../src");

let config = {};

(async () => {
	const pfile = fs.readFileSync(__dirname + "/proxies.txt");
	let proxies = pfile.toString().split("\n");
	config.proxy = proxies[Math.floor(Math.random()*proxies.length)];

	const client = new disgen.bypass(config);

	console.log(`Disgen thingy by PlutonusDev\nhttps://github.com/PlutonusDev\n\nUsing Proxy: ${config.proxy}\nGenerating instance...`);
	client.generateInstance().then(resp => {
		console.log(`Got fingerprint: ${resp.fingerprint}\nGenerating account...`);

		client.makeAccount().then(resp => {
			console.log(resp);
			client.contactGateway();
		}).catch(err => {
			console.log("Discord did *not* like that. Probably a captcha problem.");
		});
	});
})();

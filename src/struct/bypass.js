const sa = require("superagent");
const sap = require("ua-parser-js");
const ws = require("websocket");
const ua = require("random-useragent");
const tn = require("tunnel");
const pup = require("puppeteer");

require("superagent-proxy")(sa);

module.exports = class Bypass {
	constructor(config) {
		this.config = config || {};
		this._defaultHost = "discord.com";

		this.session = {
			host: this.config.host || this._defaultHost,
			api: "v8",
			user_agent: this.config.user_agent || ua.getRandom(),
			props: "",
			proxy: "http://" + this.config.proxy || false,
			tunnel: tn.httpOverHttp({
				proxy: {
					host: this.config.proxy && this.config.proxy.split(":")[0] || "",
					port: this.config.proxy && this.config.proxy.split(":")[1] || ""
				}
			}),
			build_number: 0,
			client_uuid: "",
			token: "",
			fingerprint: ""
		}

		this.session.props = new sap(this.session.user_agent);

		this.agent = sa;
		this.client = new ws.client();
	}

	generateInstance() {
		return new Promise(async (res, rej) => {
			/*const browser = await pup.launch({
				args: [
					//this.config.proxy ? `--proxy-server=${this.config.proxy}` : "",
					"--no-sandbox",
					"--disable-web-security"
				]
			});

			const page = await browser.newPage();
			await page.goto(`https://${this.session.host}/api/${this.session.api}/experiments`);
			await page.evaluate(() => {console.log("1")});
			await browser.close();*/

			this.agent.get(`https://${this.session.host}/api/${this.session.api}/experiments`)
				.set("user-agent", this.session.user_agent)
				.proxy(this.session.proxy)
				.then(resp => {
					this.session.fingerprint = resp.body.fingerprint;
					res(resp.body);
				});
		});
	}

	contactGateway() {
		return new Promise((res, rej) => {
			this.client.connect("wss://gateway.discord.gg/?encoding=json&v=8&compress=zlib-stream", "", `https://${this.session.host}/`, {
				"User-Agent": this.session.user_agent,
				"Pragma": "no-cache",
				"Sec-WebSocket-Extensions": "permessage-deflate;client_max_window_bits",
				"Sec-WebSocket-Key": "AV9Y5FZyifxt410j9UqTqw==",
				"Sec-WebSocket-Version": "13",
				"Connection": "Upgrade"
			}, {
				agent: this.session.tunnel
			});

			this.client.on("connect", conn => {
				conn.send({
					op: 2,
					d: {
						token: this.session.token,
						capabilities: 61,
						properties: this.getProperties(),
						presence: {
							status: "online",
							since: 0,
							activities: [],
							afk: false
						},
						compress: false,
						client_state: {
							guild_hashes: {},
							highest_last_message_id: 0,
							read_state_version: 0,
							user_guild_settings_version: -1
						}
					}
				});
			});
			res();
		});
	}

	getProperties() {
		const props = this.session.props;

		return {
			os: props.getOS().name,
			browser: props.getBrowser().name,
			device: props.getDevice(),
			browser_user_agent: this.session.user_agent,
			browser_version: props.getBrowser().version,
			os_version: props.getOS().version,
			referrer: "",
			referring_domain: "",
			referring_domain_current: "",
			release_channel: "stable",
			client_build_number: 9999,
			client_event_source: undefined
		}
	}

	makeAccount(data) {
		return new Promise((res, rej) => {
			data = data || {};
			this.makeCall("post",
				`https://${this.session.host}/api/${this.session.api}/auth/register`,
				{
					fingerprint: this.session.fingerprint,
					consent: true,
					username: data.username || "github.com/PlutonusDev"
				}
			).then(resp => {
				res(resp.body);
			}).catch(err => {
				rej(err);
			});
		});
	}

	makeCall(method, url, data, headers, context) {
		return new Promise((res, rej) => {
			let struct = this.agent[method](url);

			if(url.startsWith(`https://${this.session.host}/api/`)) {
				if(this.session.token) struct.set("Authorization", this.session.token);
				if(this.session.fingerprint) struct.set("X-Fingerprint", this.session.fingerprint);
			}

			if(this.session.proxy) struct.proxy(this.session.proxy);

			struct.send(data).then(resp => {
				res(resp);
			}).catch(err => rej(err));
		});
	}
}

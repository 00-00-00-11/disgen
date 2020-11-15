<h1 align="center">discord violator</h1>
<div align="center">:steam_locomotive::train::train:<br/><small>btw this shit doesn't work yet</small></div>

<div align="center">
	<strong>Basically attempts to bypass Discord's security checks to prevent it from offering a captcha for API events (such as registering)</strong>
</div>

<div align="center">
	<h3>
		<a href="https://github.com/PlutonusDev">My Github</a>
		<span> | </span>
		<a>Plutonus#0001 on Discord</a>
	</h3>
</div>

<div align="center">
	<sub>The little toy that could. Built by Plutonus for fun during a drunk afternoon.

	Inspired by <a href="https://twitter.com/h0nde">h0nda's sel-discord</a> python package.</sub>
</div>


## Table of Contents
- [Features](#features)
- [Example](#example)
- [API](#api)
- [Contributing](#contributing)
- [Support](#support)

## Features
- __Identification Saving:__ Generates a 'profile' with Discord and sticks with it to add confidence.
- __Gateway Pinging:__ After an account is successfully generated, pings Discord's gateway for additional fun.
- __That's about it:__ Stop reading this headass.

## Example
```js
const disgen = require("./src");
const bypass = new disgen.bypass(); // For proxy support, pass '{ proxy: "xxx.xxx.xxx.xxx:xxxx" }'

bypass.generateInstance().then(() => { // Generates that identification I mentioned earlier. not required but definitely a good idea.
	bypass.makeAccount().then(() => { // Uh.. makes an account.
		bypass.contactGateway(); // Those special features. Dig through the code and find them yourself.
	});
});
```

## API
### `'bypass' | <disgen>.bypass(config)`
__Class__. Constructor takes 1 parameter, `config`, which is an object containing (you guessed it) configuration data.

### `'config' | config`
__Object__. Allowed props: `{ proxy: string }`

### `'generateInstance' | <client>.generateInstance()`
__Function__. No arguments. Automatically generates an ID with Discord. Returns: object.

### `'makeAccount' | <client>.makeAccount()`
__Function__. No arguments (yet). Automatically attempts to create a Discord account. Returns: object.

### `'contactGateway' | <client>.contactGateway()`
__Function__. No arguments. Contacts the Discord gateway for more information and utility. Returns: nil.

### `'makeCall` | <client.makeCall(method, url, data, headers, context)`
__Function__. Method is the http method. Url is the url, data is an object of body sent in post requests. Headers and context are unused and automatically added if needed.

### There's more but I don't want to write it all out. Go look yourself.


## Contributing
Yeah make a pull request and maybe I'll add it in.


## Support
I take no responsibility for how you use this or what you use it for. You get no help from me.
You can find me on Discord at Plutonus#0001 though.

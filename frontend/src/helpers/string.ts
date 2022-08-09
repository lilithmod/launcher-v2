function toHex(str: string) {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(16);
	}
	return result;
}

function getRandomString(length: number) {
	var randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
	var result = '';
	for (let i = 0; i < length; i++) {
		result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	}
	return result;
}

const classNames = (...classes: Array<any>) => {
	return classes.filter(Boolean).join(' ');
};

const tryParseJSONObject = (jsonString: string) => {
	try {
		var o = JSON.parse(jsonString);
		if (o && typeof o === 'object') {
			return o;
		}
	} catch (e) {}

	return false;
};

export { getRandomString, toHex, classNames, tryParseJSONObject };

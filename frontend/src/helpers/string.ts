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

export { getRandomString, toHex, classNames };

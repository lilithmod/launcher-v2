import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const toHex = (str: string) => {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		result += str.charCodeAt(i).toString(16);
	}
	return result;
};

export const getRandomString = (length: number) => {
	const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	}
	return result;
};

export const classNames = (...classes: Array<any>) => classes.filter(Boolean).join(' ');

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const tryParseJSONObject = (jsonString: string) => {
	try {
		const o = JSON.parse(jsonString);
		if (o && typeof o === 'object') {
			return o;
		}
	} catch (e) {
		console.log(e);
	}

	return false;
};

export const parseMessage = (msg: string) => {
	return msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

export const handleBreak = (msg: string) => {
	if (msg.includes('{*') && msg.includes('*}')) {
		return msg.split('{*')[1].slice(0, -2);
	}
};

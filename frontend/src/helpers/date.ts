const dateFromNow = (exdays: number) => {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	return d.toUTCString();
};

export { dateFromNow };

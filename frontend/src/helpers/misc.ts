const delay = (time: number) => {
	return new Promise((resolve) => setTimeout(resolve, time));
};

function debounce<Params extends any[]>(func: (...args: Params) => any, timeout: number): (...args: Params) => void {
	let timer: NodeJS.Timeout;
	return (...args: Params) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, timeout);
	};
}

export { delay, debounce };

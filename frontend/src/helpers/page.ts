const onPage = (page: string) => {
	return window.location.pathname.startsWith(page);
};

export { onPage };

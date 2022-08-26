interface HttpRequest {
	get: (url: string) => Promise<string>;
}

export type { HttpRequest };

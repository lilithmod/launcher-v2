import { HTTPGetRequest } from '@/wailsjs/go/main/App';
import { HttpRequest } from '#types/api/http';

const http: HttpRequest = {
	get: HTTPGetRequest,
};

export default http;

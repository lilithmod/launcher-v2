import { HTTPGetRequest } from '../../wailsjs/go/main/App'
import type { HttpRequest } from '../types/api/http'

const http: HttpRequest = {
	get: HTTPGetRequest,
}

export default http

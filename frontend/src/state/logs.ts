import { Action, action, Thunk, thunk } from 'easy-peasy';

export interface LogsStore {
	data?: any;
	pushLogs: Action<LogsStore>;
	reset: Action<LogsStore>;
}

const logs: LogsStore = {
	data: [],
	pushLogs: action((state, payload) => {
		state.data.push(payload);
	}),
	reset: action((state) => {
		state.data = [];
	}),
};

export default logs;

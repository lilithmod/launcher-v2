import { Action, action, Thunk, thunk } from 'easy-peasy';

let initialState = { uuid: '', token: '', email: '', profile: { username: '', avatar: '', premium: false } };

export interface UserData {
	uuid: string;
	token: string;
	email: string;
	profile: {
		username: string;
		avatar: string;
		premium: boolean;
	};
}

export interface UserStore {
	data?: UserData;
	setUserData: Action<UserStore, UserData>;
	reset: Action<UserStore>;
}

const user: UserStore = {
	data: undefined,
	setUserData: action((state, payload) => {
		state.data = payload;
	}),
	reset: action((state) => {
		state.data = initialState;
	}),
};

export default user;

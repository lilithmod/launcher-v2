import { Action, action, Thunk, thunk } from 'easy-peasy';

let initialState = { username: '' };

export interface UserData {
	username: string;
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

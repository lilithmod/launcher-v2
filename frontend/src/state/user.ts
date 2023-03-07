import { Action, action, Thunk, thunk } from 'easy-peasy';

const initialState = { version: '0.0.0' };

export interface UserData {
	version: string;
}

export interface UserStore {
	data?: UserData;
	setUserData: Action<UserStore, UserData>;
	reset: Action<UserStore>;
}

const user: UserStore = {
	data: initialState,
	setUserData: action((state, payload) => {
		state.data = payload;
	}),
	reset: action((state) => {
		state.data = initialState;
	}),
};

export default user;

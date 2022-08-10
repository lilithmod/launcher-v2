import { Action, action, Thunk, thunk } from 'easy-peasy';

export interface ButtonStore {
	data: any;
	setButtonData: Action<ButtonStore>;
	reset: Action<ButtonStore>;
}

const button: ButtonStore = {
	data: 'ready to launch',
	setButtonData: action((state, payload) => {
		state.data = payload;
	}),
	reset: action((state) => {
		state.data = 'ready to launch';
	}),
};

export default button;

import { createStore } from 'easy-peasy'
import button, { type ButtonStore } from '../state/button'
import logs, { type LogsStore } from '../state/logs'
import settings, { type SettingsStore } from '../state/settings'
import user, { type UserStore } from '../state/user'

export interface ApplicationStore {
	user: UserStore
	settings: SettingsStore
	button: ButtonStore
	logs: LogsStore
}

const state: ApplicationStore = {
	user,
	settings,
	button,
	logs,
}

export const store = createStore(state)

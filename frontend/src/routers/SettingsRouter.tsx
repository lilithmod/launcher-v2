import { useStoreState } from 'easy-peasy'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LoadConfig } from '../../wailsjs/go/main/App'
import { TransitionWrapper } from '../components/elements/Generic'
import Page from '../components/Page'
import { Settings } from '../components/pages'
import { tryParseJSONObject } from '../helpers'
import { type ApplicationStore, store } from '../state'

const SettingsRouter = () => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data)
	const location = useLocation()

	const [lilithConfig, setLilithConfig] = useState({})
	const [validJson, setValidJson] = useState(true)
	const [fileExists, setFileExists] = useState(false)

	useEffect(() => {
		setFileExists(false)
		LoadConfig()
			.then((data: any) => {
				tryParseJSONObject(data) ? setValidJson(true) : setValidJson(false)
				console.log(JSON.parse(data))
				setLilithConfig(JSON.parse(data))
				if ('launcher' in JSON.parse(data)) {
					store.getActions().settings.setSettings({
						blur: JSON.parse(data).launcher.blur,
					})
				}
				if ('commandAliases' in JSON.parse(data) && 'gamemodeAliases' in JSON.parse(data)) setFileExists(true)
			})
			.catch((err) => {
				console.log(err)
			})
	}, [location])

	if (!validJson) {
		return (
			<div tw='w-full h-screen flex justify-center items-center text-red-400 font-black text-xl'>
				Please check your lilith config. JSON parsed from this file is invalid.
			</div>
		)
	} else {
		return (
			<Routes>
				<Route
					path='/'
					element={
						<TransitionWrapper
							render={
								<Page
									component={Settings}
									id='settings-launcher'
									config={lilithConfig}
									loaded={fileExists}
								/>
							}
						/>
					}
				/>
			</Routes>
		)
	}
}

export default SettingsRouter

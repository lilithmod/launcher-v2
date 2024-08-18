import React, { useEffect, useState, Fragment } from 'react';

import ky from 'ky';
import tw from 'twin.macro';
import Page from '@/components/Page';
import { tabs, navigation } from '@/lang';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import { LoadConfig } from '@/wailsjs/go/main/App';
import { classNames, tryParseJSONObject } from '@/helpers';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Spinner, TransitionWrapper } from '@/components/elements/Generic';
import Settings, { Launcher, Aliases } from '@/components/pages/Settings';

const SettingsRouter = () => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);
	const location = useLocation();

	const [lilithConfig, setLilithConfig] = useState({});
	const [validJson, setValidJson] = useState(true);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
		LoadConfig()
			.then((data: any) => {
				tryParseJSONObject(data) ? setValidJson(true) : setValidJson(false);
				console.log(JSON.parse(data));
				setLilithConfig(JSON.parse(data));
				if ('launcher' in JSON.parse(data)) {
					store.getActions().settings.setSettings({
						blur: JSON.parse(data).launcher.blur,
					});
				}
				setLoaded(true);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [location]);

	if (!validJson) {
		return (
			<div tw="w-full h-screen flex justify-center items-center text-red-400 font-black text-xl">
				Please check your lilith config. JSON parsed from this file is invalid.
			</div>
		);
	} else {
		return (
			<Routes>
				<Route path="/general" element={<TransitionWrapper render={<Page component={Launcher} id="settings-launcher" config={lilithConfig} />} />} />
			</Routes>
		);
	}
};

export default SettingsRouter;

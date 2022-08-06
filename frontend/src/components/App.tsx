import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import Page from '@/components/Page';
import { debounce } from '@/helpers';
import { LauncherHome } from '@/components/pages/Launcher';
import { useStoreState } from 'easy-peasy';
import { Offline } from 'react-detect-offline';
import { Spinner, Appbar } from '@/components/elements/Generic';
import { store, ApplicationStore } from '@/state';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { SettingsRouter } from '@/routers';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
	const [loaded, setLoaded] = useState(false);
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	useEffect(() => {
		console.log(window.location.hash);
	}, [window.location.hash]);

	useEffect(() => {
		store.getActions().user.setUserData({
			uuid: '0000-0000-0000-0000',
			token: '1234567890abcd',
			email: 'demo@demo.com',
			profile: {
				username: 'example',
				avatar: 'https://source.boringavatars.com/beam/512/?square',
				premium: false,
			},
		});
		setLoaded(true);
	}, []);
	if (!loaded) {
		return (
			<div css={tw`w-full h-screen flex justify-center items-center`}>
				<Spinner size="large" />
			</div>
		);
	} else {
		return (
			<HashRouter>
				<GlobalStyles />
				<Appbar />
				<Routes>
					<Route path="/" element={<Navigate to="/launch" replace />} />
					<Route path="/launch" element={<Page component={LauncherHome} id="homepage-launcher" />} />
					<Route path="/settings/*" element={<SettingsRouter />} />
					<Route path="/about" element={<Page component={LauncherHome} id="about-page" />} />
					<Route path="/premium" element={<Page component={LauncherHome} id="buy-premium-or-hide" />} />
				</Routes>
			</HashRouter>
		);
	}
};

export default App;

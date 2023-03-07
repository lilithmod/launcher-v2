import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import http from '@/api/http';
import Page from '@/components/Page';
import { debounce } from '@/helpers';
import Snowfall from 'react-snowfall';
import { useStoreState } from 'easy-peasy';
import { SettingsRouter } from '@/routers';
import { Offline } from 'react-detect-offline';
import { store, ApplicationStore } from '@/state';
import GlobalStyles from '@/assets/styles/GlobalStyles';
import { LauncherHome } from '@/components/pages/Launcher';
import { BrowserOpenURL, EventsOn } from '@/wailsjs/runtime';
import { Spinner, Appbar } from '@/components/elements/Generic';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShowDialog, HandleErrorFrontend, GetVersion } from '@/wailsjs/go/main/App';

const SnowFlakes = (props: { season: Boolean; children: any }) => (
	<Fragment>
		{props.season && <Snowfall style={{ zIndex: 100 }} color="#fff" />}
		{props.children}
	</Fragment>
);

const App = () => {
	const [version, setVersion] = useState('0.0.0');

	useEffect(() => {
		http
			.get('https://api.lilith.rip/versions/latest')
			.then((data: any) => store.getActions().user.setUserData({ version: JSON.parse(data).version }));
	}, []);

	GetVersion().then((data: string) => {
		setVersion(data);
	});

	useEffect(() => {
		EventsOn('launch_lilith', (messages) => {
			store.getActions().button.setButtonData(messages);
		});
		EventsOn('lilith_log', (messages) => {
			store.getActions().logs.pushLogs(messages);
			if (messages.includes('Join Lilith using the address below:')) {
				ShowDialog('Startup Complete', ` You can join Hypixel using Lilith by connecting to the IP "localhost" in any client.`, ['Ok'], 'Ok', '', '');
			}
			if (messages.includes('Uncaught Exception')) {
				const errorMsg = messages
					.split('||')[1]
					.trim()
					.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
				HandleErrorFrontend(errorMsg);
			}
			if (messages.includes('[22m[39m[38;5;240m[[39m[38;5;250m...[39m[38;5;240m][39m[38;5;227m Verify[39m[38;5;240m » [39m[38;5;87m[4m')) {
				const verifyUrl = messages
					.split('»')[1]
					.trim()
					.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

				ShowDialog('Verify your hardware', `You will be redirected to ${verifyUrl}`, ['Verify'], 'Verify', '', messages).then((url) =>
					BrowserOpenURL(verifyUrl)
				);
			}
		});
	}, []);

	return (
		<HashRouter>
			<GlobalStyles />
			<SnowFlakes season={new Date().getMonth() == 11}>
				<Appbar />
				<div tw="absolute bottom-1 right-1 text-[9px] text-neutral-500 opacity-30 z-20">v{version}</div>
				<Routes>
					<Route path="/" element={<Navigate to="/launch" replace />} />
					<Route path="/launch" element={<Page component={LauncherHome} id="homepage-launcher" />} />
					<Route path="/settings/*" element={<SettingsRouter />} />
				</Routes>
			</SnowFlakes>
		</HashRouter>
	);
};

export default App;

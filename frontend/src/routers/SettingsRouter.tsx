import React, { useEffect, useState, Fragment } from 'react';

import ky from 'ky';
import tw from 'twin.macro';
import Page from '@/components/Page';
import { tabs, navigation } from '@/lang';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import { LoadConfig } from '@/wailsjs/go/main/App';
import { Spinner } from '@/components/elements/Generic';
import { classNames, tryParseJSONObject } from '@/helpers';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Settings, { Launcher, Aliases } from '@/components/pages/Settings';

const TabSwitcher = () => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);
	const location = useLocation();
	const blur = false;

	return (
		<div tw="pt-12">
			<div
				tw="relative p-5 sm:pb-0 fixed w-full z-10 shadow-xl"
				css={AppSettings!.blur ? tw`bg-neutral-700 backdrop-blur-lg backdrop-filter bg-opacity-[0.34]` : tw`bg-neutral-800`}>
				<nav tw="-mb-px flex space-x-8">
					{tabs.map((tab) => (
						<Link
							key={tab.name}
							to={tab.href}
							className={classNames(
								location.pathname.startsWith(tab.href)
									? 'border-rose-600 text-rose-500'
									: 'border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-300',
								'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition'
							)}>
							{tab.name}
						</Link>
					))}
					<button
						onClick={() => BrowserOpenURL('https://me.lilithmod.xyz')}
						className="border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition">
						Global Config
					</button>
				</nav>
			</div>
		</div>
	);
};

const Sidebar = () => {
	const location = useLocation();

	return (
		<div tw="flex w-64 flex-col fixed inset-y-0 mt-[3.2rem]">
			<div tw="flex-1 flex flex-col min-h-0 bg-neutral-800">
				<div tw="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
					<nav tw="-mt-3 flex-1 px-2 space-y-1 transition">
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={classNames(
									location.pathname.startsWith(item.href) ? 'bg-neutral-900 text-white' : 'text-neutral-300 hover:bg-neutral-700 hover:text-white',
									'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition'
								)}>
								<item.icon
									className={classNames(
										location.pathname.startsWith(item.href) ? 'text-neutral-300' : 'text-neutral-400 group-hover:text-neutral-300',
										'mr-3 flex-shrink-0 h-6 w-6 transition'
									)}
									aria-hidden="true"
								/>
								{item.name}
							</Link>
						))}
					</nav>
				</div>
				<div tw="flex-shrink-0 flex bg-neutral-700">
					<button onClick={() => BrowserOpenURL('https://me.lilithmod.xyz')} className="group" tw="flex-shrink-0 w-full block">
						<div tw="flex items-center ml-1">
							<div tw="transition flex items-center px-2 py-2 text-sm font-medium rounded-md text-neutral-300 group-hover:text-white">
								<ExternalLinkIcon
									className="transition group-hover:text-neutral-200 text-neutral-400 mr-3 flex-shrink-0 h-5 w-5"
									aria-hidden="true"
								/>
								Global Config
							</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

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
						sidebar: JSON.parse(data).launcher.sidebar,
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
			<Fragment>
				{AppSettings!.sidebar ? <Sidebar /> : <TabSwitcher />}
				<div css={AppSettings!.sidebar && tw`ml-64`}>
					{loaded ? (
						<Routes>
							<Route path="/general" element={<Page component={Settings} id="settings-general" config={lilithConfig} />} />
							<Route path="/launcher" element={<Page component={Launcher} id="settings-launcher" config={lilithConfig} />} />
							<Route path="/aliases" element={<Page component={Aliases} id="settings-aliases" config={lilithConfig} />} />
						</Routes>
					) : (
						<Routes>
							<Route path="/launcher" element={<Page component={Launcher} id="settings-launcher" config={lilithConfig} />} />
							<Route
								path="/*"
								element={
									<div>
										<div tw="w-full pt-[17rem] flex justify-center items-center">
											<Spinner size="large" />
										</div>
										<p tw="flex justify-center items-center mt-3 text-neutral-200 font-medium text-lg">
											Please start lilith to generate a config file.
										</p>
									</div>
								}
							/>
						</Routes>
					)}
				</div>
			</Fragment>
		);
	}
};

export default SettingsRouter;

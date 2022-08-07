import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import ky from 'ky';
import Page from '@/components/Page';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Settings, { Launcher, Aliases } from '@/components/pages/Settings';
import { CogIcon, LinkIcon, AdjustmentsIcon } from '@heroicons/react/outline';

const tabs = [
	{ name: 'General', href: '/settings/general' },
	{ name: 'Aliases', href: '/settings/aliases' },
	{ name: 'Launcher', href: '/settings/launcher' },
];

const navigation = [
	{ name: 'General', href: '/settings/general', icon: CogIcon },
	{ name: 'Aliases', href: '/settings/aliases', icon: LinkIcon },
	{ name: 'Launcher', href: '/settings/launcher', icon: AdjustmentsIcon },
];

const TabSwitcher = () => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);
	const location = useLocation();
	const blur = false;

	return (
		<div tw="pt-12">
			<div
				tw="relative p-5 sm:pb-0 fixed w-full z-10 shadow-xl"
				css={AppSettings!.blur ? tw`bg-neutral-700 backdrop-blur-lg backdrop-filter bg-opacity-[0.34]` : tw`bg-neutral-800`}
			>
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
							)}
						>
							{tab.name}
						</Link>
					))}
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
								)}
							>
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
			</div>
		</div>
	);
};

const SettingsRouter = () => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);
	const [lilithConfig, setLilithConfig] = useState({});
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		ky.get('lilith/store.json')
			.json()
			.then((data: any) => {
				console.log(data);
				setLilithConfig(data);
				setLoaded(true);
			});
	}, []);

	if (!loaded) {
		return <div>loading...</div>;
	} else {
		return (
			<Fragment>
				{AppSettings!.sidebar ? <Sidebar /> : <TabSwitcher />}
				<div css={AppSettings!.sidebar && tw`ml-64`}>
					<Routes>
						<Route path="/general" element={<Page component={Settings} id="settings-general" config={lilithConfig} />} />
						<Route path="/launcher" element={<Page component={Launcher} id="settings-launcher" config={lilithConfig} />} />
						<Route path="/aliases" element={<Page component={Aliases} id="settings-aliases" config={lilithConfig} />} />
					</Routes>
				</div>
			</Fragment>
		);
	}
};

export default SettingsRouter;

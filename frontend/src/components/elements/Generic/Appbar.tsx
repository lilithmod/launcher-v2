import React from 'react';

import tw from 'twin.macro';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { LilithLogo } from '@/assets/images';
import { Link, useLocation } from 'react-router-dom';
import { XIcon, MinusIcon } from '@heroicons/react/outline';
import { Quit, BrowserOpenURL, WindowMinimise } from '@/wailsjs/runtime';

const NavLink = (props: { to: string; name: any }) => {
	const location = useLocation();

	return (
		<Link
			to={props.to}
			css={[
				tw`text-base font-semibold border-b-2 text-neutral-300 -my-2 px-2 py-1 transition border-transparent hover:border-rose-500`,
				location.pathname.startsWith(`/${props.to.split('/')[1]}`) && tw`border-rose-500 pointer-events-none`,
			]}>
			{props.name}
		</Link>
	);
};

const Appbar = () => {
	const location = useLocation();
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);

	const PathBasedStyles = (pathname: String) => {
		return pathname != '/launch'
		? AppSettings!.blur
			? tw`bg-neutral-700 backdrop-blur-lg backdrop-filter bg-opacity-[0.34]`
			: AppSettings!.sidebar && tw`bg-neutral-800 shadow-xl`
		: tw`pt-3.5`
	}

	return (
		<div
			tw="max-w-7xl mx-auto px-6 fixed w-full z-50 pt-2"
			css={PathBasedStyles(location.pathname)}
			className="draggable">
			<div tw="flex justify-between items-center py-2 space-x-6">
				<div tw="flex justify-start lg:w-0 lg:flex-1 font-bold text-white text-xl">
					<img src={LilithLogo} css={location.pathname == '/launch' ? tw`hidden` : tw`h-9`} alt="Lilith" />
				</div>
				<NavLink to="/launch" name="Home" />
				<NavLink to="/settings/general" name="Settings" />
				<button
					onClick={() => BrowserOpenURL('https://lilith.rip/pricing')}
					tw="text-base font-semibold border-b-2 text-neutral-300 -my-2 px-2 py-1 transition border-transparent hover:border-rose-500 hover:bg-opacity-50">
					Plans
				</button>
				<div tw="flex items-center justify-end md:flex-1 lg:w-0">
					<button onClick={() => WindowMinimise()} tw="whitespace-nowrap text-base font-medium text-neutral-500 hover:text-white transition">
						<MinusIcon tw="w-6 h-6 stroke-1" />
					</button>
					<button onClick={() => Quit()} tw="whitespace-nowrap text-base font-medium text-neutral-500 hover:text-white transition ml-5">
						<XIcon tw="w-6 h-6 stroke-1" />
					</button>
				</div>
			</div>
		</div>
	);
};
export default Appbar;

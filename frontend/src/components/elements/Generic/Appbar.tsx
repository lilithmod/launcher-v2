import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { LilithLogo } from '@/assets/images';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { XIcon, MinusIcon } from '@heroicons/react/outline';
import { Menu, Popover, Transition } from '@headlessui/react';
import { Quit, BrowserOpenURL, WindowMinimise } from '@/wailsjs/runtime';

const NavLink = (props: { to: string; name: any }) => {
	const location = useLocation();

	return (
		<Link
			to={props.to}
			css={[
				tw`text-sm font-light border-b-2 text-neutral-300 -my-2 px-2.5 py-1 transition border-transparent hover:border-rose-500`,
				location.pathname.startsWith(`/${props.to.split('/')[1]}`) && tw`font-medium border-rose-500 pointer-events-none`,
			]}>
			{props.name}
		</Link>
	);
};

const Appbar = () => {
	const location = useLocation();
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);

	return (
		<div
			tw="max-w-7xl mx-auto px-6 fixed w-full z-50 pt-2"
			css={[location.pathname != '/launch' ? tw`bg-neutral-800` : tw`pt-2.5`, AppSettings?.sidebar && tw`shadow-xl`]}
			className="draggable">
			<div tw="flex justify-between items-center py-2 space-x-4">
				<div tw="flex justify-start lg:w-0 lg:flex-1 font-bold text-white text-xl">
					<img src={LilithLogo} css={location.pathname == '/launch' ? tw`h-16 -mb-10 ml-5 mt-2` : tw`h-9`} alt="Lilith" />
				</div>
				<NavLink to="/launch" name="Home" />
				<NavLink to="/settings/general" name="Settings" />
				<button
					onClick={() => BrowserOpenURL('https://lilith.rip/pricing')}
					tw="text-sm font-light border-b-2 text-neutral-300 -my-2 px-2.5 py-1 transition border-transparent hover:border-rose-500 hover:bg-opacity-50">
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

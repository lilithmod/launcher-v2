import React, { useEffect, useState, Fragment } from 'react';

import tw from 'twin.macro';
import { Quit } from '@wailsapp/runtime';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { LilithLogo } from '@/assets/images';
import { Link, useLocation } from 'react-router-dom';
import { XIcon, MinusIcon } from '@heroicons/react/solid';
import { Menu, Popover, Transition } from '@headlessui/react';
import { classNames } from '@/helpers';
import { ChevronDownIcon } from '@heroicons/react/solid';

const NavLink = (props: { to: string; name: string }) => {
	const location = useLocation();

	return (
		<Link
			to={props.to}
			css={[
				tw`text-base font-medium text-neutral-500 rounded hover:(bg-neutral-700 bg-opacity-30 text-rose-100) -my-2 px-2.5 py-1 transition border-2 border-transparent`,
				location.pathname.startsWith(`/${props.to.split('/')[1]}`) &&
					tw`text-neutral-300 hover:text-neutral-300 border-neutral-700 bg-neutral-700 bg-opacity-60 hover:(border-neutral-700 bg-neutral-700 bg-opacity-60) pointer-events-none`,
			]}
		>
			{props.name}
		</Link>
	);
};

const Appbar = () => {
	const AppSettings = useStoreState((state: ApplicationStore) => state.settings.data);
	const UserData = useStoreState((state: ApplicationStore) => state.user.data);

	return (
		<div tw="max-w-7xl mx-auto px-6 fixed w-full z-50 bg-neutral-800" css={AppSettings?.sidebar && tw`shadow-xl`} data-wails-drag>
			<div tw="flex justify-between items-center py-2 space-x-4">
				<div tw="flex justify-start lg:w-0 lg:flex-1 font-bold text-white text-xl">
					<img src={LilithLogo} tw="h-9" alt="Lilith" />
				</div>
				<NavLink to="/launch" name="Home" />
				<NavLink to="/settings/general" name="Settings" />
				<NavLink to="/about" name="About" />
				<NavLink to="/premium" name="Premium" />
				<div tw="flex items-center justify-end md:flex-1 lg:w-0">
					{UserData?.token ? (
						<Menu as="div" className="relative inline-block text-left mr-3">
							<Menu.Button className="inline-flex justify-center text-sm font-medium text-neutral-300 hover:text-neutral-200 mt-1 focus:outline-none">
								<img className="h-5 w-5 rounded-full mr-2" src={UserData?.profile.avatar} alt="" />
								{UserData?.profile.username}
								<ChevronDownIcon className="ml-1 h-5 w-5 mt-[1px]" aria-hidden="true" />
							</Menu.Button>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-100"
								enterFrom="transform opacity-0 scale-95"
								enterTo="transform opacity-100 scale-100"
								leave="transition ease-in duration-75"
								leaveFrom="transform opacity-100 scale-100"
								leaveTo="transform opacity-0 scale-95"
							>
								<Menu.Items className="origin-top-right absolute right-0 mt-0.5 w-56 rounded-md shadow-lg bg-neutral-700 backdrop-blur-lg backdrop-filter bg-opacity-80 ring-1 ring-black ring-opacity-5 divide-y divide-neutral-600 focus:outline-none z-50">
									<div className="px-4 py-3">
										<p className="text-sm text-neutral-300">Signed in as</p>
										<p className="text-sm font-medium text-white truncate">{UserData?.email}</p>
									</div>
									<div className="py-1">
										<Menu.Item>
											{({ active }) => (
												<a
													href="#"
													className={classNames(
														active ? 'bg-neutral-600 backdrop-blur-lg backdrop-filter bg-opacity-80 text-neutral-300' : 'text-neutral-400',
														'block px-4 py-2 text-sm'
													)}
												>
													Sessions
												</a>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<a
													href="#"
													className={classNames(
														active ? 'bg-neutral-600 backdrop-blur-lg backdrop-filter bg-opacity-80 text-neutral-300' : 'text-neutral-400',
														'block px-4 py-2 text-sm'
													)}
												>
													Discord
												</a>
											)}
										</Menu.Item>
									</div>
									<div className="py-1">
										<Menu.Item>
											{({ active }) => (
												<button
													className={classNames(
														active ? 'bg-neutral-600 backdrop-blur-lg backdrop-filter bg-opacity-80 text-neutral-300' : 'text-neutral-400',
														'block w-full text-left px-4 py-2 text-sm'
													)}
												>
													Sign out
												</button>
											)}
										</Menu.Item>
									</div>
								</Menu.Items>
							</Transition>
						</Menu>
					) : (
						<Link to="/login" tw="text-sm font-medium text-neutral-300 hover:text-neutral-200 mr-3 transition">
							Sign in
						</Link>
					)}
					<button
						onClick={() => Quit()}
						tw="-mr-3.5 rounded-md p-1.5 bg-neutral-700 bg-opacity-60 whitespace-nowrap text-base font-medium text-neutral-300 hover:bg-red-500 hover:text-white transition"
					>
						<XIcon tw="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
};
export default Appbar;
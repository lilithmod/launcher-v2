import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import { PageContentBlock } from '@/components/elements/Generic';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import { BadgeCheckIcon, CalendarIcon, FastForwardIcon } from '@heroicons/react/outline';

const incentives = [
	{ name: 'Autododge Players', icon: FastForwardIcon },
	{ name: 'Role Icons (Discord)', icon: BadgeCheckIcon },
	{ name: 'More coming soon in 1.0', icon: CalendarIcon },
];

const Premium = (props: { id: string }) => {
	return (
		<PageContentBlock pageId={props.id}>
			<div tw="w-full h-screen flex justify-center items-center">
				<div tw="rounded-lg bg-neutral-800 p-6">
					<h1 tw="ml-1 text-rose-200 font-black text-3xl">Lilith Premium</h1>
					<h2 tw="ml-1 text-rose-300 font-black text-xl">$12.50</h2>
					<div className="my-3 space-y-3">
						{incentives.map((incentive) => (
							<div key={incentive.name} className="flex items-center text-sm font-medium text-rose-400">
								<incentive.icon className="mr-2 flex-none w-6 h-6" aria-hidden="true" />
								<p>{incentive.name}</p>
							</div>
						))}
					</div>

					<button
						onClick={() => BrowserOpenURL('https://discord.gg/lilith')}
						type="button"
						tw="mt-1 inline-flex items-center px-20 py-3 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-[#A6344D] hover:bg-[#84293D] focus:outline-none transition hover:text-rose-100"
					>
						Join our discord
					</button>
					<p className="ml-2 mt-2 -mb-1 text-base text-neutral-400">
						Visit the <pre tw="inline">#store</pre> channel to purchase
					</p>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Premium;

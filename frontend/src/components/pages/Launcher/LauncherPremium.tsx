import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import http from '@/api/http';
import { BrowserOpenURL } from '@/wailsjs/runtime';
import { IFeaturesData, IPremiumData } from '#types/launcher';
import { PageContentBlock, Heroicons } from '@/components/elements/Generic';

const Premium = (props: { id: string }) => {
	const [PremiumData, setPremiumData] = useState<IPremiumData>();

	useEffect(() => {
		http.get('https://api.lilith.rip/launcher/premium').then((data: any) => {
			setPremiumData(JSON.parse(data));
		});
	}, []);

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="w-full h-screen flex justify-center items-center">
				<div tw="rounded-lg bg-neutral-800 p-6">
					<h1 tw="ml-1 text-rose-200 font-black text-3xl">Lilith Pro</h1>
					<h2 tw="ml-1 text-rose-300 font-black text-xl">${PremiumData?.price.toFixed(2)}</h2>
					<div className="my-3 space-y-3">
						{PremiumData?.features.map((incentive: IFeaturesData) => (
							<div key={incentive.description} className="flex items-center text-sm font-medium text-rose-400">
								<Heroicons icon={incentive.icon} className="mr-2 flex-none w-6 h-6" outline />
								<p>{incentive.description}</p>
							</div>
						))}
					</div>

					<button
						onClick={() => BrowserOpenURL('https://www.patreon.com/lilithmod')}
						type="button"
						tw="mt-1 inline-flex items-center px-20 py-3 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-[#A6344D] hover:bg-[#84293D] focus:outline-none transition hover:text-rose-100"
					>
						Upgrade Now!
					</button>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Premium;

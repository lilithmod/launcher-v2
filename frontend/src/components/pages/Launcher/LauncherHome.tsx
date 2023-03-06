import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import http from '@/api/http';
import Convert from 'ansi-to-html';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import { LauncherWrapper } from '@/wailsjs/go/main/App';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BrowserOpenURL, EventsOn, EventsEmit } from '@/wailsjs/runtime';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { ChevronDownIcon, ExclamationIcon, XIcon } from '@heroicons/react/solid';

const Base = (props: { id: string }) => {
	const ButtonData = useStoreState((state: ApplicationStore) => state.button.data);
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);
	const ButtonStartStatus = ButtonData !== 'ready to launch';
	const parser = new Convert();

	const [version, setVersion] = useState('0.0.0');

	useEffect(() => {
		http.get('https://api.lilith.rip/versions/latest').then((data: any) => {
			setVersion(JSON.parse(data).version);
		});
	}, []);

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="bg-[url('/assets/images/BackgroundImage.png')] h-screen bg-cover">
				<div tw="pt-52 pl-20">
					<h1 tw="text-5xl text-white font-bold shadow">Lilith Launcher</h1>
					<p tw="text-neutral-500 shadow text-lg">{ButtonStartStatus ? ButtonData : `v${version}`}</p>
					<div tw="pt-8">
						<button
							disabled={ButtonStartStatus}
							className="group relative z-0 inline-flex shadow-sm rounded-lg duration-500 transition bg-rose-500/[0.84] shadow-md shadow-rose-600/40 ease-in-out hover:scale-[1.03] hover:shadow-rose-500/50 disabled:shadow-purple-500/80 disabled:bg-purple-500 border border-rose-400 disabled:border-purple-400 hover:disabled:scale-100 hover:bg-rose-500 hover:disabled:bg-purple-500"
						>
							<button
								onClick={() => {
									if (ButtonStartStatus) {
										EventsEmit('stop');
									} else {
										store.getActions().logs.reset();
										LauncherWrapper().then((data) => console.log(data));
									}
								}}
								tw="transition rounded-l-lg py-2 px-8 disabled:pointer-events-none"
							>
								<p tw="duration-500 transition font-black text-2xl text-white group-hover:drop-shadow">
									{!ButtonStartStatus && (
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 inline mr-2 -mt-0.5">
											<path
												fillRule="evenodd"
												d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									{ButtonStartStatus ? 'Stop' : 'Launch'}
								</p>
							</button>
						</button>
					</div>
				</div>
				{/* <button
					tw="p-10 bg-red-500 text-white"
					onClick={() => {
						EventsEmit('stop');
					}}
				>
					Stop lilith
				</button> */}
				{/* <div className="sm:flex sm:items-start h-[20rem] overflow-y-scroll">
					<pre tw="text-neutral-200 text-sm font-medium">
						{Logs.map((item: string) => (
							<div tw="drop-shadow-md" dangerouslySetInnerHTML={{ __html: parser.toHtml(item) }} />
						))}
					</pre>
				</div> */}
			</div>
		</PageContentBlock>
	);
};

export default Base;

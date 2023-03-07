import React, { useState, useEffect, Fragment } from 'react';

import tw from 'twin.macro';
import Convert from 'ansi-to-html';
import { classNames } from '@/helpers';
import { useStoreState } from 'easy-peasy';
import { BackgroundImage } from '@/assets/images';
import { store, ApplicationStore } from '@/state';
import { LaunchLilith } from '@/wailsjs/go/main/App';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BrowserOpenURL, EventsOn, EventsEmit } from '@/wailsjs/runtime';
import { PageContentBlock, Spinner } from '@/components/elements/Generic';
import { ChevronDownIcon, ExclamationIcon, XIcon } from '@heroicons/react/solid';

const Console = () => {
	const Logs = useStoreState((state: ApplicationStore) => state.logs.data);
	const parser = new Convert();

	return (
		<div tw="sm:flex sm:items-start h-[30.3rem] overflow-y-scroll p-4 pb-4 z-40 border-t border-l border-r border-neutral-700 bg-neutral-800 h-[30.4rem] mt-40 w-[70rem] shadow-xl rounded-t-2xl mx-5">
			<pre tw="drop-shadow-md text-neutral-200 text-sm font-medium">
				{Logs.map((item: string, index: number) => {
					if (Logs[index].endsWith('{*lilith_redraw_line*}')) {
						Logs.splice(index - 1, 1);
					}

					return <div dangerouslySetInnerHTML={{ __html: parser.toHtml(item.replace('{*lilith_redraw_line*}', '')) }} />;
				})}
			</pre>
		</div>
	);
};

const Base = (props: { id: string }) => {
	const ButtonData = useStoreState((state: ApplicationStore) => state.button.data);
	const UserStore = useStoreState((state: ApplicationStore) => state.user.data);
	const ButtonStartStatus = ButtonData !== 'ready to launch';

	return (
		<PageContentBlock pageId={props.id}>
			<div tw="overflow-hidden">
				<Transition
					show={ButtonStartStatus}
					className="transition-all fixed overflow-hidden"
					enter="transition ease-in-out duration-[400ms] transform"
					enterFrom="translate-y-full"
					enterTo="-translate-y-0"
					leave="transition ease-in-out duration-[400ms] transform"
					leaveFrom="-translate-y-0"
					leaveTo="translate-y-full"
				>
					<Console />
				</Transition>
			</div>

			<div tw="h-screen bg-cover" style={{ backgroundImage: `url(${BackgroundImage})` }}>
				<div tw="pt-52 pl-20">
					<h1 tw="text-5xl text-white font-bold duration-[400ms] transition">Lilith Launcher</h1>
					<p
						tw="text-neutral-500 text-lg"
						css={ButtonStartStatus && tw`-translate-y-36 mt-1 -translate-x-12 text-lg font-bold text-neutral-200 duration-[400ms] transition`}
					>
						{ButtonStartStatus ? ButtonData : `v${UserStore!.version}`}
					</p>
					<div tw="pt-8">
						<button
							disabled={ButtonStartStatus}
							className="z-50 disabled:-translate-y-[13.7rem] disabled:translate-x-[59.2rem] group relative z-0 inline-flex shadow-sm rounded-lg duration-[400ms] transition bg-rose-500/[0.84] shadow-md shadow-rose-600/40 ease-in-out hover:scale-[1.03] hover:shadow-rose-500/50 disabled:hover:shadow-purple-500/80 disabled:bg-purple-500 border border-rose-400 disabled:border-purple-400 disabled:scale-[0.80] hover:disabled:scale-[0.82] hover:bg-rose-500 hover:disabled:bg-purple-500"
						>
							<button
								onClick={() => {
									if (ButtonStartStatus) {
										EventsEmit('stop');
									} else {
										store.getActions().logs.reset();
										LaunchLilith().then((data) => console.log(data));
									}
								}}
								tw="transition rounded-l-lg py-2 px-8 disabled:pointer-events-none"
							>
								<p tw="duration-[400ms] transition font-black text-2xl text-white group-hover:drop-shadow">
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
					<button onClick={() => BrowserOpenURL('https://docs.lilith.rip')} tw="text-sm mt-7">
						<span tw="text-white font-semibold hover:text-rose-300 transition">Documentation</span>{' '}
						<ExternalLinkIcon tw="font-light w-3.5 h-3.5 inline -mt-0.5 stroke-1 text-neutral-200" />
					</button>
					<br />
					<button onClick={() => BrowserOpenURL('https://lilith.rip/faq')} tw="text-sm">
						<span tw="text-white font-semibold hover:text-rose-300 transition">FAQ</span>{' '}
						<ExternalLinkIcon tw="font-light w-3.5 h-3.5 inline -mt-0.5 stroke-1 text-neutral-200" />
					</button>
				</div>
				<div css={ButtonStartStatus && tw`hidden`}>
					<div tw="absolute bottom-2 left-20 z-0">
						<button onClick={() => BrowserOpenURL('https://discord.com/invite/lilith')} tw="transition text-neutral-300 opacity-60 hover:opacity-100">
							<svg tw="w-5 h-5" viewBox="0 -28.5 256 256" version="1.1" preserveAspectRatio="xMidYMid">
								<g>
									<path
										d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
										fill="currentColor"
										fillRule="nonzero"
									></path>
								</g>
							</svg>
						</button>
						<button
							onClick={() => BrowserOpenURL('https://github.com/lilithmod/launcher-v2')}
							tw="transition text-neutral-300 opacity-60 hover:opacity-100 ml-3.5"
						>
							<svg xmlns="http://www.w3.org/2000/svg" tw="w-5 h-5" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									fillRule="nonzero"
									d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</PageContentBlock>
	);
};

export default Base;

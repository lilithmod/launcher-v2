import React, { Fragment } from 'react';

import tw from 'twin.macro';
import { Dialog, Transition } from '@headlessui/react';

const Modal = (props: { open: any; setOpen: any; content: any }) => {
	return (
		<Transition.Root show={props.open} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={() => props.setOpen(true)}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-neutral-900 backdrop-blur-sm bg-opacity-75 transition-opacity" />
					</Transition.Child>
					<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<div className="inline-block align-bottom bg-neutral-800 border border-neutral-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<div>
								<div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-600`}>{props.content.icon}</div>
								<div className="mt-3 text-center sm:mt-5">
									<Dialog.Title as="h3" className="text-lg leading-6 font-semibold text-white">
										{props.content.title}
									</Dialog.Title>
									<div className="mt-2">
										<p tw="text-sm text-neutral-400">{props.content.description}</p>
									</div>
								</div>
							</div>
							<div className="mt-5 sm:mt-6">
								<button
									type="button"
									tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium ring-0 outline-none text-white sm:text-sm bg-rose-500 hover:bg-rose-600 transition"
									onClick={props.content.function}>
									{props.content.button}
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

export default Modal;

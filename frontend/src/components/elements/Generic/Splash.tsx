import { Fragment } from 'react';
import { LilithLogo } from '@/assets/images';
import { Dialog, Transition } from '@headlessui/react';

const Splash = (props: { show: boolean; children: any }) => (
	<Fragment>
		<Transition.Root show={props.show} as={Fragment}>
			<Dialog as="div" className="fixed z-50 inset-0 overflow-y-auto" onClose={() => {}}>
				<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<Dialog.Overlay className="fixed inset-0 bg-neutral-950 backdrop-blur bg-opacity-75 transition-opacity" />
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
						<div className="inline-block align-bottom px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
							<img src={LilithLogo} tw="w-96" />
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
		{props.children}
	</Fragment>
);

export default Splash;

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

export { tabs, navigation };

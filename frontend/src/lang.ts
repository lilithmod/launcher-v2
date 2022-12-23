import { UpdateBanner, LauncherBanner } from '@/assets/images';
import { BadgeCheckIcon, CalendarIcon, FastForwardIcon } from '@heroicons/react/outline';
import { CogIcon, LinkIcon, AdjustmentsIcon, ExternalLinkIcon } from '@heroicons/react/outline';

const posts = [
	{
		uuid: 0,
		title: 'Launcher Released',
		href: 'https://github.com/lilithmod/launcher-v2',
		description: 'Lilith has been packaged as launcher for your convenience. You can now change config values directly from the launcher.',
		imageUrl: LauncherBanner,
		author: {
			name: 'theMackabu',
			imageUrl: 'https://cdn.discordapp.com/avatars/721111497392128162/fe3fb11df486bf43853c8e2aaa1ac29a.webp?size=256',
		},
	},
	{
		uuid: 1,
		title: 'Lilith 1.0.5',
		href: 'https://lilith.rip/',
		description: `- Attempted to fix ping display with the proxy<br>- Fixed the Requeueing... title not clearing`,
		imageUrl: UpdateBanner,
		author: {
			name: 'Nea',
			imageUrl: 'https://cdn.discordapp.com/avatars/941359439825477663/c1a3a0d90a168499dfa83bc058590cf2.webp?size=160',
		},
	},
	{
		uuid: 2,
		title: 'Lilith 1.0.4',
		href: 'https://lilith.rip/',
		description: `- Fixed the logging of an unconcerning bug with autodeletion`,
		imageUrl: UpdateBanner,
		author: {
			name: 'Nea',
			imageUrl: 'https://cdn.discordapp.com/avatars/941359439825477663/c1a3a0d90a168499dfa83bc058590cf2.webp?size=160',
		},
	},
];

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

export { posts, tabs, navigation };

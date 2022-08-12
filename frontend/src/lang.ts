import { UpdateBanner, LauncherBanner } from '@/assets/images';
import { BadgeCheckIcon, CalendarIcon, FastForwardIcon } from '@heroicons/react/outline';
import { CogIcon, LinkIcon, AdjustmentsIcon, ExternalLinkIcon } from '@heroicons/react/outline';

const posts = [
	{
		uuid: 0,
		title: 'Launcher Released',
		href: 'https://google.com',
		description:
			'The new launcher is now released.<br>Lilith has been packaged as launcher for your convenience. You can now change config values directly from the launcher too.',
		imageUrl: LauncherBanner,
		author: {
			name: 'theMackabu',
			imageUrl: 'https://cdn.discordapp.com/avatars/721111497392128162/fe3fb11df486bf43853c8e2aaa1ac29a.webp?size=256',
		},
	},
	{
		uuid: 1,
		title: 'Lilith 1.0.0 Alpha 15',
		href: '#',
		description: `- Autododge players (premium/booster required)<br>- Bedwars /sc command added<br>- Added OP Duels and Skywars Duels stats<br>- Minor queuestats improvements`,
		imageUrl: UpdateBanner,
		author: {
			name: 'Nea',
			imageUrl: 'https://cdn.discordapp.com/avatars/941359439825477663/ecedbdb8d7d8c8c545b837398fbe24b1.webp?size=256',
		},
	},
	{
		uuid: 2,
		title: 'Lilith 1.0.0 Alpha 14',
		href: '#',
		description: `- Fixed queuestats error<br>- Fixed Bedwars FKDR<br>- Tweaked Bedwars patterns<br>- Minor stability fixes`,
		imageUrl: UpdateBanner,
		author: {
			name: 'Nea',
			imageUrl: 'https://cdn.discordapp.com/avatars/941359439825477663/ecedbdb8d7d8c8c545b837398fbe24b1.webp?size=256',
		},
	},
];

const incentives = [
	{ name: 'Autododge Players', icon: FastForwardIcon },
	{ name: 'Role Icons (Discord)', icon: BadgeCheckIcon },
	{ name: 'More coming soon in 1.0', icon: CalendarIcon },
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

export { posts, incentives, tabs, navigation };

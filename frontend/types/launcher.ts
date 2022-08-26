interface IFeaturesData {
	id: number;
	icon: any;
	description: string;
}

interface IPremiumData {
	price: number;
	features: Array<IFeaturesData>;
}

export type { IFeaturesData, IPremiumData };

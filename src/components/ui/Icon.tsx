import {
	IconBath,
	IconBed,
	IconBrandFacebook,
	IconBrandInstagram,
	IconBrandLinkedin,
	IconCarGarage,
	IconChevronLeft,
	IconChevronRight,
	IconHome,
	IconMenu2,
	IconMessages,
	IconMeterSquare,
	IconX,
} from '@tabler/icons-react';

type IconType =
	| 'bed'
	| 'garage'
	| 'landArea'
	| 'bath'
	| 'chevron-left'
	| 'chevron-right'
	| 'messages'
	| 'facebook'
	| 'instagram'
	| 'linkedin'
	| 'times'
	| 'lines';

export const Icon = ({ type, color, stroke = 1 }: { type: IconType; color?: string; stroke?: number }) => {
	switch (type) {
		case 'chevron-left':
			return <IconChevronLeft color={color} stroke={stroke} />;
		case 'chevron-right':
			return <IconChevronRight color={color} stroke={stroke} />;
		case 'bed':
			return <IconBed color={color} stroke={stroke} />;
		case 'garage':
			return <IconCarGarage color={color} stroke={stroke} />;
		case 'bath':
			return <IconBath color={color} stroke={stroke} />;
		case 'landArea':
			return <IconMeterSquare color={color} stroke={stroke} />;
		case 'messages':
			return <IconMessages color={color} stroke={stroke} />;
		case 'facebook':
			return <IconBrandFacebook color={color} stroke={stroke} />;
		case 'instagram':
			return <IconBrandInstagram color={color} stroke={stroke} />;
		case 'linkedin':
			return <IconBrandLinkedin color={color} stroke={stroke} />;
		case 'times':
			return <IconX color={color} stroke={stroke} />;
		case 'lines':
			return <IconMenu2 color={color} stroke={stroke} />;

		default:
			return <IconHome color={color} stroke={stroke} />;
	}
};

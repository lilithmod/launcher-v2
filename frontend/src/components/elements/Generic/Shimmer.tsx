import React, { CSSProperties } from 'react';

import { cn } from '@/helpers';

export interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	shimmerColor?: string;
	shimmerSize?: string;
	borderRadius?: string;
	shimmerDuration?: string;
	background?: string;
	className?: string;
	children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
	(
		{
			shimmerColor = '#EE2C5C',
			shimmerSize = '0.5px',
			shimmerDuration = '3s',
			borderRadius = '0.6rem',
			background = 'rgb(35 35 35)',
			className,
			children,
			...props
		},
		ref,
	) => {
		return (
			<button
				style={
					{
						'--spread': '90deg',
						'--shimmer-color': shimmerColor,
						'--radius': borderRadius,
						'--speed': shimmerDuration,
						'--cut': shimmerSize,
						'--bg': background,
					} as CSSProperties
				}
				className={cn(
					'group transition relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] border-neutral-700 hover:border-rose-500/30 hover:scale-[1.02]',
					'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]',
					className,
				)}
				ref={ref}
				{...props}>
				<div className={cn('-z-30 blur-[2px]', 'absolute inset-0 overflow-visible [container-type:size]')}>
					<div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
						<div className="animate-spin-around absolute inset-[-100%] w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
					</div>
				</div>
				{children}

				<div
					className={cn(
						'insert-0 absolute h-full w-full',
						'rounded-lg px-4 py-1.5 text-sm font-medium',
						'transform-gpu transition-all duration-300 ease-in-out',
						'group-hover:bg-rose-500/5',
						'group-hover:shadow-[inset_0_-6px_10px_#E0214B1f]',
						'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
					)}
				/>

				<div className={cn('absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]')} />
			</button>
		);
	},
);

ShimmerButton.displayName = 'ShimmerButton';

export default ShimmerButton;

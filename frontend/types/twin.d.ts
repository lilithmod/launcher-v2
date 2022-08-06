// types/twin.d.ts
import 'twin.macro';
import { css as cssImport } from '@emotion/react';
import { CSSInterpolation } from '@emotion/serialize';
import styledImport from '@emotion/styled';

declare module 'twin.macro' {
	const styled: typeof styledImport;
	const css: typeof cssImport;
}

declare module 'react' {
	interface HTMLAttributes<T> extends DOMAttributes<T> {
		css?: CSSInterpolation;
		tw?: string;
	}
	interface SVGProps<T> extends SVGProps<SVGSVGElement> {
		css?: CSSInterpolation;
		tw?: string;
	}
}

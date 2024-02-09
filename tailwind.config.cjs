const xs_px = 360
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [],
	theme: {
		// Remove the following screen breakpoint or add other breakpoints
		// if one breakpoint is not enough for you
		screens: {
			xs: `${xs_px}px`,
			sm: '640px',
		},
		// Uncomment the following extend
		// if existing Tailwind color palette will be used
		// extend: {
		textColor: {
			skin: {
				base: withOpacity('--color-text-base'),
				accent: withOpacity('--color-accent'),
				inverted: withOpacity('--color-fill'),
			},
		},
		backgroundColor: {
			skin: {
				fill: withOpacity('--color-fill'),
				accent: withOpacity('--color-accent'),
				inverted: withOpacity('--color-text-base'),
				card: withOpacity('--color-card'),
				'card-muted': withOpacity('--color-card-muted'),
			},
		},
		outlineColor: {
			skin: {
				fill: withOpacity('--color-accent'),
			},
		},
		borderColor: {
			skin: {
				line: withOpacity('--color-border'),
				fill: withOpacity('--color-text-base'),
				accent: withOpacity('--color-accent'),
			},
		},
		fill: {
			skin: {
				base: withOpacity('--color-text-base'),
				accent: withOpacity('--color-accent'),
			},
			transparent: 'transparent',
		},
		fontFamily: {
			sans: ['Atkinson Hyperlegible'],
			serif: ['Atkinson Hyperlegible'],
			mono: ['JetBrains Mono', 'monospace'],
		},
		extend: {
			boxShadow: {
				// highlight: `0 0 10px ${withOpacity('--color-accent')}`
				highlight: withOpacity('--color-accent')
			},
			colors: {
				highlight: withOpacity('--color-accent'),
			},
		},
	},
	// plugins: [require('@tailwindcss/typography')],
}
function withOpacity(variableName) {
	return ({ opacityValue })=>{
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`
		}
		return `rgb(var(${variableName}))`
	}
}

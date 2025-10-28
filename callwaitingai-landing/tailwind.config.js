/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// New Blue-Green Design System
				brand: {
					blue: '#4299E1',
					blueLight: '#63B3ED',
					blueDark: '#3182CE',
					green: '#38A169',
					greenLight: '#48BB78',
					greenDark: '#2F855A',
				},
				neutral: {
					white: '#FFFFFF',
					lightBg: '#F0F8FF',
					lightGray: '#E2E8F0',
					gray: '#A0AEC0',
					darkGray: '#4A5568',
					darker: '#2D3748',
					black: '#1A202C',
				},
				status: {
					success: '#38A169',
					warning: '#ED8936',
					error: '#E53E3E',
					info: '#4299E1',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#4299E1',
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#38A169',
					foreground: '#FFFFFF',
				},
				accent: {
					DEFAULT: '#48BB78',
					foreground: '#FFFFFF',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					from: { opacity: 0, transform: 'translateY(20px)' },
					to: { opacity: 1, transform: 'translateY(0)' },
				},
				'slide-up': {
					from: { transform: 'translateY(100%)' },
					to: { transform: 'translateY(0)' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0.5 },
				},
				'pulse-ring': {
					'0%': { transform: 'scale(1)', opacity: 1 },
					'100%': { transform: 'scale(1.5)', opacity: 0 },
				},
				'wave': {
					'0%, 100%': { transform: 'scaleY(0.5)' },
					'50%': { transform: 'scaleY(1)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'wave': 'wave 1s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #4299E1 0%, #38A169 100%)',
				'gradient-primary-hover': 'linear-gradient(135deg, #3182CE 0%, #2F855A 100%)',
				'gradient-light': 'linear-gradient(135deg, #63B3ED 0%, #48BB78 100%)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}

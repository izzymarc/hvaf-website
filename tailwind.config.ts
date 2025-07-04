
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#3A9D9B',
					foreground: '#ffffff',
					100: '#CAE9EA', // soft blue
					200: '#9BD9D8',
					300: '#6BC2C0',
					400: '#3A9D9B', // earthy blue-green
					500: '#308A88',
					600: '#277776',
					700: '#1D6463',
				},
				secondary: {
					DEFAULT: '#A66A42',
					foreground: '#ffffff',
					100: '#F0E0D3',
					200: '#E1C2A7',
					300: '#D1A47C',
					400: '#A66A42', // warm clay brown
					500: '#8F5936',
					600: '#78482A',
					700: '#61371F',
				},
				accent: {
					DEFAULT: '#C79245',
					foreground: '#ffffff',
					100: '#F5E7D0',
					200: '#EBCEA2',
					300: '#E0B673',
					400: '#C79245', // gold
					500: '#B07C33',
					600: '#996721',
					700: '#82510F',
				},
				neutral: {
					DEFAULT: '#D9B08C', // beige
					foreground: '#3B2F2F',
					100: '#F7EEE5',
					200: '#EFDDCB',
					300: '#D9B08C',
					400: '#C49A6C',
					500: '#AF844D',
					600: '#9A6D3B',
					700: '#855729',
				},
				brown: {
					DEFAULT: '#3B2F2F', // deep brown
					foreground: '#ffffff',
					100: '#C6BFBF',
					200: '#9E9292',
					300: '#776464',
					400: '#3B2F2F',
					500: '#322727',
					600: '#291F1F',
					700: '#211818',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'count-up': {
					'0%': {
						'counter-increment': 'count 0'
					},
					'100%': {
						'counter-increment': 'count var(--num)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.5s ease-out',
				'fade-in': 'fade-in 0.5s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

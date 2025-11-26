/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			xl: '1rem',
  			'2xl': '1.5rem',
  			'3xl': '2rem'
  		},
  		colors: {
  			// Campus Glow-Up Palette
  			emerald: {
  				DEFAULT: '#228B22',
  				dark: '#1a6b1a',
  				light: '#2ea62e',
  				50: '#f0fdf0',
  				100: '#dcfce7',
  				500: '#228B22',
  				600: '#1a6b1a',
  				700: '#166616'
  			},
  			tangerine: {
  				DEFAULT: '#FF7518',
  				dark: '#e56510',
  				light: '#ff9045',
  				50: '#fff7ed',
  				100: '#ffedd5',
  				500: '#FF7518',
  				600: '#e56510',
  				700: '#c2540d'
  			},
  			turquoise: {
  				DEFAULT: '#00CED1',
  				dark: '#00a8ab',
  				light: '#33d8da',
  				50: '#ecfeff',
  				100: '#cffafe',
  				500: '#00CED1',
  				600: '#00a8ab',
  				700: '#0e7490'
  			},
  			lavender: {
  				DEFAULT: '#9370DB',
  				dark: '#7b5bc9',
  				light: '#a989e2',
  				50: '#faf5ff',
  				100: '#f3e8ff',
  				500: '#9370DB',
  				600: '#7b5bc9',
  				700: '#6b21a8'
  			},
  			sand: {
  				DEFAULT: '#F4E1D2',
  				dark: '#e8d0bc',
  				light: '#faf3ec',
  				50: '#fefdfb',
  				100: '#faf3ec',
  				200: '#F4E1D2',
  				300: '#e8d0bc'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
  		},
  		boxShadow: {
  			'glow-emerald': '0 0 20px rgba(34, 139, 34, 0.3)',
  			'glow-tangerine': '0 0 20px rgba(255, 117, 24, 0.3)',
  			'glow-turquoise': '0 0 20px rgba(0, 206, 209, 0.3)',
  			'glow-lavender': '0 0 20px rgba(147, 112, 219, 0.3)',
  			'card-hover': '0 20px 40px rgba(0, 0, 0, 0.1)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-10px)' }
  			},
  			'pulse-glow': {
  				'0%, 100%': { boxShadow: '0 0 20px rgba(255, 117, 24, 0.3)' },
  				'50%': { boxShadow: '0 0 40px rgba(255, 117, 24, 0.5)' }
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'float': 'float 3s ease-in-out infinite',
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'shimmer': 'shimmer 2s linear infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
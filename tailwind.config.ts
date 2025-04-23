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
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
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
				},
                dtktmt: {
                    'blue-light': '#a6d0f3',
                    'blue-medium': '#5da7e8',
                    'blue-dark': '#2b78c2',
                    'pink-light': '#ffd1e8',
                    'pink-medium': '#ffaed3',
                    'pink-dark': '#ff7fad',
                    'purple-light': '#e5d6ff',
                    'purple-medium': '#c9a9ff',
                    'yellow': '#ffde59'
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
                'float': {
                    '0%, 100%': {
                        transform: 'translateY(0)'
                    },
                    '50%': {
                        transform: 'translateY(-10px)'
                    }
                },
                'pulse-soft': {
                    '0%, 100%': {
                        transform: 'scale(1)'
                    },
                    '50%': {
                        transform: 'scale(1.05)'
                    }
                },
                'rotate-slow': {
                    '0%': {
                        transform: 'rotate(0deg)'
                    },
                    '100%': {
                        transform: 'rotate(360deg)'
                    }
                },
                'slide-in-bottom': {
                    '0%': {
                        transform: 'translateY(20px)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: '1'
                    }
                },
                'text-shimmer': {
                    '0%': {
                        backgroundPosition: '100% 50%'
                    },
                    '100%': {
                        backgroundPosition: '0% 50%'
                    }
                },
                'text-pop': {
                    '0%': {
                        transform: 'scale(1)'
                    },
                    '50%': {
                        transform: 'scale(1.1)'
                    },
                    '100%': {
                        transform: 'scale(1)'
                    }
                },
                'bounce-light': {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                    },
                    '50%': {
                        transform: 'translateY(-5px)'
                    }
                },
                'wave': {
                    '0%, 100%': {
                        transform: 'rotate(-3deg)'
                    },
                    '50%': {
                        transform: 'rotate(3deg)'
                    }
                },
                'wobble': {
                    '0%, 100%': {
                        transform: 'translateX(0)',
                    },
                    '15%': {
                        transform: 'translateX(-5px) rotate(-5deg)'
                    },
                    '30%': {
                        transform: 'translateX(4px) rotate(3deg)'
                    },
                    '45%': {
                        transform: 'translateX(-3px) rotate(-2deg)'
                    },
                    '60%': {
                        transform: 'translateX(2px) rotate(1deg)'
                    },
                    '75%': {
                        transform: 'translateX(-1px) rotate(-1deg)'
                    }
                },
                "shimmer": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" }
                },
                "gradient-slide": {
                    "0%": { backgroundPosition: "0% 50%" },
                    "100%": { backgroundPosition: "200% 50%" }
                },
                shimmer: {
                    '0%, 100%': {
                        'background-size': '300% 300%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '300% 300%',
                        'background-position': 'right center'
                    },
                },
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'float': 'float 4s infinite ease-in-out',
                'pulse-soft': 'pulse-soft 2s infinite ease-in-out',
                'rotate-slow': 'rotate-slow 15s linear infinite',
                'slide-in-bottom': 'slide-in-bottom 0.5s ease-out forwards',
                'text-shimmer': 'shimmer 5s linear infinite',
                'text-pop': 'text-pop 0.5s ease-in-out',
                'bounce-light': 'bounce-light 2s ease-in-out infinite',
                'wave': 'wave 2s ease-in-out infinite',
                'wobble': 'wobble 1s ease-in-out',
                "shimmer": "shimmer 2s infinite",
                "gradient-slide": "gradient-slide 3s linear infinite",
                'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
            fontFamily: {
                'vietnam': ['Be Vietnam Pro', 'sans-serif'],
                'montserrat': ['Montserrat', 'sans-serif'],
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

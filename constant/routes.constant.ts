export const APP_ROUTE = {
	HOME: '/',
	CHAT: '/chat',
	MINT: '/mint',
	POOL: {
		HOME: (id: string) => `/pool/${id}`,
	},
	DASHBOARD: {
		HOME: '/dashboard',
	},
};

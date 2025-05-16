import { Inter } from 'next/font/google';
import '@/styles/globals.scss';
import { RootMetadata } from '@/seo';
import { headers, cookies } from 'next/headers';
import Web3Provider from '@/context/web3-provider.context';
import { ThemeAndLanguageProvider } from '@/context/theme-language.context';
import { getCookie } from 'cookies-next/server';
import { APP_THEME_KEY } from '@/constant/storage-keys.constant';
import { AppTheme } from '@/types/theme';
import '@coinbase/onchainkit/styles.css';
import { Web3UserProvider } from '@/context/web3-user.context';
import SmoothScroll from '@/components/utils/SmoothScroll';
import { ViewTransitions } from 'next-view-transitions';
import DesktopOnly from '@/components/guard/desktop-only';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
});

export const metadata = RootMetadata;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const userPrefTheme = await getCookie(APP_THEME_KEY, { cookies });
	const wagmiCookie = (await headers()).get('cookie');

	return (
		<ViewTransitions>
			<html
				lang='en'
				className={`${inter.variable} antialiased`}>
				<ThemeAndLanguageProvider
					defaultTheme={
						(userPrefTheme || AppTheme.LIGHT) as AppTheme
					}>
					<SmoothScroll>
						<Web3Provider cookie={wagmiCookie}>
							<Web3UserProvider>
								<DesktopOnly>{children}</DesktopOnly>
							</Web3UserProvider>
						</Web3Provider>
					</SmoothScroll>
				</ThemeAndLanguageProvider>
			</html>
		</ViewTransitions>
	);
}

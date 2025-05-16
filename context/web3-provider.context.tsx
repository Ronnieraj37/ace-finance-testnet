'use client';
import {
	web3Config,
	web3DataProvider,
} from '@/constant/config/web3-config.constant';
import { ONCHAINKIT_API_KEY } from '@/constant/env.constant';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cookieToInitialState, WagmiProvider } from 'wagmi';

export const queryClient = new QueryClient();

function Web3Provider({
	children,
	cookie,
}: {
	children: React.ReactNode;
	cookie?: string | null;
}) {
	const initialState = cookieToInitialState(web3Config, cookie);

	return (
		<WagmiProvider
			config={web3Config}
			initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<OnchainKitProvider
					apiKey={ONCHAINKIT_API_KEY}
					chain={web3DataProvider.baseChain}
					config={{
						appearance: {
							name: 'ACE Finance',
							mode: 'light',
						},
						wallet: {
							display: 'modal',
							supportedWallets: {
								frame: true,
								trust: true,
							},
						},
					}}>
					{children}
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}

export default Web3Provider;

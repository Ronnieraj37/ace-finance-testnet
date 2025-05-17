'use client';
import { web3DataProvider } from '@/constant/config/web3-config.constant';
import React from 'react';
import { Btn } from '@/components/ui/button';
import { APP_ROUTE } from '@/constant/routes.constant';
import { useTransitionRouter } from 'next-view-transitions';

function TestnetMintCta() {
	const isTestnet = web3DataProvider.isTestnet;
	const router = useTransitionRouter();

	if (!isTestnet) {
		return null;
	}

	const handleMintClick = () => {
		router.push(APP_ROUTE.MINT);
	};

	return (
		<div className='fixed bottom-6 right-6 z-50'>
			<Btn.Primary
				className='bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105'
				onClick={handleMintClick}>
				<span className='flex items-center gap-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<circle
							cx='12'
							cy='12'
							r='10'
						/>
						<path d='M8 12h8' />
						<path d='M12 8v8' />
					</svg>
					Mint Testnet Tokens
				</span>
			</Btn.Primary>
		</div>
	);
}

export default TestnetMintCta;

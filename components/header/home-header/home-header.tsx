import React from 'react';
import styles from './home-header.module.scss';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import ConnectWalletButton from '@/components/features/web3/connect-wallet-button/connect-wallet-button';
import { ASSETS } from '@/constant/assets.constant';
import Image from 'next/image';

function HomeHeader() {
	return (
		<div className={styles['home-header-con']}>
			<div className={cn(styles['home-header'])}>
				<div className={styles['header-text']}>
					<Image
						src={ASSETS.LOGO}
						alt='logo'
						width={48}
						height={48}
					/>
					<Text.Semibold24>ACE</Text.Semibold24>
				</div>
				<div className={styles['connect-wallet']}>
					<ConnectWalletButton />
				</div>
			</div>
		</div>
	);
}

export default HomeHeader;

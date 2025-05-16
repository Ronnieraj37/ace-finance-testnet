import React from 'react';
import styles from './home-header.module.scss';
import { Text } from '@/components/ui/typography/Text';
import { cn } from '@/lib/utils';
import ConnectWalletButton from '@/components/features/web3/connect-wallet-button/connect-wallet-button';

function HomeHeader() {
	return (
		<div className={styles['home-header-con']}>
			<div className={cn(styles['home-header'])}>
				<div className={styles['header-text']}>
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

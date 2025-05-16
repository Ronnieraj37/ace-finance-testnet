import { type PoolAllocation } from '@/types/web3/pool.types';
import React, { useState } from 'react';
import styles from '../../style/pool-id.module.scss';
import Image from 'next/image';

function PoolAllocation({ allocation }: { allocation: PoolAllocation[] }) {
	const [activeToken, setActiveToken] = useState<string | null>(null);

	// Calculate total value in USD
	const totalValueUSD = allocation.reduce(
		(sum, token) => sum + parseFloat(token.valueUSD),
		0
	);

	return (
		<div className={styles.poolDetailsCard}>
			<h2 className={styles.chartTitle}>Token Allocation</h2>

			<div className={styles.tokenAllocationContainer}>
				{/* Token details */}
				<div className={styles.tokenDetailsGrid}>
					{allocation.map((token) => (
						<div
							key={token.address}
							className={`${styles.tokenDetailCard} ${activeToken === token.address ? styles.activeTokenCard : ''}`}
							onMouseEnter={() => setActiveToken(token.address)}
							onMouseLeave={() => setActiveToken(null)}>
							<div className={styles.tokenDetailHeader}>
								<div
									className={styles.tokenDetailIconContainer}>
									{token.logoUrl ?
										<Image
											src={token.logoUrl}
											alt={token.symbol}
											width={32}
											height={32}
											className={styles.tokenDetailIcon}
										/>
									:	<div
											className={
												styles.tokenDetailIconFallback
											}>
											{token.symbol.charAt(0)}
										</div>
									}
								</div>
								<div className={styles.tokenDetailInfo}>
									<h3 className={styles.tokenDetailName}>
										{token.name}
									</h3>
									<span className={styles.tokenDetailSymbol}>
										{token.symbol}
									</span>
								</div>
							</div>
							<div className={styles.tokenDetailStats}>
								<div className={styles.tokenDetailStat}>
									<span
										className={styles.tokenDetailStatLabel}>
										Amount
									</span>
									<span
										className={styles.tokenDetailStatValue}>
										{token.formattedSupply}
									</span>
								</div>
								<div className={styles.tokenDetailStat}>
									<span
										className={styles.tokenDetailStatLabel}>
										Value
									</span>
									<span
										className={styles.tokenDetailStatValue}>
										$
										{parseFloat(
											token.valueUSD
										).toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
								<div className={styles.tokenDetailStat}>
									<span
										className={styles.tokenDetailStatLabel}>
										Allocation
									</span>
									<span
										className={styles.tokenDetailStatValue}>
										{(
											(parseFloat(token.valueUSD) /
												totalValueUSD) *
											100
										).toFixed(2)}
										%
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default PoolAllocation;

'use client';
import React, { useMemo, useEffect } from 'react';
import styles from './dashboard.module.scss';
import { useWeb3User } from '@/context/web3-user.context';
import ConnectWalletButton from '@/components/features/web3/connect-wallet-button/connect-wallet-button';

import { Btn } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { APP_ROUTE } from '@/constant/routes.constant';
import { POOL_ADDRESSES, POOLS } from '@/constant/web3/address/pools.constant';
import { POOL_INFO, PoolRisk } from '@/constant/data/pool-info.constant';
import { useUserPortfolio } from '@/store/useUserPortfolio';
import { useTransitionRouter } from 'next-view-transitions';
import DashboardWithdraw from './components/dashboard-withdraw';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardView() {
	const { isConnected } = useWeb3User();

	return (
		<div className={styles.dashboardView}>
			<div className={styles.dashboardHeader}>
				<div className={styles.dashboardHeader_title}>Dashboard</div>
				<div className={styles.dashboardHeader_description}>
					Manage your deposits and track your earnings across all
					pools
				</div>
			</div>

			{!isConnected ?
				<NotConnectedView />
			:	<ConnectedDashboard />}
		</div>
	);
}

function NotConnectedView() {
	return (
		<div className={styles.notConnected}>
			<div className={styles.notConnected_title}>Connect Your Wallet</div>
			<div className={styles.notConnected_description}>
				Connect your wallet to view your dashboard, manage your
				deposits, and track your earnings across all pools.
			</div>
			<div className={styles.notConnected_button}>
				<ConnectWalletButton btnClassName='!h-[56px] !px-8' />
			</div>
		</div>
	);
}

function ConnectedDashboard() {
	const { portfolioData, isLoading, isError, getPortfolioData } =
		useUserPortfolio();
	const { address } = useWeb3User();
	const router = useTransitionRouter();

	// Fetch portfolio data when wallet is connected
	useEffect(() => {
		if (address) {
			getPortfolioData(address);
		}
	}, [address, getPortfolioData]);

	// Calculate dashboard metrics from portfolio data
	const dashboardData = useMemo(() => {
		if (!portfolioData) {
			return {
				totalDeposit: 0,
				currentApr: 0,
				activePools: 0,
				totalPools: POOL_ADDRESSES.length,
			};
		}

		// Calculate total deposit from all pools
		const totalDeposit = portfolioData.reduce(
			(sum, pool) => sum + parseFloat(pool.totalValueUSD),
			0
		);

		// Calculate weighted average APR
		let weightedAprSum = 0;
		let totalValue = 0;

		portfolioData.forEach((portfolioPool) => {
			const poolValue = parseFloat(portfolioPool.totalValueUSD);
			if (poolValue > 0) {
				const apr = portfolioPool.pool.apr || 0;
				weightedAprSum += poolValue * apr;
				totalValue += poolValue;
			}
		});

		const currentApr = totalValue > 0 ? weightedAprSum / totalValue : 0;

		// Count active pools (pools with value > 0)
		const activePools = portfolioData.filter(
			(pool) => parseFloat(pool.totalValueUSD) > 0
		).length;

		return {
			totalDeposit,
			currentApr,
			activePools,
			totalPools: POOL_ADDRESSES.length,
		};
	}, [portfolioData]);

	// Prepare pool data from portfolio data
	const poolsData = useMemo(() => {
		if (!portfolioData) return [];

		// Create a map of portfolio pools by address for easy lookup
		const portfolioPoolMap = Object.fromEntries(
			portfolioData.map((item) => [item.pool.address.toLowerCase(), item])
		);

		return POOL_ADDRESSES.map((address) => {
			const poolInfo = POOL_INFO[address];

			// Find the pool id by matching the address
			const pool = POOLS.find((p) => p.address === address);
			const poolId =
				pool ? pool.name.toLowerCase().replace(/\s+/g, '-') : '';

			// Get portfolio data for this pool if available
			const portfolioPool = portfolioPoolMap[address.toLowerCase()];
			const totalValueUSD = portfolioPool?.totalValueUSD || '0.00';

			// Calculate earned value (this would ideally come from the backend)
			const earned = 0; // This would be provided by the backend

			return {
				id: poolId,
				address,
				name: poolInfo.name,
				description: poolInfo.description,
				risk:
					poolInfo.risk === PoolRisk.HIGH ? 'High'
					: poolInfo.risk === PoolRisk.MEDIUM ? 'Medium'
					: 'Low',
				tvl: portfolioPool?.pool.tvl || '2.5K',
				activeInvestors: portfolioPool?.pool.activeInvestors || 0,
				apr: portfolioPool?.pool.apr || 0,
				userInvestment: parseFloat(totalValueUSD),
				earned,
				tokenBalances: portfolioPool?.tokenBalances || [],
			};
		});
	}, [portfolioData]);

	return (
		<>
			{isError && (
				<div className={styles.errorMessage}>
					<p>
						Failed to load portfolio data. Please try again later.
					</p>
				</div>
			)}

			{/* User Stats */}
			<div className={styles.statsGrid}>
				<div className={styles.statsCard}>
					<div className={styles.cardContent}>
						<h3 className={styles.cardTitle}>Total Deposit</h3>
						{isLoading ?
							<Skeleton
								className={styles.cardValue + ' h-8 w-28'}
							/>
						:	<p className={styles.cardValue}>
								${dashboardData.totalDeposit.toLocaleString()}
							</p>
						}
					</div>
				</div>
				<div className={styles.statsCard}>
					<div className={styles.cardContent}>
						<h3 className={styles.cardTitle}>Current APR</h3>
						{isLoading ?
							<Skeleton
								className={styles.cardValue + ' h-8 w-20'}
							/>
						:	<p className={styles.cardValue}>
								{dashboardData.currentApr.toFixed(2)}%
							</p>
						}
					</div>
				</div>
				<div className={styles.statsCard}>
					<div className={styles.cardContent}>
						<h3 className={styles.cardTitle}>Active Pools</h3>
						{isLoading ?
							<Skeleton
								className={styles.cardValue + ' h-8 w-16'}
							/>
						:	<p className={styles.cardValue}>
								{dashboardData.activePools} /{' '}
								{dashboardData.totalPools}
							</p>
						}
					</div>
				</div>
			</div>

			{/* Pools Section */}
			<div className={styles.poolsSection}>
				<div className={styles.poolsSection_title}>Your Pools</div>
				<div className={styles.poolsList}>
					{
						isLoading ?
							// Skeleton loading state for pools
							[...Array(3)].map((_, index) => (
								<div
									key={index}
									className={styles.poolCard}>
									<div className={styles.poolCard_header}>
										<div className='flex items-center gap-3'>
											<Skeleton className='h-6 w-32' />
										</div>
										<Skeleton className='h-5 w-16' />
									</div>

									<div className={styles.poolCard_stats}>
										{[...Array(4)].map((_, statIndex) => (
											<div
												key={statIndex}
												className={
													styles.poolCard_stats_item
												}>
												<Skeleton className='h-4 w-24' />
												<Skeleton className='h-5 w-16 mt-1' />
											</div>
										))}
									</div>

									<div className={styles.poolCard_actions}>
										<div className='flex gap-3'>
											<Skeleton className='h-10 w-24' />
											<Skeleton className='h-10 w-24' />
										</div>
									</div>
								</div>
							))
							// Actual pool data
						:	poolsData.map((pool) => (
								<div
									key={pool.id}
									className={styles.poolCard}>
									<div className={styles.poolCard_header}>
										<div className='flex items-center gap-3'>
											<div
												className={
													styles.poolCard_title
												}>
												{pool.name}
											</div>
										</div>
										<div className={styles.poolCard_risk}>
											{pool.risk} Risk
										</div>
									</div>

									<div className={styles.poolCard_stats}>
										<div
											className={
												styles.poolCard_stats_item
											}>
											<div
												className={
													styles.poolCard_stats_item_label
												}>
												Your Investment
											</div>
											<div
												className={
													styles.poolCard_stats_item_value
												}>
												$
												{pool.userInvestment.toLocaleString()}
											</div>
										</div>
										<div
											className={
												styles.poolCard_stats_item
											}>
											<div
												className={
													styles.poolCard_stats_item_label
												}>
												APR
											</div>
											<div
												className={
													styles.poolCard_stats_item_value
												}>
												{pool.apr}%
											</div>
										</div>
										<div
											className={
												styles.poolCard_stats_item
											}>
											<div
												className={
													styles.poolCard_stats_item_label
												}>
												TVL
											</div>
											<div
												className={
													styles.poolCard_stats_item_value
												}>
												$2.5K
											</div>
										</div>
									</div>

									<div className={styles.poolCard_actions}>
										<div className='flex gap-3'>
											<Btn.Large
												className={cn(
													styles.poolCard_withdraw
												)}
												onClick={() =>
													router.push(
														APP_ROUTE.POOL.HOME(
															pool.address
														)
													)
												}>
												Deposit
											</Btn.Large>

											<DashboardWithdraw
												poolAddress={pool.address}
												poolName={pool.name}
												currentInvestment={
													pool.userInvestment
												}
												tokenBalance={
													pool.tokenBalances
												}
											/>
										</div>
									</div>
								</div>
							))

					}
				</div>
			</div>
		</>
	);
}

export default DashboardView;

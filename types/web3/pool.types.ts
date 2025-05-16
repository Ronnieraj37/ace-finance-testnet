import { Web3Address } from './web3.types';

/**
 * Basic token information
 */
export type PoolToken = {
	symbol: string;
	name: string;
	address: Web3Address;
};

/**
 * Individual pool information
 */
export type PoolData = {
	id: string;
	token0: PoolToken;
	token1: PoolToken;
	feeTier: string;
	apr: number;
	tvl: string;
	volatility: number;
	sharpeRatio: number;
	volume7d: string;
};

/**
 * Risk level type
 */
export enum PoolRiskLevel {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

export type PoolAllocation = {
	symbol: string;
	name: string;
	address: Web3Address;
	totalSupply: string;
	formattedSupply: string;
	valueUSD: string;
	logoUrl: string;
};

/**
 * Strategy information
 */
export type PoolStrategy = {
	name: string;
	description: string;
	riskLevel: PoolRiskLevel;
	averageApr: number;
	poolCount: number;
	tvl: string;
	topPools: PoolData[];
	tokenAllocation: PoolAllocation[];
	aprRange: string;
};

/**
 * Strategies by risk level
 */
export type PoolStrategies = {
	[PoolRiskLevel.LOW]: PoolStrategy;
	[PoolRiskLevel.MEDIUM]: PoolStrategy;
	[PoolRiskLevel.HIGH]: PoolStrategy;
};

/**
 * Complete pool summary response
 */
export type PoolSummaryResponse = {
	strategies: PoolStrategies;
	timestamp: number;
	lastUpdated: string;
};

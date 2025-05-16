/**
 * Base token interface
 */
export interface PortfolioToken {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	logo: string;
	tokenId: string;
}

/**
 * Pool information
 */
export interface PoolInfo {
	name: string;
	address: string;
	tvl: number;
	activeInvestors: number;
}

/**
 * Token balance information
 */
export interface TokenBalance {
	token: PortfolioToken;
	balance: string;
	rawBalance: string;
	formattedBalance: string;
	valueUSD: string;
}

/**
 * Portfolio pool data
 */
export interface PortfolioPool {
	pool: PoolInfo;
	tokenBalances: TokenBalance[];
	totalValueUSD: string;
	hasInvestment: boolean;
	apr: number;
}

/**
 * Complete portfolio data
 */
export type Portfolio = PortfolioPool[];

/**
 * Helper types for API responses and queries
 */
export interface PortfolioQueryParams {
	address?: string;
	chainId?: number;
}

/**
 * API response types
 */
export interface PortfolioResponse {
	data: Portfolio;
	status: string;
	timestamp: number;
}

/**
 * Token type with additional metadata
 */
export interface TokenWithMetadata extends PortfolioToken {
	price?: string;
	priceChange24h?: string;
	marketCap?: string;
	volume24h?: string;
}

/**
 * Pool allocation type
 */
export interface PoolAllocation {
	token: PortfolioToken;
	percentage: string;
	valueUSD: string;
}

/**
 * Pool performance metrics
 */
export interface PoolPerformance {
	timeframe: 'day' | 'week' | 'month' | 'year';
	returnPercentage: string;
	returnValueUSD: string;
}

/**
 * Extended portfolio pool with additional data
 */
export interface ExtendedPortfolioPool extends PortfolioPool {
	allocations: PoolAllocation[];
	performance: PoolPerformance[];
	riskLevel: 'low' | 'medium' | 'high';
	description?: string;
}

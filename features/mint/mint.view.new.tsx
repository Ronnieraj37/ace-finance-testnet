'use client';
import { web3DataProvider } from '@/constant/config/web3-config.constant';
import { APP_ROUTE } from '@/constant/routes.constant';
import { useTransitionRouter } from 'next-view-transitions';
import React, { useState, useEffect } from 'react';
import { TOKENS, StandardToken } from '@/constant/web3/address/tokens.constant';
import { ConnectedBtn } from '@/components/ui/button';
import { useAccount, useWriteContract } from 'wagmi';
import tokenAbi from '@/web3/abi/token.abi.json';
import { parseUnits } from 'viem';
import { useCurrentTransactionStore } from '@/store/useCurrentTransactionStore';
import { toast } from 'sonner';
import { Text } from '@/components/ui/typography/Text';
import Image from 'next/image';
import { SingleSelect } from '@/components/ui/select/single-select';
import { cn } from '@/lib/utils';

function MintView() {
	const isMainnet = web3DataProvider.isMainnet;
	const router = useTransitionRouter();
	const { address } = useAccount();
	const { writeContractAsync, isPending } = useWriteContract();
	const { setTransaction } = useCurrentTransactionStore();

	const [selectedToken, setSelectedToken] = useState<StandardToken>(TOKENS[0]);
	const [amount, setAmount] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);
	const [isSelectOpen, setIsSelectOpen] = useState(false);

	// Validate amount input
	useEffect(() => {
		const numAmount = parseFloat(amount || '0');
		setIsDisabled(numAmount <= 0 || amount === '' || !address);
	}, [amount, address]);

	if (isMainnet) {
		router.push(APP_ROUTE.HOME);
		return null;
	}

	const handleTokenChange = (value: string, token: StandardToken) => {
		setSelectedToken(token);
	};
	
	// Render custom token option for the select
	const renderTokenOption = (token: StandardToken, isSelected: boolean) => {
		return (
			<div
				className={cn(
					'flex items-center gap-2 p-2 rounded-md',
					isSelected ? 'bg-background' : 'hover:bg-accent'
				)}
			>
				<div className="w-6 h-6 rounded-full overflow-hidden bg-background flex items-center justify-center flex-shrink-0">
					{token.logo ? (
						<Image 
							src={token.logo} 
							alt={token.symbol} 
							width={24} 
							height={24} 
						/>
					) : (
						<span className="text-xs font-bold">{token.symbol.substring(0, 2)}</span>
					)}
				</div>
				<div className="flex flex-col">
					<Text.Regular14 variant="light" textWeight="semibold">
						{token.symbol}
					</Text.Regular14>
					<Text.Regular12 className="text-muted-foreground">
						{token.name}
					</Text.Regular12>
				</div>
			</div>
		);
	};
	
	// Render selected token in the select
	const renderSelectedToken = (token: StandardToken | null) => {
		if (!token) return null;
		
		return (
			<div className="flex items-center gap-2">
				<div className="w-5 h-5 rounded-full overflow-hidden bg-background flex items-center justify-center flex-shrink-0">
					{token.logo ? (
						<Image 
							src={token.logo} 
							alt={token.symbol} 
							width={20} 
							height={20} 
						/>
					) : (
						<span className="text-xs font-bold">{token.symbol.substring(0, 2)}</span>
					)}
				</div>
				<Text.Regular14 variant="light" textWeight="semibold">
					{token.symbol}
				</Text.Regular14>
			</div>
		);
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Only allow numbers and decimals
		const value = e.target.value.replace(/[^0-9.]/g, '');
		setAmount(value);
	};

	const handleMint = async () => {
		if (!address || !amount || isDisabled) return;

		// Create toast ID outside try/catch for scope access
		let toastId: string | number = '';

		try {
			// Show processing toast
			toastId = toast.loading(
				`Minting ${amount} ${selectedToken.symbol}...`,
				{
					duration: 60000, // Long duration as transactions can take time
					className: 'mint-toast',
				}
			);

			// Parse the amount with the correct number of decimals
			const parsedAmount = parseUnits(amount, selectedToken.decimals);

			// Prepare the transaction parameters
			const mintParams = {
				address: selectedToken.address as `0x${string}`,
				abi: tokenAbi,
				functionName: 'mint',
				args: [address, parsedAmount],
				account: address,
			};

			// Execute the mint transaction
			const txHash = await writeContractAsync(mintParams);

			// Set transaction in the store for monitoring
			setTransaction({
				hash: txHash,
				successToastMessage: `Successfully minted ${amount} ${selectedToken.symbol}`,
				errorToastMessage: `Failed to mint ${selectedToken.symbol}`,
				onSuccess: () => {
					// Clear amount input on success
					setAmount('');
				},
				onError: () => {
					// Error handling is done by the transaction listener
				},
			});

			// Dismiss the loading toast as the transaction listener will handle status
			toast.dismiss(toastId);
		} catch (err) {
			console.error('Mint error:', err);
			toast.error('Failed to mint tokens', {
				id: toastId,
				description:
					err instanceof Error ?
						err.message
					:	'Transaction could not be initiated',
			});
		}
	};

	return (
		<div className="container mx-auto max-w-md py-12">
			<div className="bg-card rounded-xl shadow-xl p-6 border border-border">
				<div className="flex items-center justify-center mb-6">
					<Text.Semibold20 className="text-center text-white">
						Mint Testnet Tokens
					</Text.Semibold20>
				</div>

				<div className="space-y-6">
					{/* Token Selection */}
					<div className="space-y-2">
						<Text.Regular16 className="text-center text-white">
							Select Token
						</Text.Regular16>
						<SingleSelect
							options={TOKENS}
							value={selectedToken.address}
							valueKey="address"
							labelKey="symbol"
							onChange={handleTokenChange}
							renderOption={renderTokenOption}
							renderValue={renderSelectedToken}
							isOpen={isSelectOpen}
							onOpenChange={setIsSelectOpen}
							className="bg-background border-border text-white"
							dropdownClassName="bg-background border-border"
						/>
					</div>

					{/* Amount Input */}
					<div className="space-y-2">
						<Text.Regular16 className="text-center text-white">
							Amount
						</Text.Regular16>
						<div className="relative">
							<input
								id="amount"
								type="text"
								className="w-full h-12 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-20 text-white"
								value={amount}
								onChange={handleAmountChange}
								placeholder="0.0"
							/>
							<div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
								<Text.Regular12 className="text-muted-foreground">
									{selectedToken.symbol}
								</Text.Regular12>
							</div>
						</div>
						<Text.Regular12 className="text-muted-foreground">
							Enter the amount of tokens you want to mint
						</Text.Regular12>
					</div>

					{/* Mint Button */}
					<div className="pt-4">
						<ConnectedBtn.Primary
							parentWidth
							showConnectButton
							className="bg-button-primary text-button-primary-text h-12 rounded-lg font-medium transition-all duration-200"
							onClick={handleMint}
							disabled={isDisabled || isPending}
						>
							<span className="flex items-center justify-center gap-2">
								{isPending ? (
									<>
										<svg
											className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Processing...
									</>
								) : (
									<>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M12 16V12"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M12 8H12.01"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										Mint {selectedToken.symbol}
									</>
								)}
							</span>
						</ConnectedBtn.Primary>
					</div>

					{/* Info Box */}
					<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
						<div className="flex items-start">
							<svg
								className="w-5 h-5 text-blue-500 mt-0.5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							<Text.Regular12 className="text-blue-700 dark:text-blue-300">
								This is a testnet-only feature. Tokens minted
								here have no real value and are meant for
								testing purposes only.
							</Text.Regular12>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MintView;

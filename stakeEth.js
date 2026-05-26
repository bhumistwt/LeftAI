/**
 * Stake ETH - Ethereum staking integration
 * Uses Lido or similar ETH staking protocols
 */

import { parseUnits } from 'viem';

/**
 * Lido stETH contract on Ethereum Mainnet
 * For testnet, you would use a different address
 */
export const STAKING_CONTRACT = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"; // Lido stETH

/**
 * Lido stETH ABI - submit() function for staking
 */
export const STAKING_ABI = [
    {
        "inputs": [{ "internalType": "address", "name": "_referral", "type": "address" }],
        "name": "submit",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "payable",
        "type": "function"
    }
];

/**
 * Stake ETH function definition for AI
 */
export const stakeEthFunction = {
    name: "stake_eth",
    description: "Stake ETH tokens to earn rewards via stETH (Lido). Use this when the user wants to save money, earn yield, stake, or earn passive income.",
    parameters: {
        type: "object",
        properties: {
            amount: {
                type: "string",
                description: "The amount of ETH to stake (e.g., '0.1', '0.5'). Must be a positive number.",
            },
        },
        required: ["amount"],
    },
};

/**
 * Validate stake parameters
 */
function validateStakeParams({ amount }) {
    const errors = [];
    const missing = [];

    if (!amount) {
        missing.push("amount");
        return {
            isValid: false,
            missing,
            error: "Missing required information: amount. Please specify how much ETH you want to stake.",
        };
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        errors.push("Invalid amount. Must be a positive number");
    }

    if (numAmount < 0.001) {
        errors.push("Amount too small. Minimum recommended stake is 0.001 ETH");
    }

    return {
        isValid: errors.length === 0,
        missing: [],
        errors,
        error: errors.join(". "),
    };
}

/**
 * Prepare stake ETH action
 */
export function prepareStakeEth({ userAddress, amount }) {
    if (!userAddress) {
        return {
            success: false,
            error: "No wallet connected. Please connect your wallet first to stake ETH.",
            needsWallet: true,
        };
    }

    const validation = validateStakeParams({ amount });

    if (!validation.isValid) {
        return {
            success: false,
            error: validation.error,
            missing: validation.missing,
            errors: validation.errors,
            currentParams: { amount: amount || null },
        };
    }

    return {
        success: true,
        type: "stake_eth",
        userAddress,
        amount,
        status: "pending_confirmation",
        message: `Ready to stake ${amount} ETH to earn rewards via Lido`,
    };
}

/**
 * Execute ETH staking via Lido
 */
export async function executeStakeEth({
    amount,
    writeContract,
    chainId,
    userAddress,
}) {
    try {
        // Only works on Ethereum Mainnet (1) or Sepolia (11155111)
        if (chainId !== 1 && chainId !== 11155111) {
            return {
                success: false,
                error: "Staking is only available on Ethereum Mainnet. Please switch to Ethereum Mainnet network.",
            };
        }

        console.log('Staking ETH via Lido...');

        // Parse amount with 18 decimals
        const amountInWei = parseUnits(amount, 18);

        console.log('Staking details:', {
            contract: STAKING_CONTRACT,
            amount: amount,
            amountInWei: amountInWei.toString(),
        });

        // Call submit() function with ETH value (referral address is zero for no referral)
        const hash = await writeContract({
            address: STAKING_CONTRACT,
            abi: STAKING_ABI,
            functionName: 'submit',
            args: ['0x0000000000000000000000000000000000000000'], // No referral
            value: amountInWei,
        });

        console.log('Stake transaction:', hash);

        return {
            success: true,
            hash,
            type: 'stake',
            amount,
            contractAddress: STAKING_CONTRACT,
        };

    } catch (error) {
        console.error('Staking error:', error);

        if (error.message?.includes('User rejected') || error.code === 4001) {
            return {
                success: false,
                error: 'Staking rejected by user',
                userRejected: true,
            };
        }

        if (error.message?.includes('insufficient funds')) {
            return {
                success: false,
                error: 'Insufficient ETH balance for staking',
            };
        }

        return {
            success: false,
            error: error.message || 'Failed to stake ETH',
        };
    }
}

/**
 * Get block explorer URL
 */
export function getExplorerUrl(chainId, hash) {
    const explorers = {
        1: 'https://etherscan.io',
        11155111: 'https://sepolia.etherscan.io',
    };

    const baseUrl = explorers[chainId] || explorers[1];
    return `${baseUrl}/tx/${hash}`;
}

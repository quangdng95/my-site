import { Brand, Customer, Tier, TransactionType } from './types';

/**
 * Calculates the points earned from a transaction.
 * Formula: (OrderTotal - TaxAndShipping) * BrandEarningRate * TierMultiplier
 * 
 * @param orderSubtotal - The net amount eligible for earning (OrderTotal - TaxAndShipping)
 * @param brand - The Brand object containing specific earning rates
 * @param currentTier - The customer's current Tier object containing the multiplier
 * @returns The calculated points as a number
 */
export function calculatePoints(
    orderSubtotal: number, 
    brand: Brand, 
    currentTier: Tier
): number {
    if (orderSubtotal < 0) return 0;
    
    // Core Formula
    const basePoints = orderSubtotal * brand.earningRateOverride;
    const finalPoints = basePoints * currentTier.multiplier;
    
    // Return rounded down integer or float based on policy? 
    // Assuming standard rounding for now.
    return Math.round(finalPoints);
}

/**
 * Determines the correct Tier based on ranking points.
 * Automatically sorts tiers by entryPoint descending to find the highest eligible tier.
 * 
 * @param currentRankingPoints - The customer's current cumulative ranking points
 * @param tiersList - The list of all available tiers in the program
 * @returns The Tier object the customer belongs to
 */
export function determineTier(
    currentRankingPoints: number, 
    tiersList: Tier[]
): Tier | null {
    if (!tiersList || tiersList.length === 0) return null;

    // Sort tiers by entryPoint in descending order (High to Low)
    const sortedTiers = [...tiersList].sort((a, b) => b.entryPoint - a.entryPoint);

    // Find the first tier where points >= entryPoint
    const eligibleTier = sortedTiers.find(tier => currentRankingPoints >= tier.entryPoint);

    // If no tier matches (e.g. points < lowest tier), return the lowest tier or null?
    // Usually there is a "Member" tier at 0 points.
    // If undefined, return the last one (lowest entry point) assuming it's the base tier.
    return eligibleTier || sortedTiers[sortedTiers.length - 1]; 
}

/**
 * Adjusts a customer's balance manually.
 * Supports independent adjustment of Ranking and Reward points used in Admin scenarios.
 * 
 * @param customer - The customer to adjust
 * @param type - The transaction type (usually 'ADJUSTMENT' or manual 'EARN'/'REDEEM')
 * @param amountRanking - Amount to add/subtract from Ranking Wallet
 * @param amountReward - Amount to add/subtract from Reward Wallet
 * @param reason - Audit reason for the adjustment
 * @returns An object containing the updated Customer and a generated Transaction record (mock ID)
 */
export function adjustBalance(
    customer: Customer, 
    type: TransactionType, 
    amountRanking: number, 
    amountReward: number,
    reason: string
): { updatedCustomer: Customer; transaction: any } {
    
    // Create new customer state (immutable update)
    const updatedCustomer: Customer = {
        ...customer,
        rankingPoints: customer.rankingPoints + amountRanking,
        rewardPoints: customer.rewardPoints + amountReward
    };

    // Ensure points don't go negative if that's a rule (optional, but good practice for Reward points)
    if (updatedCustomer.rewardPoints < 0) {
        console.warn(`Warning: Customer ${customer.id} reward points dropped below 0.`);
    }
     // Ranking points usually don't go below 0 either
    if (updatedCustomer.rankingPoints < 0) {
        updatedCustomer.rankingPoints = 0;
    }

    const transaction = {
        id: Math.random().toString(36).substr(2, 9), // Mock ID
        type,
        amountRanking,
        amountReward,
        reason,
        timestamp: new Date(),
        customerId: customer.id
    };

    return { updatedCustomer, transaction };
}

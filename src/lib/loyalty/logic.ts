import { Brand, Member, Tier, TransactionType } from './types';

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
 * @param member - The member to adjust
 * @param type - The transaction type (usually 'ADJUSTMENT' or manual 'EARN'/'REDEEM')
 * @param amountRanking - Amount to add/subtract from Ranking Wallet
 * @param amountReward - Amount to add/subtract from Reward Wallet
 * @param reason - Audit reason for the adjustment
 * @returns An object containing the updated Member and a generated Transaction record (mock ID)
 */
export function adjustBalance(
    member: Member,
    type: TransactionType,
    amountRanking: number,
    amountReward: number,
    reason: string
): { updatedMember: Member; transaction: any } {

    // Create new member state (immutable update)
    const updatedMember: Member = {
        ...member,
        rankingPoints: member.rankingPoints + amountRanking,
        rewardPoints: member.rewardPoints + amountReward
    };

    // Ensure points don't go negative if that's a rule (optional, but good practice for Reward points)
    if (updatedMember.rewardPoints < 0) {
        console.warn(`Warning: Member ${member.id} reward points dropped below 0.`);
    }
    // Ranking points usually don't go below 0 either
    if (updatedMember.rankingPoints < 0) {
        updatedMember.rankingPoints = 0;
    }

    const transaction = {
        id: Math.random().toString(36).substr(2, 9), // Mock ID
        type,
        amountRanking,
        amountReward,
        reason,
        timestamp: new Date(),
        customerId: member.id
    };

    return { updatedMember, transaction };
}

/**
 * Calculates days remaining until a specific end date.
 * Positive = Future, Negative = Past.
 */
export function getDaysUntilExpiry(endDate: string): number {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines the status of a member's tier validity.
 * - 'GRACE_PERIOD': Expired < 30 days ago
 * - 'EXPIRED': Expired > 30 days ago
 * - 'WARNING': Expires in <= 30 days
 * - 'OK': Safe
 */
export function getTierValidityStatus(member: Member): 'OK' | 'WARNING' | 'GRACE_PERIOD' | 'EXPIRED' {
    const days = getDaysUntilExpiry(member.tierEndDate);

    if (days < -30) return 'EXPIRED';
    if (days < 0) return 'GRACE_PERIOD';
    if (days <= 30) return 'WARNING';
    return 'OK';
}

/**
 * Calculates progress towards the next highest tier.
 */
export function getNextTierProgress(
    currentPoints: number,
    currentTierId: string
): { nextTierName: string | null; progressPercent: number; pointsNeeded: number } {
    // Hardcoded tiers as requested
    const tiers: Tier[] = [
        { id: 'Member', name: 'Member', entryPoint: 0, multiplier: 1, benefits: [], visualColor: 'default' },
        { id: 'Silver', name: 'Silver', entryPoint: 500, multiplier: 1.2, benefits: [], visualColor: 'silver' },
        { id: 'Gold', name: 'Gold', entryPoint: 2000, multiplier: 1.5, benefits: [], visualColor: 'gold' },
        { id: 'Platinum', name: 'Platinum', entryPoint: 5000, multiplier: 2.0, benefits: [], visualColor: 'purple' }
    ];

    // sort tiers ascending by entry point to find the chain
    const ascendingTiers = [...tiers].sort((a, b) => a.entryPoint - b.entryPoint);

    // find current index
    const currentIndex = ascendingTiers.findIndex(t => t.id === currentTierId);

    // if not found or is last tier (Diamond/Highest)
    if (currentIndex === -1 || currentIndex === ascendingTiers.length - 1) {
        return { nextTierName: null, progressPercent: 100, pointsNeeded: 0 };
    }

    const nextTier = ascendingTiers[currentIndex + 1];

    // Careful: If currentPoints > nextTier.entryPoint, user should have been upgraded already. 
    // But for progress bar visualization, we cap at 100%.
    const pointsNeeded = Math.max(0, nextTier.entryPoint - currentPoints);

    // Calculate percentage based on total required from 0 or from current Tier base?
    // Usually progress is "points earned this cycle" vs "gap to next". 
    // Simple way: (current / next) * 100.
    let percent = (currentPoints / nextTier.entryPoint) * 100;
    percent = Math.min(100, Math.max(0, percent));

    return {
        nextTierName: nextTier.name,
        progressPercent: parseFloat(percent.toFixed(1)), // 1 decimal place
        pointsNeeded
    };
}

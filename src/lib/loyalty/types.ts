/**
 * Loyalty & Rewards System V2.0 - Core Type Definitions
 * 
 * Implements the "Dual-Wallet" architecture:
 * - Ranking Points: Life-time cumulative points for Tier calculation. Cyclical reset.
 * - Reward Points: Spendable currency for redemption. Can expire.
 */

export interface ProgramSettings {
    programName: string;
    currencyName: string; // e.g. "Stars", "Coins"
    resetCycle: 'YEARLY' | 'NEVER' | 'ROLLING_12_MONTHS';
}

export interface Brand {
    id: string;
    name: string;
    location: string;
    /**
     * Base earning rate for this brand (e.g., 0.1 for 10% back in points)
     * If not set, system default should be used (though not defined here yet).
     */
    earningRateOverride: number;
}

export interface TierBenefit {
    id: string;
    description: string;
}

export interface Tier {
    id: string;
    name: string;
    /**
     * Minimum Ranking Points required to enter this tier.
     */
    entryPoint: number;
    /**
     * Multiplier applied to base earning rate for members of this tier.
     * e.g., 1.5x
     */
    multiplier: number;
    benefits: TierBenefit[];
    /**
     * Hex color code for UI display.
     */
    visualColor: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    currentTierId: string;
    /**
     * DUAL-WALLET CONCEPT:
     * Ranking Points: Used ONLY for calculating Tier status. 
     * Typically cumulative and may reset based on `resetCycle`.
     * independent of spending.
     */
    rankingPoints: number;
    /**
     * DUAL-WALLET CONCEPT:
     * Reward Points: The actual currency user can spend.
     * Decreases when rewards are redeemed.
     */
    rewardPoints: number;
}

export type TransactionType = 'EARN' | 'REDEEM' | 'ADJUSTMENT';

export interface Transaction {
    id: string;
    type: TransactionType;
    /**
     * Amount added to Ranking Points (usually 0 for REDEEM).
     */
    amountRanking: number;
    /**
     * Amount added/subtracted from Reward Points.
     */
    amountReward: number;
    reason: string;
    timestamp: Date;
    customerId: string;
}

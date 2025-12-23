// src/lib/loyalty/mockData.ts
import { Brand, ProgramSettings, Tier, PointRule, EmailSetting } from './types';

export const MOCK_SETTINGS: ProgramSettings = {
    programName: 'Loyalty Customer',
    currencyName: 'Point',
    resetCycle: 'YEARLY',
};

export const MOCK_BRANDS: Brand[] = [
    { id: '1', name: 'Norra', location: 'Nguyễn Thị Diệu', earningRateOverride: 2.0, status: 'active' },
    { id: '2', name: 'Norra', location: 'Đông Du', earningRateOverride: 2.0, status: 'active' },
    { id: '3', name: 'Norra', location: 'Nguyễn Trãi', earningRateOverride: 1.0, status: 'active' },
    { id: '4', name: 'Norra', location: 'Thảo Điền', earningRateOverride: 1.5, status: 'active' },
    { id: '5', name: 'Norra', location: 'Thủ Đức', earningRateOverride: 0.5, status: 'active' },
];

export const MOCK_TIERS: Tier[] = [
    { id: 't1', name: 'Basic', entryPoint: 0, multiplier: 1.0, benefits: [], visualColor: 'basic' },
    { id: 't2', name: 'Gold', entryPoint: 800, multiplier: 1.5, benefits: [], visualColor: 'gold' },
    { id: 't3', name: 'Diamond', entryPoint: 2500, multiplier: 2.0, benefits: [], visualColor: 'diamond' },
];

export const MOCK_POINT_RULES: PointRule[] = [
    { id: '1', name: 'Happy Birthday', spending: '10,000 VND', earned: '10 points', status: 'active' },
    { id: '2', name: 'Purchase Product', spending: '10,000 VND', earned: '1 point', status: 'active' },
    { id: '3', name: 'Dine In', spending: '5,000 VND', earned: '10 points', status: 'active' },
    { id: '4', name: 'Designated Product', spending: 'per item', earned: 'per item', status: 'active' },
    { id: '5', name: 'Designated Product Group', spending: 'per group', earned: 'per group', status: 'active' },
];

export const MOCK_EMAILS: EmailSetting[] = [
    { id: '1', name: 'Welcome customers to your loyalty program', status: 'active' },
    { id: '2', name: 'Notify customers that they have enough points to redeem rewards', status: 'active' },
    { id: '3', name: 'Remind inactive customers to use their points', status: 'active' },
    { id: '4', name: 'Wish customers a happy birthday', status: 'active' },
];
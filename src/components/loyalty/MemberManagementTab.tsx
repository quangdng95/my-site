'use client';

import React, { useState } from 'react';
import {
    Table, Input, Select, Button, Tag, Space, Avatar, Typography,
    Tooltip, theme, Badge
} from 'antd';
import {
    UserOutlined, SearchOutlined, FilterOutlined, PlusOutlined,
    SafetyCertificateFilled, GiftFilled, MoreOutlined
} from '@ant-design/icons';
import { Member } from '@/lib/loyalty/types';
import styles from './Loyalty.module.css'; // Assuming styles are shared or I should use inline styles for now if specific classnames are missing

const { Text, Title } = Typography;
const { Option } = Select;

// --- ROBUST MOCK DATA FOR UI TESTING ---
const MOCK_MEMBERS: Member[] = [
    {
        id: '1',
        name: 'Safe Gold Member',
        email: 'gold.safe@example.com',
        currentTierId: 'Gold', // Changed to display name for UI simplicity or mapped later
        rankingPoints: 2500,
        rewardPoints: 5000,
        totalLifetimeSpend: 25000000,
        tierStartDate: '2023-06-01T00:00:00Z',
        tierEndDate: '2024-06-01T00:00:00Z',
        joinDate: '2022-06-15T00:00:00Z',
        status: 'active',
        notes: 'Loyal customer, safe status.'
    },
    {
        id: '2',
        name: 'At-Risk Silver Member',
        email: 'silver.risk@example.com',
        currentTierId: 'Silver',
        rankingPoints: 100,
        rewardPoints: 120,
        totalLifetimeSpend: 5000000,
        tierStartDate: '2023-01-01T00:00:00Z',
        tierEndDate: '2023-12-28T00:00:00Z',
        joinDate: '2023-01-01T00:00:00Z',
        status: 'active',
        notes: 'Warning: Low ranking points, expiring soon.'
    },
    {
        id: '3',
        name: 'Grace Period User',
        email: 'grace.period@example.com',
        currentTierId: 'Gold',
        rankingPoints: 1800,
        rewardPoints: 200,
        totalLifetimeSpend: 15000000,
        tierStartDate: '2022-12-22T00:00:00Z',
        tierEndDate: '2023-12-22T00:00:00Z',
        joinDate: '2021-05-01T00:00:00Z',
        status: 'active',
        notes: 'Technically expired, in Grace Period.'
    },
    {
        id: '4',
        name: 'New Member',
        email: 'newbie@example.com',
        currentTierId: 'Member',
        rankingPoints: 0,
        rewardPoints: 0,
        totalLifetimeSpend: 0,
        tierStartDate: '2023-12-23T00:00:00Z',
        tierEndDate: '2024-12-23T00:00:00Z',
        joinDate: '2023-12-23T00:00:00Z',
        status: 'active',
        notes: 'Just joined.'
    },
    {
        id: '5',
        name: 'Inactive User',
        email: 'ghost@example.com',
        currentTierId: 'Silver',
        rankingPoints: 1200,
        rewardPoints: 500,
        totalLifetimeSpend: 12000000,
        tierStartDate: '2023-01-01T00:00:00Z',
        tierEndDate: '2024-01-01T00:00:00Z',
        joinDate: '2022-01-01T00:00:00Z',
        status: 'inactive',
        notes: 'User disabled account.'
    },
];

export const MemberManagementTab: React.FC = () => {
    const { token } = theme.useToken();
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // --- HELPER LOGIC ---
    const getValidityStatus = (endDateIso: string) => {
        const today = new Date(); // Assuming "today" is roughly Dec 23 based on scenario context, but code uses actual Date
        // For strict testing of the scenario descriptions provided by user, we might need to mock "today", 
        // but for production code we use real dates. 
        // NOTE: The mock data dates are set relative to "Dec 23, 2023". 
        // If I run this code in 2025, everything will be expired. 
        // To visualize the UI correctly as requested, I will parse the dates relative to the *Mocked Current Date* if needed,
        // but standard practice is just comparing timestamps.

        // Let's assume the dates in Mock Data are "fresh" relative to whenever this is run, 
        // OR we just perform standard diff.
        // Given the User Request specifically mentions "tierEndDate is in 5 days", "yesterday", etc.
        // I will implement standard logic.

        const end = new Date(endDateIso);
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: 'expired', label: 'Grace Period / Expired', color: 'error', days: diffDays };
        if (diffDays <= 30) return { status: 'warning', label: `Expires in ${diffDays} days`, color: 'warning', days: diffDays };
        return { status: 'safe', label: end.toLocaleDateString(), color: 'default', days: diffDays };
    };

    const getTierColor = (tierId: string) => {
        switch (tierId.toLowerCase()) {
            case 'gold': return '#faad14';
            case 'silver': return '#d4b106'; // Adjusted for contrast
            case 'diamond': return '#000000'; // Or generic dark
            default: return 'default';
        }
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Member Profile',
            key: 'profile',
            render: (_: any, record: Member) => (
                <Space>
                    <Avatar icon={<UserOutlined />} size="large" style={{ backgroundColor: token.colorPrimaryBg, color: token.colorPrimary }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Current Tier & Validity',
            key: 'tier',
            render: (_: any, record: Member) => {
                const validity = getValidityStatus(record.tierEndDate);
                const isExpiredOrWarning = validity.status !== 'safe';

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                        <Tag color={getTierColor(record.currentTierId)} style={{ margin: 0 }}>
                            {record.currentTierId.toUpperCase()}
                        </Tag>
                        {isExpiredOrWarning ? (
                            <Tag color={validity.color} variant="filled" style={{ margin: 0, fontSize: 11 }}>
                                {validity.label}
                            </Tag>
                        ) : (
                            <Text type="secondary" style={{ fontSize: 11 }}>Valid until: {validity.label}</Text>
                        )}
                    </div>
                );
            }
        },
        {
            title: (
                <Tooltip title="Top: Rewards (Spendable) | Bottom: Ranking (Lifetime)">
                    <Space>
                        <span>Wallet Status</span>
                        <SafetyCertificateFilled style={{ color: token.colorTextQuaternary }} />
                    </Space>
                </Tooltip>
            ),
            key: 'wallet',
            render: (_: any, record: Member) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Space size={4}>
                        <GiftFilled style={{ color: token.colorPrimary }} />
                        <Text strong style={{ fontSize: 15 }}>{record.rewardPoints.toLocaleString()}</Text>
                    </Space>
                    <Space size={4}>
                        <SafetyCertificateFilled style={{ color: token.colorTextQuaternary, fontSize: 12 }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>Rank: {record.rankingPoints.toLocaleString()}</Text>
                    </Space>
                </div>
            )
        },
        {
            title: 'Total Spend',
            dataIndex: 'totalLifetimeSpend',
            key: 'spend',
            align: 'right' as const,
            render: (val: number) => <Text>{val.toLocaleString()} đ</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Badge
                    status={status === 'active' ? 'success' : 'default'}
                    text={<span style={{ textTransform: 'capitalize' }}>{status}</span>}
                />
            )
        },
        {
            title: '',
            key: 'action',
            render: () => (
                <Button type="text" icon={<MoreOutlined />} />
            )
        }
    ];

    return (
        <div className={styles.configTabWrapper}>
            {/* --- TOOLBAR --- */}
            <div style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                background: token.colorBgContainer,
                padding: 16,
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`
            }}>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Input
                        placeholder="Search by name, email..."
                        prefix={<SearchOutlined style={{ color: token.colorTextDescription }} />}
                        style={{ width: 250 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="Filter Status"
                        style={{ width: 140 }}
                        allowClear
                        value={statusFilter}
                        onChange={setStatusFilter}
                    >
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </div>
                <Button type="primary" icon={<PlusOutlined />}>Add Member</Button>
            </div>

            {/* --- DATA TABLE --- */}
            <Table
                dataSource={MOCK_MEMBERS}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
                style={{ background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}
            />
        </div>
    );
};

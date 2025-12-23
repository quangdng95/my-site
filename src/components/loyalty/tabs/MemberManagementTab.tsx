'use client';

import React, { useState } from 'react';
import {
    Table, Input, Select, Button, Tag, Space, Avatar, Typography,
    Tooltip, theme, Badge, Modal, Form, InputNumber, Divider, message
} from 'antd';
import {
    UserOutlined, SearchOutlined, FilterOutlined, PlusOutlined,
    SafetyCertificateFilled, GiftFilled, MoreOutlined,
    SafetyCertificateOutlined, DollarCircleOutlined
} from '@ant-design/icons';
import { Member } from '@/lib/loyalty/types';
import { adjustBalance, getTierValidityStatus, getDaysUntilExpiry } from '@/lib/loyalty/logic';
import { MemberDetailDrawer } from './MemberDetailDrawer';
import styles from '../Loyalty.module.css';

const { Text, Title } = Typography;
const { Option } = Select;

// --- ROBUST MOCK DATA FOR UI TESTING ---
const MOCK_MEMBERS: Member[] = [
    {
        id: '1',
        name: 'Safe Gold Member',
        email: 'gold.safe@example.com',
        currentTierId: 'Gold',
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
    const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form] = Form.useForm();

    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedMemberForDrawer, setSelectedMemberForDrawer] = useState<Member | null>(null);
    const [isAdjustModalVisible, setIsAdjustModalVisible] = useState(false);

    // --- HELPER LOGIC ---


    const getTierColor = (tierId: string) => {
        switch (tierId.toLowerCase()) {
            case 'gold': return '#faad14';
            case 'silver': return '#d4b106';
            case 'platinum': return '#722ed1'; // Purple/Violet
            case 'diamond': return '#000000';
            default: return 'default';
        }
    };

    // --- HANDLERS ---
    const showAdjustModal = (member: Member) => {
        setSelectedMember(member);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleAdjustCancel = () => {
        setIsModalVisible(false);
        setSelectedMember(null);
    };

    const handleAdjustConfirm = async () => {
        try {
            const values = await form.validateFields();
            // ... logic xử lý submit ...

            setIsAdjustModalVisible(false);
            form.resetFields();
        } catch (error: any) {
            // 👇 Thêm đoạn check này vô nè
            if (error?.errorFields) {
                // Đây là lỗi do chưa nhập form -> Kệ nó, không cần log đỏ lòm console
                console.log('Validation failed:', error);
            } else {
                // Đây mới là lỗi hệ thống nè -> Log đỏ để biết đường sửa
                console.error('System Error:', error);
            }
        } finally {
            setIsSubmitting(false);
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
                const status = getTierValidityStatus(record);
                const days = getDaysUntilExpiry(record.tierEndDate);

                let tagColor = 'default';
                let tagText = 'Active';

                switch (status) {
                    case 'WARNING':
                        tagColor = 'warning';
                        tagText = `Expires in ${days} days`;
                        break;
                    case 'GRACE_PERIOD':
                        tagColor = 'error';
                        tagText = `Grace Period (${Math.abs(days)} days ago)`;
                        break;
                    case 'EXPIRED':
                        tagColor = '#cf1322'; // Dark red
                        tagText = 'Expired';
                        break;
                    case 'OK':
                        tagColor = 'success';
                        tagText = `Valid until ${new Date(record.tierEndDate).toLocaleDateString()}`;
                        break;
                }

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                        <Tag color={getTierColor(record.currentTierId)} style={{ margin: 0 }}>
                            {record.currentTierId.toUpperCase()}
                        </Tag>
                        <Tag color={tagColor} variant="filled" style={{ margin: 0, fontSize: 11 }}>
                            {tagText}
                        </Tag>
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
            title: 'Action',
            key: 'action',
            render: (_: any, record: Member) => (
                <Button
                    type="link"
                    onClick={(e) => {
                        e.stopPropagation(); // <--- THÊM DÒNG NÀY (Chặn nổi bọt)
                        showAdjustModal(record);
                    }}
                >
                    Adjust Balance
                </Button>
            ),
        },
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
                dataSource={members}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
                style={{ background: token.colorBgContainer, borderRadius: token.borderRadiusLG }}
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedMemberForDrawer(record);
                        setIsDrawerOpen(true);
                    },
                    style: { cursor: 'pointer' }
                })}
            />

            {/* --- MEMBER DETAIL DRAWER --- */}
            <MemberDetailDrawer
                member={selectedMemberForDrawer}
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />

            {/* --- ADJUSTMENT MODAL --- */}
            <Modal
                title={`Adjust Balance for ${selectedMember?.name || ''}`}
                open={isModalVisible}
                onCancel={handleAdjustCancel}
                footer={[
                    <Button key="cancel" onClick={handleAdjustCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={isSubmitting} onClick={handleAdjustConfirm}>
                        Confirm Adjustment
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical">

                    <div style={{ marginBottom: 16 }}>
                        <Form.Item
                            label={<Space><SafetyCertificateOutlined /> <Text strong>Adjust Ranking Points (+/-)</Text></Space>}
                            name="amountRanking"
                            help="Updates Tier progress. Use for Friend & Family upgrades."
                        >
                            <InputNumber style={{ width: '100%' }} placeholder="0" />
                        </Form.Item>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <Form.Item
                            label={<Space><DollarCircleOutlined /> <Text strong>Adjust Reward Points (+/-)</Text></Space>}
                            name="amountReward"
                            help="Spendable currency. Use for Compensation or Gifts."
                        >
                            <InputNumber style={{ width: '100%' }} placeholder="0" />
                        </Form.Item>
                    </div>

                    <Divider />

                    <Form.Item
                        label="Adjustment Reason"
                        name="reason"
                        rules={[{ required: true, message: 'Please provide a reason for this adjustment' }]}
                    >
                        <Input.TextArea rows={3} placeholder="e.g., System error compensation" />
                    </Form.Item>

                </Form>
            </Modal>
        </div >
    );
};
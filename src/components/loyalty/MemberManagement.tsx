'use client';

import React, { useState } from 'react';
import { 
    Table, Input, Select, Button, Tag, Space, Avatar, Typography, Modal, 
    Form, InputNumber, Divider, message 
} from 'antd';
import { 
    UserOutlined, SearchOutlined, FilterOutlined, PlusOutlined, 
    SafetyCertificateFilled, DollarCircleFilled, SafetyCertificateOutlined, DollarCircleOutlined 
} from '@ant-design/icons';
import { Customer } from '@/lib/loyalty/types';
import { adjustBalance } from '@/lib/loyalty/logic';
import styles from './Loyalty.module.css';

const { Text } = Typography;
const { Option } = Select;

// --- MOCK DATA ---
const MOCK_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Alice Johnson', email: 'alice@example.com', currentTierId: 'Gold', rankingPoints: 5200, rewardPoints: 150 },
    { id: 'c2', name: 'Bob Smith', email: 'bob.smith@test.com', currentTierId: 'Silver', rankingPoints: 1200, rewardPoints: 45 },
    { id: 'c3', name: 'Charlie Brown', email: 'charlie@peanuts.com', currentTierId: 'Member', rankingPoints: 120, rewardPoints: 10 },
    { id: 'c4', name: 'Diana Prince', email: 'diana@themyscira.net', currentTierId: 'Gold', rankingPoints: 8500, rewardPoints: 2300 },
];

export const MemberManagement: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form] = Form.useForm();

    // --- HANDLERS ---

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchText) || 
        c.email.toLowerCase().includes(searchText) || 
        c.id.toLowerCase().includes(searchText)
    );

    const showAdjustModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleAdjustCancel = () => {
        setIsModalVisible(false);
        setSelectedCustomer(null);
    };

    const handleAdjustConfirm = async () => {
        try {
            const values = await form.validateFields();
            setIsSubmitting(true);
            
            if (!selectedCustomer) return;

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Execute Logic
            const { updatedCustomer } = adjustBalance(
                selectedCustomer,
                'ADJUSTMENT',
                values.amountRanking || 0,
                values.amountReward || 0,
                values.reason
            );

            // Update Local State
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
            
            message.success(`Balance updated successfully for ${updatedCustomer.name}`);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Validation Failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- COLUMNS ---

    const columns = [
        {
            title: 'Member Info',
            key: 'info',
            render: (_: any, record: Customer) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div className={styles.memberInfoWrapper}>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary" className={styles.memberInfoEmail}>{record.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Current Tier',
            dataIndex: 'currentTierId',
            key: 'tier',
            render: (tierId: string) => {
                let color = 'default';
                if (tierId === 'Gold') color = '#722ed1'; // Purple
                if (tierId === 'Silver') color = '#d4b106'; // Gold/Yellow
                
                return <Tag color={color}>{tierId.toUpperCase()}</Tag>;
            }
        },
        {
            title: (
                <Space>
                    <SafetyCertificateFilled style={{ color: '#1890ff' }} />
                    <span>Status Wallet (Ranking)</span>
                </Space>
            ),
            dataIndex: 'rankingPoints',
            key: 'ranking',
            render: (points: number) => (
                <div className={styles.rankingWrapper}>
                    <Text strong className={styles.rankingValue}>
                         {points.toLocaleString()}
                    </Text>
                    <Text type="secondary" className={styles.rankingLabel}>LIFETIME POINTS</Text>
                </div>
            )
        },
        {
            title: (
                <Space>
                    <DollarCircleFilled style={{ color: '#d48806' }} />
                    <span>Spendable Wallet (Reward)</span>
                </Space>
            ),
            dataIndex: 'rewardPoints',
            key: 'reward',
            render: (points: number) => (
                <div className={styles.rewardWrapper}>
                    <Text strong className={styles.rewardValue}>
                        {points.toLocaleString()}
                    </Text>
                    <Text type="secondary" className={styles.rewardLabel}>AVAILABLE TO SPEND</Text>
                </div>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Customer) => (
                <Button type="link" onClick={() => showAdjustModal(record)}>
                    Adjust Balance
                </Button>
            ),
        },
    ];

    return (
        <div>
            {/* TOOLBAR */}
            <div className={styles.toolbar}>
                 <Input.Search 
                    placeholder="Search by name, email or ID..." 
                    allowClear 
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
                <Space>
                    <Select placeholder="Filter by Tier" className={styles.filterSelect} allowClear>
                        <Option value="Gold">Gold</Option>
                        <Option value="Silver">Silver</Option>
                        <Option value="Member">Member</Option>
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />}>Add Member</Button>
                </Space>
            </div>

            {/* DATA TABLE */}
            <Table 
                columns={columns} 
                dataSource={filteredCustomers} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
            />

            {/* ADJUSTMENT MODAL */}
            <Modal
                title={`Adjust Balance for ${selectedCustomer?.name || ''}`}
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
                    
                    <div className={styles.adjustmentRankingWrapper}>
                        <Form.Item 
                            label={<Space><SafetyCertificateOutlined className={styles.rankingIcon}/> <Text strong>Adjust Ranking Points (+/-)</Text></Space>} 
                            name="amountRanking"
                            help="Updates Tier progress. Use for Friend & Family upgrades."
                        >
                            <InputNumber className={styles.fullWidthInput} placeholder="0" />
                        </Form.Item>
                    </div>

                    <div className={styles.adjustmentRewardWrapper}>
                        <Form.Item 
                            label={<Space><DollarCircleOutlined className={styles.rewardIcon}/> <Text strong>Adjust Reward Points (+/-)</Text></Space>} 
                            name="amountReward"
                            help="Spendable currency. Use for Compensation or Gifts."
                        >
                             <InputNumber className={styles.fullWidthInput} placeholder="0" />
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
        </div>
    );
};

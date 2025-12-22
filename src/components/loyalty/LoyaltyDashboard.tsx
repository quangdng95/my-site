'use client';

import React, { useState } from 'react';
import { 
    Tabs, Card, Form, Input, Select, Table, InputNumber, Row, Col, Typography, Button, Tag, Tooltip 
} from 'antd';
import { 
    SketchOutlined, CrownOutlined, SafetyCertificateOutlined, GiftOutlined, PlusOutlined, EditOutlined
} from '@ant-design/icons';
import { Brand, ProgramSettings, Tier } from '@/lib/loyalty/types';
import { MemberManagement } from './MemberManagement';
import styles from './Loyalty.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

// --- MOCK DATA ---
const MOCK_SETTINGS: ProgramSettings = {
    programName: 'Coffee Lovers Club',
    currencyName: 'Beans',
    resetCycle: 'YEARLY'
};

const MOCK_BRANDS: Brand[] = [
    { id: '1', name: 'Nguyễn Thị Diệu', location: 'Quận 3', earningRateOverride: 0.1 },
    { id: '2', name: 'Đông Du', location: 'Quận 1', earningRateOverride: 0.15 },
    { id: '3', name: 'Thảo Điền', location: 'Quận 2', earningRateOverride: 0.05 },
];

const MOCK_TIERS: Tier[] = [
    { 
        id: 't1', 
        name: 'Member', 
        entryPoint: 0, 
        multiplier: 1.0, 
        benefits: [{id: 'b1', description: 'Standard earning rate'}], 
        visualColor: '#8c8c8c' 
    },
    { 
        id: 't2', 
        name: 'Silver', 
        entryPoint: 500, 
        multiplier: 1.2, 
        benefits: [{id: 'b2', description: '1.2x Earning'}, {id: 'b3', description: 'Free Birthday Cookie'}], 
        visualColor: '#d4b106' // Darker yellow/gold
    },
    { 
        id: 't3', 
        name: 'Gold', 
        entryPoint: 2000, 
        multiplier: 1.5, 
        benefits: [{id: 'b4', description: '1.5x Earning'}, {id: 'b5', description: 'Priority Service'}, {id: 'b6', description: 'Free Upsize'}], 
        visualColor: '#722ed1' // Purple
    },
];

export const LoyaltyDashboard: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [settings, setSettings] = useState<ProgramSettings>(MOCK_SETTINGS);
    const [brands] = useState<Brand[]>(MOCK_BRANDS);
    const [tiers] = useState<Tier[]>(MOCK_TIERS);

    // --- RENDERERS ---

    const renderConfigurationTab = () => (
        <div className={styles.configTabWrapper}>
            
            {/* SECTION A: GENERAL SETTINGS */}
            <Card title="General Settings" variant="borderless">
                <Form layout="vertical" initialValues={settings}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item label="Program Name" name="programName">
                                <Input placeholder="e.g. My Rewards" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Currency Name" name="currencyName">
                                <Input placeholder="e.g. Points, Stars" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Ranking Reset Cycle" name="resetCycle">
                                <Select>
                                    <Option value="YEARLY">Yearly</Option>
                                    <Option value="ROLLING_12_MONTHS">Rolling 12 Months</Option>
                                    <Option value="NEVER">Never</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {/* SECTION B: PARTICIPATING BRANDS */}
            <Card title="Store Brands & Earning Rules" variant="borderless" styles={{ body: { padding: 0, overflow: 'hidden' } }}>
                <Table 
                    dataSource={brands} 
                    rowKey="id" 
                    pagination={false}
                >
                    <Table.Column title="Brand Name" dataIndex="name" />
                    <Table.Column title="Location" dataIndex="location" />
                    <Table.Column 
                        title="Earning Rate" 
                        dataIndex="earningRateOverride"
                        render={(rate: number) => (
                            <div className={styles.earningRateRender}>
                                <InputNumber 
                                    defaultValue={rate} 
                                    min={0} 
                                    step={0.01} 
                                    className={styles.earningRateInput}
                                />
                                <Text type="secondary" className={styles.earningRateText}>
                                    Current: {rate * 100}% back in points
                                    <br />
                                    ({rate} points per $1)
                                </Text>
                            </div>
                        )}
                    />
                </Table>
            </Card>

            {/* SECTION C: MEMBERSHIP TIERS */}
            <Card title="Membership Tiers" variant="borderless">
                <Row gutter={[16, 16]}>
                    {tiers.map(tier => (
                        <Col key={tier.id} xs={24} sm={12} md={8} lg={6}>
                            <Card 
                                type="inner"
                                hoverable
                                actions={[
                                    <Button key="edit" type="text" icon={<EditOutlined />}>Edit Tier</Button>
                                ]}
                                style={{ borderColor: tier.visualColor }}
                                className={styles.tierCard}
                            >
                                <div className={styles.tierHeader}>
                                    <Tag color={tier.visualColor} className={styles.tierTag}>
                                        <CrownOutlined className={styles.tierCrownIcon}/> 
                                        {tier.name.toUpperCase()}
                                    </Tag>
                                </div>
                                
                                <div className={styles.tierPoints}>
                                    <Tooltip title="Cumulative points required to enter this tier">
                                        <div className={styles.tierPointsWrapper}>
                                            <SafetyCertificateOutlined className={styles.tierShieldIcon} />
                                            <Title level={3} className={styles.tierPointsValue}>{tier.entryPoint.toLocaleString()}</Title>
                                        </div>
                                    </Tooltip>
                                    <Text type="secondary">Ranking Points Required</Text>
                                </div>

                                <div className={styles.tierMultiplier}>
                                    <div className={styles.tierMultiplierWrapper}>
                                        <GiftOutlined />
                                        <Text strong>{tier.multiplier}x Reward Earning</Text>
                                    </div>
                                </div>

                                <div>
                                    <Text type="secondary" className={styles.tierBenefitsTitle}>Benefits:</Text>
                                    <ul className={styles.tierBenefitsList}>
                                        {tier.benefits.map(b => (
                                            <li key={b.id}>{b.description}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Card>
                        </Col>
                    ))}
                    
                    {/* CREATE NEW TIER CARD */}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Button 
                            type="dashed" 
                            className={styles.createTierBtn}
                            icon={<PlusOutlined className={styles.createTierIcon} />}
                        >
                            Create New Tier
                        </Button>
                    </Col>
                </Row>
            </Card>
        </div>
    );

    return (
        <div className={styles.pageWrapper}>
             <Title level={2} className={styles.pageTitle}>
                <SketchOutlined className={styles.pageTitleIcon}/>
                Loyalty & Rewards Program
            </Title>
            
            <Tabs 
                defaultActiveKey="config" 
                items={[
                    { key: 'config', label: 'Program Configuration', children: renderConfigurationTab() },
                    { key: 'members', label: 'Member Management', children: <MemberManagement /> },
                ]}
            />
        </div>
    );
};

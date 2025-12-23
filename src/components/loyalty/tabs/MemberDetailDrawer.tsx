'use client';

import React from 'react';
import {
    Drawer, Avatar, Typography, Tag, Tabs, Card, Statistic,
    Row, Col, Alert, Progress, Timeline, Descriptions, Space, Button, Divider
} from 'antd';
import {
    UserOutlined, CrownOutlined, SafetyCertificateFilled, GiftFilled,
    HistoryOutlined, IdcardOutlined, SmileOutlined, ShopOutlined
} from '@ant-design/icons';
import { Member, Tier } from '@/lib/loyalty/types';
import { getTierValidityStatus, getDaysUntilExpiry, getNextTierProgress } from '@/lib/loyalty/logic';



const { Title, Text } = Typography;

interface Props {
    member: Member | null;
    open: boolean;
    onClose: () => void;
}

export const MemberDetailDrawer: React.FC<Props> = ({ member, open, onClose }) => {
    if (!member) return null;

    // --- HELPER LOGIC (Duplicated for visualization) ---
    // --- LOGIC INTEGRATION ---
    const validityStatus = getTierValidityStatus(member);
    const daysUntilExpiry = getDaysUntilExpiry(member.tierEndDate);
    const progress = getNextTierProgress(member.rankingPoints, member.currentTierId);

    // --- HELPER FOR ALERT ---
    const getAlertProps = () => {
        switch (validityStatus) {
            case 'EXPIRED': return { type: 'error' as const, msg: 'Tier Expired', desc: 'This member\'s tier has expired. Please review.' };
            case 'GRACE_PERIOD': return { type: 'error' as const, msg: 'Grace Period', desc: `Tier expired ${Math.abs(daysUntilExpiry)} days ago. Member is in grace period.` };
            case 'WARNING': return { type: 'warning' as const, msg: 'Expiration Warning', desc: `Tier expires in ${daysUntilExpiry} days.` };
            default: return null;
        }
    };

    const alertInfo = getAlertProps();

    // --- TABS ITEMS ---
    const OverviewTab = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 1. Validity Alert */}
            {alertInfo && (
                <Alert
                    title={alertInfo.msg}
                    description={alertInfo.desc}
                    type={alertInfo.type}
                    showIcon
                />
            )}

            {/* 2. Wallet Cards */}
            <Row gutter={16}>
                <Col span={12}>
                    <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                        <Statistic
                            title={<Space><GiftFilled style={{ color: '#52c41a' }} /> Reward Points</Space>}
                            value={member.rewardPoints}
                            precision={0}
                            styles={{
                                content: { color: '#52c41a' } // Chuyển màu vô trong content
                            }}
                            suffix="pts"
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>Spendable Currency</Text>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card size="small">
                        <Statistic
                            title={<Space><SafetyCertificateFilled style={{ color: '#1890ff' }} /> Ranking Points</Space>}
                            value={member.rankingPoints}
                            precision={0}
                            styles={{
                                content: { color: '#52c41a' }
                            }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>Lifetime Tier Progress</Text>
                    </Card>
                </Col>
            </Row>

            {/* 3. Progress to Next Tier */}
            <Card title="Tier Progress" size="small">
                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                    {progress.nextTierName ? (
                        <>
                            <Text strong>{member.rankingPoints} / {member.rankingPoints + progress.pointsNeeded}</Text>
                            <Text type="secondary"> points. Needs {progress.pointsNeeded} more for {progress.nextTierName}</Text>
                        </>
                    ) : (
                        <Text strong type="success">Top Tier Reached!</Text>
                    )}
                </div>
                <Progress
                    percent={progress.progressPercent}
                    status="active"
                    strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                />
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <Tag>{member.currentTierId}</Tag>
                    {progress.nextTierName && <Tag color="purple">{progress.nextTierName}</Tag>}
                </div>
            </Card>

            {/* 4. Quick Actions */}
            <Divider titlePlacement="left" plain>Quick Actions</Divider>
            <Space wrap>
                <Button type="primary">Add Points</Button>
                <Button>Redeem Reward</Button>
                <Button danger>Block Member</Button>
            </Space>
        </div>
    );

    const HistoryTab = () => (
        <Timeline
            items={[
                {
                    color: 'green',
                    content: (
                        <>
                            <Text strong>Earned 150 Points</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>Yesterday - Order #12345</Text>
                        </>
                    ),
                },
                {
                    color: 'blue',
                    content: (
                        <>
                            <Text strong>Tier Upgrade: Gold</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>Jan 15, 2023 - System Auto</Text>
                        </>
                    ),
                },
                {
                    color: 'red',
                    content: (
                        <>
                            <Text strong>Redeemed 500 Points (Voucher 50k)</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>Dec 20, 2022</Text>
                        </>
                    ),
                },
                {
                    color: 'gray',
                    content: (
                        <>
                            <Text strong>Joined Program</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>{new Date(member.joinDate).toLocaleDateString()}</Text>
                        </>
                    ),
                },
            ]}
        />
    );

    const ProfileTab = () => (
        <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Full Name">{member.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{member.email}</Descriptions.Item>
            <Descriptions.Item label="Current Tier">{member.currentTierId.toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="Tier Start Date">{new Date(member.tierStartDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Tier End Date">{new Date(member.tierEndDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Join Date">{new Date(member.joinDate).toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label="Total Spent">{member.totalLifetimeSpend.toLocaleString()} đ</Descriptions.Item>
            <Descriptions.Item label="Status">
                <Tag color={member.status === 'active' ? 'green' : 'red'}>{member.status.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Notes">{member.notes || '-'}</Descriptions.Item>
        </Descriptions>
    );

    const items = [
        { key: '1', label: <span><CrownOutlined /> Overview</span>, children: <OverviewTab /> },
        { key: '2', label: <span><HistoryOutlined /> History</span>, children: <HistoryTab /> },
        { key: '3', label: <span><IdcardOutlined /> Profile</span>, children: <ProfileTab /> },
    ];

    return (
        <Drawer
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar size="large" icon={<UserOutlined />} src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Title level={5} style={{ margin: 0 }}>{member.name}</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>{member.email}</Text>
                    </div>
                    <Tag color={alertInfo?.type === 'error' ? 'red' : alertInfo?.type === 'warning' ? 'orange' : 'green'} style={{ marginLeft: 'auto' }}>
                        {member.currentTierId.toUpperCase()}
                    </Tag>
                </div>
            }
            placement="right"
            size="large"
            onClose={onClose}
            open={open}
        >
            <Tabs defaultActiveKey="1" items={items} />
        </Drawer>
    );
};

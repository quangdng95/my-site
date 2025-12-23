'use client';
import React, { useState, useEffect } from 'react';
import {
    Card, Form, Input, Select, Row, Col, Typography, Space, theme, Button, Tag
} from 'antd';
import {
    BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
    UnorderedListOutlined, OrderedListOutlined, AlignLeftOutlined, AlignCenterOutlined,
    TrophyOutlined, FireOutlined, StarOutlined, SmileOutlined, CheckCircleOutlined,
    PlusOutlined, EditOutlined
} from '@ant-design/icons';
import { MOCK_SETTINGS, MOCK_TIERS } from '@/lib/loyalty/mockData';
import styles from '../Loyalty.module.css'; // 👈 Chỉnh lại đường dẫn CSS nếu cần

const { Title, Text } = Typography;

export const GeneralTab = () => {
    const { token } = theme.useToken();
    const [settings] = useState(MOCK_SETTINGS);
    const [tiers] = useState(MOCK_TIERS);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true); // Khi nào chạy trên trình duyệt thì mới bật lên
    }, []);

    // Helper function nằm gọn trong file này
    const getTierStyles = (visualKey: string) => {
        switch (visualKey) {
            case 'gold':
                return {
                    borderColor: token['gold-5'] || '#faad14',
                    iconColor: token['gold-6'] || '#faad14',
                    badgeBg: token['gold-1'] || '#fffbe6',
                    titleColor: token.colorTextBase
                };
            case 'diamond':
                return {
                    borderColor: token.colorBgSolid || '#000',
                    iconColor: token.colorBgSolid || '#000',
                    badgeBg: token.colorFillQuaternary,
                    titleColor: token.colorTextBase
                };
            default: // Basic
                return {
                    borderColor: token.colorBorderSecondary,
                    iconColor: token.colorTextQuaternary,
                    badgeBg: token.colorFillQuaternary,
                    titleColor: token.colorTextBase
                };
        }
    };

    const CustomDivider = () => (
        <div style={{
            width: 1, height: '1.2em', backgroundColor: token.colorSplit,
            margin: '0 4px', display: 'inline-block', verticalAlign: 'middle'
        }} />
    );

    return (
        < div className={styles.configTabWrapper} >
            {/* --- PHẦN 1: PROGRAM INFORMATION --- */}
            <Card variant="borderless" className={styles.sectionCard}>
                <div style={{ marginBottom: 16 }}>
                    <Title level={4} style={{ marginBottom: 8 }}>Program Information</Title>
                    <Text type="secondary">This information will be displayed in the customer&apos;s account.</Text>
                </div>
                <Row gutter={48}>
                    <Col xs={24} lg={14}>
                        <Form layout="vertical" initialValues={settings}>
                            <Form.Item label={<Text>Program Name</Text>} name="programName" required style={{ marginBottom: 16 }}>
                                <Input size="large" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item label={<Text>Point Name</Text>} name="currencyName" required style={{ marginBottom: 16 }}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    {/* 👇 Đã fix lỗi defaultValue thành initialValue */}
                                    <Form.Item label={<Text>Abbr</Text>} name="abbr" required style={{ marginBottom: 16 }}>
                                        <Input size="large" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div style={{ marginBottom: 24 }}>
                                <Text type="secondary">Preview: You just earned 100 points</Text>
                            </div>
                            <Form.Item label={<span style={{ color: token.colorTextSecondary }}>Description (optional)</span>} name="description">
                                <div className={styles.richTextContainer}>
                                    <div className={styles.richTextToolbar}>
                                        <Space size="small">
                                            {isMounted && (
                                                <Select
                                                    defaultValue="Sans Serif"
                                                    variant="borderless"
                                                    style={{ width: 100 }}
                                                    size="small"
                                                    options={[{ value: 'Sans Serif', label: 'Sans Serif' }]}
                                                />
                                            )}
                                            <CustomDivider />
                                            <BoldOutlined /> <ItalicOutlined /> <UnderlineOutlined /> <StrikethroughOutlined />
                                            <CustomDivider />
                                            <UnorderedListOutlined /> <OrderedListOutlined /> <AlignLeftOutlined /> <AlignCenterOutlined />
                                        </Space>
                                    </div>
                                    <Input.TextArea
                                        rows={6}
                                        defaultValue={`Based on growth points over 12 months...`}
                                        className={styles.richTextArea}
                                        variant="borderless"
                                    />
                                    <div className={styles.richTextResizeHandle}></div>
                                </div>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col xs={24} lg={10}>
                        <div style={{ marginBottom: 16 }}>
                            <Text style={{ display: 'block', marginBottom: 8 }}>Point Icon</Text>
                            <div className={styles.iconGrid}>
                                <div className={`${styles.iconItem} ${styles.active}`}><TrophyOutlined /></div>
                                <div className={styles.iconItem}><FireOutlined /></div>
                                <div className={styles.iconItem}><StarOutlined /></div>
                                <div className={styles.iconItem}><SmileOutlined /></div>
                                <div className={styles.iconItem}><StarOutlined rotate={45} /></div>
                                <div className={styles.iconItem}><PlusOutlined /></div>
                                <div className={styles.iconItem}><StarOutlined /></div>
                                <div className={styles.iconItem}><CheckCircleOutlined /></div>
                            </div>
                        </div>
                        <div style={{ marginBottom: 8 }}><Text>Live Preview</Text></div>
                        <div className={styles.livePreviewContainer}>
                            <div className={styles.previewCard}>
                                <div className={styles.previewHeader}>
                                    <div className={styles.previewSkeletonLine} style={{ width: '40%' }}></div>
                                    <div className={styles.previewSkeletonLine} style={{ width: '20%' }}></div>
                                    <TrophyOutlined style={{ marginLeft: 'auto', fontSize: 16 }} />
                                </div>
                                <div className={styles.previewBody}>
                                    <div className={styles.previewSkeletonBlock}></div>
                                    <div className={styles.previewSkeletonBlock} style={{ width: '30%', marginLeft: 'auto' }}></div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* --- PHẦN 2: MEMBERSHIP TIERS --- */}
            <Card variant="borderless" className={styles.sectionCard}>
                <div style={{ marginBottom: 16 }}>
                    <Title level={4} style={{ marginBottom: 4 }}>Membership Level</Title>
                    <Text type="secondary">Levels are automatically ranked by entry points.</Text>
                </div>
                <Row gutter={[24, 24]}>
                    {tiers.map((tier, index) => {
                        const styleProps = getTierStyles(tier.visualColor);
                        return (
                            <Col key={tier.id} xs={24} sm={12} lg={6}>
                                <Card
                                    className={styles.tierCard}
                                    style={{ borderLeft: `5px solid ${styleProps.borderColor}`, height: '100%' }}
                                    styles={{ body: { padding: '24px' }, actions: { borderTop: 'none' } }}
                                    actions={[
                                        <Button type="text" key="edit" icon={<EditOutlined />}>Edit Tier</Button>
                                    ]}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
                                        <div><Title level={4} style={{ margin: 0, color: styleProps.titleColor }}>{tier.name}</Title></div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <Tag style={{ margin: 0, border: 'none', background: '#f5f5f5', color: '#666' }}>Level {index + 1}</Tag>
                                            <div className={styles.tierIconBox}><TrophyOutlined style={{ fontSize: 20, color: '#666' }} /></div>
                                        </div>
                                    </div>
                                    <Row gutter={16}>
                                        <Col span={12}><Text type="secondary" style={{ fontSize: 13 }}>Earning Rate</Text><div className={styles.infoPill}><Text strong>{tier.multiplier}x pts</Text></div></Col>
                                        <Col span={12}><Text type="secondary" style={{ fontSize: 13 }}>Entry Level</Text><div className={styles.infoPill}><Text strong>{tier.entryPoint.toLocaleString()} pts</Text></div></Col>
                                    </Row>
                                </Card>
                            </Col>
                        );
                    })}
                    <Col xs={24} sm={12} lg={6}>
                        <div className={styles.createTierCard}>
                            <Button type="primary" ghost icon={<PlusOutlined />} style={{ border: 'none', background: 'transparent' }}>Add Membership Tier</Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div >
    );
};
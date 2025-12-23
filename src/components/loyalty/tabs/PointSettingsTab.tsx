'use client';
import React, { useState } from 'react';
import { Card, Table, Typography, Button, InputNumber, Switch, Space, Row, Col, Select, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MOCK_BRANDS, MOCK_POINT_RULES } from '@/lib/loyalty/mockData';
import styles from '../Loyalty.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

export const PointSettingsTab = () => {
    const { token } = theme.useToken();
    const [brands] = useState(MOCK_BRANDS);
    const [rules] = useState(MOCK_POINT_RULES);

    return (

        <div className={styles.configTabWrapper}>
            <Card variant="borderless" className={styles.sectionCard}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Title level={4} style={{ marginBottom: 4 }}>Participating Brands/Location</Title>
                        <Text type="secondary">Manage the ways customers earn points.</Text>
                    </div>
                    <Button type="primary" style={{ background: token.colorSuccessBg, color: token.colorSuccess, borderColor: token.colorSuccessBg }} icon={<PlusOutlined />}>Add Point Calculation Method</Button>
                </div>

                <Card variant="borderless" className={styles.sectionCard} styles={{ body: { padding: 0 } }}>
                    <Table dataSource={brands} rowKey="id" pagination={false} scroll={{ x: 'max-content' }}>
                        <Table.Column title="Brand Name" dataIndex="name" width="20%" />
                        <Table.Column title="Location" dataIndex="location" width="20%" />
                        <Table.Column title="Base Earning Rate" dataIndex="earningRateOverride" width="30%" render={(rate: number) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <InputNumber defaultValue={rate} min={0} step={0.1} precision={1} style={{ width: 70 }} variant="borderless" />
                                <Text type="secondary">pts / 40.000đ</Text>
                            </div>
                        )} />
                        <Table.Column title="Status" width="10%" render={(status: string) => <Switch defaultChecked={status === 'active'} style={{ background: token.colorPrimary }} />} />
                        <Table.Column title="Action" width="20%" align="right" render={() => <Space><Button type="link" size="small">Edit</Button><Button type="link" size="small" style={{ color: token.colorTextSecondary }}>Delete</Button></Space>} />
                    </Table>
                </Card>
            </Card>

            <Card variant="borderless" className={styles.sectionCard} styles={{
                header: {
                    padding: '16px 16px',
                    minHeight: 'auto',
                    borderBottom: 'none'
                }
            }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Title level={4} style={{ marginBottom: 4 }}>Point Calculation</Title>
                        <Text type="secondary">Manage the ways customers earn points.</Text>
                    </div>
                    <Button type="primary" style={{ background: token.colorSuccessBg, color: token.colorSuccess, borderColor: token.colorSuccessBg }} icon={<PlusOutlined />}>Add Point Calculation Method</Button>
                </div>

                <Row gutter={24} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <Text strong>Point Calculation Basis</Text>
                        <Select size="large" defaultValue="subtotal" style={{ width: '100%', marginTop: 8 }}>
                            <Option value="subtotal">Subtotal (Before Tax & Shipping)</Option>
                        </Select>
                    </Col>
                    <Col span={12}>
                        <Text strong>Points Expiration</Text>
                        <div style={{ display: 'flex', marginTop: 8 }}>
                            <Select size="large" defaultValue="no_expiry" style={{ width: '100%' }}>
                                <Option value="no_expiry">No Expiration</Option>
                            </Select>
                            <Select size="large" defaultValue="months" style={{ width: 100, marginLeft: 8 }} disabled value="months"><Option value="months">months</Option></Select>
                        </div>
                    </Col>
                </Row>

                <Card variant="borderless" className={styles.sectionCard} styles={{ body: { padding: 0 } }}>
                    <Table dataSource={rules} rowKey="id" pagination={false} scroll={{ x: 'max-content' }}>
                        <Table.Column title="Point Calculation" dataIndex="name" width="30%" />
                        <Table.Column title="Spending" dataIndex="spending" width="20%" align="right" />
                        <Table.Column title="Points Earned" dataIndex="earned" width="20%" align="right" />
                        <Table.Column title="Status" width="10%" align="center" render={(status: string) => <Switch defaultChecked={status === 'active'} style={{ background: token.colorPrimary }} />} />
                        <Table.Column title="Action" width="20%" align="right" render={() => <Space><Button type="link" size="small">Edit</Button><Button type="link" size="small" style={{ color: token.colorTextSecondary }}>Delete</Button></Space>} />
                    </Table>
                </Card>
            </Card>
        </div>

    );
};
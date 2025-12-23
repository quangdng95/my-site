'use client';
import React, { useState } from 'react';
import { Card, Table, Typography, Switch, theme } from 'antd';
import { MOCK_EMAILS } from '@/lib/loyalty/mockData';
import styles from '../Loyalty.module.css';

const { Title, Text } = Typography;

export const EmailTab = () => {
    const { token } = theme.useToken();
    const [emails] = useState(MOCK_EMAILS);

    return (
        <div className={styles.configTabWrapper}>
            <Card variant="borderless" className={styles.sectionCard}>

                <div style={{ marginBottom: 16 }}>
                    <Title level={4} style={{ marginBottom: 4 }}>Automated Email</Title>
                    <Text type="secondary">Attract customers to maximize the effectiveness of your loyalty program.</Text>
                </div>
                <Card variant="borderless" className={styles.sectionCard} styles={{ body: { padding: 0 } }}>
                    <Table dataSource={emails} rowKey="id" pagination={false} scroll={{ x: 'max-content' }}>
                        <Table.Column title="Email Information" dataIndex="name" width="80%" />
                        <Table.Column title="Status" width="20%" align="right" render={(status: string) => <Switch defaultChecked={status === 'active'} style={{ background: token.colorPrimary }} />} />
                    </Table>
                </Card>
            </Card>
        </div>
    );
};
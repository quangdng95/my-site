'use client';

import React, { useState } from 'react';
import { Tabs, Typography, Button, theme, Card, Breadcrumb } from 'antd';
import { GeneralTab } from './tabs/GeneralTab';
import { PointSettingsTab } from './tabs/PointSettingsTab';
import { MemberManagementTab } from './tabs/MemberManagementTab';
import { EmailTab } from './tabs/EmailTab';

import styles from './Loyalty.module.css';

const { Title, Text } = Typography;

export const LoyaltyDashboard: React.FC = () => {
    const { token } = theme.useToken();

    // 1. Dùng State để tự quản lý đang đứng ở Tab nào
    const [activeTab, setActiveTab] = useState('general');

    // 2. Danh sách các Tab (Chỉ có tên, không có ruột ở đây)
    const tabItems = [
        { key: 'general', label: 'General' },
        { key: 'settings', label: 'Point Settings' },
        { key: 'members', label: 'Member Management' }, // Đổi tên theo ý bạn
        { key: 'email', label: 'Email Settings' },
    ];

    // 3. Hàm render nội dung dựa theo State
    const renderContent = () => {
        switch (activeTab) {
            case 'general': return <GeneralTab />;
            case 'settings': return <PointSettingsTab />;
            case 'members': return <MemberManagementTab />;
            case 'email': return <EmailTab />;
            default: return <GeneralTab />;
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* --- PHẦN HEADER CARD (Chứa Title + Button + Tabs Nav) --- */}
            <div
                style={{
                    backgroundColor: token.colorBgContainer, // Màu trắng
                    borderRadius: token.borderRadiusLG,      // Bo góc
                    padding: '24px 24px 0 24px',             // Padding trên/trái/phải (Dưới = 0 để Tab dính đáy)
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'  // Đổ bóng nhẹ cho nổi
                }}
            >
                {/* Dòng 1: Title & Button */}
                <Breadcrumb style={{ marginBottom: 16 }}
                    items={[
                        { title: 'Configuration' },
                        { title: 'Loyalty' },
                    ]}>
                </Breadcrumb>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <Title level={2} style={{ margin: 0, fontWeight: 700, display: 'inline-block' }}>Loyalty</Title>
                    </div>
                    <Button type="primary" size="large" style={{ background: token.colorPrimary }}>
                        Save Change
                    </Button>

                </div>


                {/* Dòng 2: Thanh Tab nằm lọt thỏm trong Card này luôn */}
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab} // Khi bấm Tab thì set lại State
                    items={tabItems}
                    tabBarStyle={{ marginBottom: 0 }} // Quan trọng: Xóa khoảng trắng dưới đít Tab
                    size="large"
                />
            </div>

            {/* --- PHẦN NỘI DUNG (Nằm tách biệt ở dưới nền xám) --- */}
            <div className={styles.tabContentContainer} style={{ padding: '24px' }}>
                {renderContent()}
            </div>
        </div>
    );
};
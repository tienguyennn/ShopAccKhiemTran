'use client';
import { SwapLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  return (
    <Button
      icon={<SwapLeftOutlined />}
      size="small"
      variant="outlined"
      color="default"
      onClick={() => window.history.back()}
    >
      Trở về
    </Button>
  );
};

export default BackButton;

import { SearchOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import React from 'react';

const NavSearch = () => {
  return (
    <Form className="w-full">
      <Form.Item name="keyWord" className="mb-0">
        <Input placeholder="Thông tin tìm kiếm" suffix={<SearchOutlined />} />
      </Form.Item>
    </Form>
  );
};

export default NavSearch;

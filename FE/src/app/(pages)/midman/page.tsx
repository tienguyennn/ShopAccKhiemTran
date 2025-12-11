'use client';
import React from 'react';
import ContainerFluid from '../components/container/ContainerFluid';
import CustomCard from '../components/CustomCard';
import { BankOutlined, FilterFilled, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, Input, Row, Space } from 'antd';

const page = () => {
  return (
    <ContainerFluid img="/img/bg-s7.png">
      <div className="container">
        <CustomCard title="Tìm kiếm giao dịch" icon={<FilterFilled />}>
          <Form layout="vertical">
            <Row gutter={16} className="items-end">
              <Col span={8}>
                <Form.Item label={<div className="text-white">Code</div>}>
                  <Input placeholder="Mã giao dịch" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={
                    <div className="text-white">Code Check / Message ID</div>
                  }
                >
                  <Input placeholder="Nhập mã giao dịch có trên QR code" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <Button
                    type="primary"
                    className="w-full"
                    icon={<SearchOutlined />}
                  >
                    Check thông tin
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </CustomCard>
        <div>
          <img src="/img/sercurity.png" className="w-24 m-auto"></img>
          <div className="text-2xl uppercase text-center text-white mt-2 font-semibold">
            Thông tin giao dịch
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <div className="border border-red-500! rounded p-2 text-white">
              <Space>
                <BankOutlined />
                Bên mua
              </Space>
            </div>
            <div className="mt-2 p-2">
              <div className="flex">
                <img
                  src="/img/avatar.png"
                  className="rouded-full border border border-red-500!"
                  width={45}
                ></img>
                <div>
                  <div className="text-white">Trần Nhật Khiêm</div>
                  <div className="text-sm">UID: 100080935564659 </div>
                </div>
              </div>
              <Button
                type="primary"
                className="w-full"
                icon={<SearchOutlined />}
              >
                Check thông tin
              </Button>
            </div>
          </div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
    </ContainerFluid>
  );
};

export default page;

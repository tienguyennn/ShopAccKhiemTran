import React from 'react';
import ContainerFluid from '../components/container/ContainerFluid';
import { Slide } from 'react-toastify';
import SlideWrapper from '../components/slide/SlideWrapper';
import { Col, Row, Space } from 'antd';
import AppButton from '../components/buttons/AppButton';
import {
  PlusCircleOutlined,
  ShoppingCartOutlined,
  UpCircleOutlined,
} from '@ant-design/icons';
import AppButtonPrimary from '../components/buttons/AppButtonPrimary';
import AccountCard from '../components/AccountCard';

const accounts = Array.from({ length: 8 }).map((_, i) => ({
  img: '/img/img-danhmuc.png',
  code: `22${i + 33}`,
  price: 54040000,
  salePrice: 54040000,
  oldPrice: 10000000,
}));

const page = () => {
  return (
    <>
      <ContainerFluid img="/img/bg-s5.png">
        <div className="container">
          <Row gutter={16} className="items-stretch">
            <Col span={14}>
              <SlideWrapper images={['/img/khung-acc.png']}></SlideWrapper>
            </Col>
            <Col span={10}>
              <div className="border border-red-500! rounded-xl h-full overflow-hidden">
                <div className="text-center text-white uppercase text-2xl bg-black">
                  VLR
                </div>
                <div className="p-11">
                  {/* Account Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Mã account:</span>
                      <span className="font-semibold text-white text-lg">
                        Acc #2997
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-300">Giá cũ:</span>
                      <span className="line-through text-gray-500 text-lg">
                        10.000.000đ
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-300">Giá hiện tại:</span>
                      <span className="text-[#F7FF1D] font-bold text-xl">
                        54.040.000đ
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 space-y-3">
                    <AppButton>Mua ngay</AppButton>

                    <div className="flex mt-2">
                      <AppButtonPrimary>Trả góp 0%</AppButtonPrimary>
                      <AppButtonPrimary>
                        <Space>
                          <ShoppingCartOutlined /> Thêm vào giỏ
                        </Space>
                      </AppButtonPrimary>
                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div className="flex justify-between mt-6 text-sm text-gray-300">
                    <button className="flex items-center gap-1 hover:text-white transition">
                      <PlusCircleOutlined /> Thêm so sánh
                    </button>
                    <div>|</div>
                    <button className="flex items-center gap-1 hover:text-white transition">
                      <UpCircleOutlined /> Thu cũ lên đời
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </ContainerFluid>
      <ContainerFluid img="/img/bg-s4.png">
        <div className="text-center text-4xl text-white uppercase font-semibold mb-6">
          Có thể bạn quan tâm
        </div>
        <div className="container">
          <div className="grid grid-cols-4 gap-6">
            {accounts.map((acc, index) => (
              <AccountCard
                key={index}
                img={acc.img}
                code={acc.code}
                salePrice={acc.salePrice}
                oldPrice={acc.oldPrice}
                price={acc.price}
              />
            ))}
          </div>
        </div>
      </ContainerFluid>
    </>
  );
};

export default page;

import React from 'react';
import SlideWrapper from './slide/SlideWrapper';
import { Col, Flex, Row } from 'antd';
import DanhMucHeader from './DanhMucHeader';
import ContainerFluid from './container/ContainerFluid';
import CategorySectionHeader from './CategorySectionHeader';
import AccountCard from './AccountCard';
import FAQCard from './FAQCard';
import AppFooter from './AppFooter';
const accounts = Array.from({ length: 8 }).map((_, i) => ({
  img: '/img/img-danhmuc.png',
  code: `22${i + 33}`,
  price: 54040000,
  salePrice: 54040000,
  oldPrice: 10000000,
}));

const faqs = Array.from({ length: 8 }).map((_, i) => ({
  img: '/img/img faq.png',
  title: 'HƯỚNG DẪN ĐĂNG KÝ VÀ ĐĂNG NHẬP TRÊN WEDSITE ACCVALORANT',
  date: '12/12/2020',
}));

const page = () => {
  return (
    <div className="bg-black h-screen">
      <ContainerFluid img="/img/bg-s1.png">
        <div className="container">
          <Row gutter={32} className="items-stretch">
            <Col span={16}>
              <SlideWrapper></SlideWrapper>
            </Col>
            <Col span={8}>
              <Flex className="flex-col justify-between h-full">
                <DanhMucHeader
                  img={'/img/Danhmuc-header-01.png'}
                  link="#"
                ></DanhMucHeader>
                <DanhMucHeader
                  img={'/img/Danhmuc-header-02.png'}
                  link="#"
                ></DanhMucHeader>
                <DanhMucHeader
                  img={'/img/Danhmuc-header-03.png'}
                  link="#"
                ></DanhMucHeader>
              </Flex>
            </Col>
          </Row>
        </div>
      </ContainerFluid>
      <ContainerFluid img="/img/bg-s2.png">
        <div className="container">
          <CategorySectionHeader
            title="ACCOUNT DELTA FORCE"
            icon="/img/logo delta force.png"
            img="/img/tag-delta.png"
          ></CategorySectionHeader>
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
      <ContainerFluid img="/img/bg-s3.png">
        <div className="text-center">Câu hỏi thường gặp</div>
      </ContainerFluid>
      <ContainerFluid img="/img/bg-s4.png">
        <div className="text-center text-2xl text-red-500 uppercase font-semibold">
          Câu hỏi thường gặp
        </div>
        <div className="container">
          <div className="grid grid-cols-4 gap-6">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                img={faq.img}
                title={faq.title}
                date={faq.date}
              />
            ))}
          </div>
        </div>
      </ContainerFluid>
      <AppFooter></AppFooter>
    </div>
  );
};

export default page;

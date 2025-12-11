import React from 'react';
import ContainerFluid from '../components/container/ContainerFluid';
import SlideWrapper from '../components/slide/SlideWrapper';
import { Col, Flex, Row } from 'antd';
import CategorySectionHeader from '../components/CategorySectionHeader';
import AccountCard from '../components/AccountCard';
import FAQCard from '../components/FAQCard';
import DanhMucHeader from '../components/DanhMucHeader';
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
              <SlideWrapper
                images={[
                  '/img/slides/slide-img-01.png',
                  '/img/slides/slide-img-02.png',
                  '/img/slides/slide-img-03.png',
                ]}
              ></SlideWrapper>
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
            title="ACCOUNT VALORANT"
            icon="/img/logo Valorant.png"
            img="/img/tag-valo.png"
            linkComponent={
              <a
                href={''}
                className={`relative z-10 hover:underline text-sm text-red-500`}
              >
                Xem tất cả »
              </a>
            }
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
        <div className="container">
          <CategorySectionHeader
            title="ACCOUNT DELTA FORCE"
            icon="/img/logo delta force.png"
            img="/img/tag-delta.png"
            linkComponent={
              <a
                href={''}
                className={`relative z-10 hover:underline text-sm text-green-500`}
              >
                Xem tất cả »
              </a>
            }
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
      <ContainerFluid img="/img/bg-s4.png">
        <div className="text-center text-4xl text-red-500 uppercase font-semibold mb-6">
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
    </div>
  );
};

export default page;

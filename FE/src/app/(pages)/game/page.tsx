'use client';

import { Pagination } from 'antd';
import AccountCard from '../components/AccountCard';
import ButtonChonDanhMuc from '../components/buttons/ButtonChonDanhMuc';
import CategorySectionHeader from '../components/CategorySectionHeader';
import ContainerFluid from '../components/container/ContainerFluid';

const accounts = Array.from({ length: 16 }).map((_, i) => ({
  img: '/img/img-danhmuc.png',
  code: `22${i + 33}`,
  price: 54040000,
  salePrice: 54040000,
  oldPrice: 10000000,
}));

const page = () => {
  return (
    <ContainerFluid img="/img/bg-s2.png">
      <div className="container">
        <CategorySectionHeader
          title="ACCOUNT VALORANT"
          icon="/img/logo Valorant.png"
          img="/img/tag-valo.png"
          linkComponent={
            <ButtonChonDanhMuc text="Chọn mức giá"></ButtonChonDanhMuc>
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
        <div className="flex justify-center mt-4 page-pagination">
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
    </ContainerFluid>
  );
};

export default page;

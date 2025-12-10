import React from 'react';

const AppFooter = () => {
  return (
    <div className="bg-black p-10">
      <div className="container grid grid-cols-3 gap-6">
        <div>
          <div className="text-white">
            VỀ <span className="text-red-500">CHÚNG TÔI</span>
          </div>
          <img src="/img/logo-shopacc.png"></img>
          <p>
            Chúng tôi đã có thời gian dài hoạt động trong lĩnh vực mua bán Acc
            Valorant và xin cam kết sẽ mang đến cho quý khách sản phẩm tốt nhất,
            dịch vụ tốt nhất, giá cả tốt nhất.
          </p>
        </div>
        <div>
          <div className="text-white">
            THÔNG TIN <span className="text-red-500">LIÊN HỆ</span>
          </div>
          <div>
            FB hỗ trợ:{' '}
            <a href="" className="text-red-500 underline font-semibold">
              Khiêm Trần Valorant
            </a>
          </div>
          <div>
            Hotline: 0765.133.000 <br /> Email: accvalorant.info@gmail.com
            <br />
            Website: www.khiemtranvalorant.com
          </div>
        </div>
        <div>
          <div className="text-white">
            THEO DÕI <span className="text-red-500">CHÚNG TÔI</span>
          </div>
          <div className="flex gap-2">
            <img src="/img/icon-fb.png" className="h-[43px]" />
            <img src="/img/icon-yt.png" className="h-[43px]" />
            <img src="/img/icon-tt.png" className="h-[43px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFooter;

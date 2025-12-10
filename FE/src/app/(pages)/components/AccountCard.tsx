import React from 'react';

interface AccountCardProps {
  img: string;
  code: string;
  price: number; // giá thường
  salePrice?: number; // giá khuyến mãi
  oldPrice?: number; // giá gốc bị gạch ngang
  onBuy?: () => void;
  onView?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  img,
  code,
  price,
  salePrice,
  oldPrice,
  onBuy,
  onView,
}) => {
  return (
    <div
      className="
        bg-[#0b0b0b] 
        border border-red-500! 
        rounded-xl 
        overflow-hidden
        shadow-[0_0_10px_rgba(255,0,0,0.1)]
        hover:shadow-[0_0_60px_rgba(255,0,0,0.2)]
        transition
        p-2
      "
    >
      {/* IMAGE */}
      <div className="w-full bg-black rounded-lg border border-red-400! overflow-hidden">
        <img src={img} alt="account" className="w-full object-cover" />
      </div>

      {/* TITLE + SALE PRICE */}
      <div className="flex justify-between items-end mt-2">
        <div className="text-sm text-white opacity-30">Acc VLR</div>

        {/* Nếu có salePrice → ưu tiên hiển thị sale */}
        <div className="text-2xl font-semibold text-red-500">
          {(salePrice ?? price).toLocaleString('vi-VN')}
        </div>
      </div>

      {/* CODE + OLD PRICE */}
      <div className="flex justify-between items-end">
        <div className="text-xl text-white">#{code}</div>

        {/* Nếu có oldPrice → show */}
        {oldPrice && (
          <div className="text-xl text-white opacity-30 line-through">
            {oldPrice.toLocaleString('vi-VN')}
          </div>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex items-center justify-between mt-3 gap-2">
        {/* VIEW DETAIL */}
        <button
          onClick={onView}
          className="
            flex items-center justify-center gap-1 
            bg-[#333] text-gray-300 
            py-2 px-4 rounded-md
            text-sm
            flex-1
          "
        >
          <span>👁</span> Xem chi tiết
        </button>

        {/* BUY NOW */}
        <button
          onClick={onBuy}
          className="
            flex-1 py-2 px-4
            bg-gradient-to-r from-red-600 to-red-500
            text-white font-bold
            rounded-md
            text-sm
            hover:brightness-110
            transition
          "
        >
          MUA NGAY
        </button>
      </div>
    </div>
  );
};

export default AccountCard;

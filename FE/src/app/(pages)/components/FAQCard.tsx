import React from 'react';

interface FAQCardProps {
  img: string;
  title: string;
  category?: string;
  date?: string;
  onClick?: () => void;
}

const FAQCard: React.FC<FAQCardProps> = ({
  img,
  title,
  category,
  date,
  onClick,
}) => {
  return (
    <div
      className="
        bg-white 
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

      <div className="mt-3">
        <div className="text-lg text-black leading-tight">{title}</div>

        {category && (
          <div className="text-gray-600 text-sm mt-1">{category}</div>
        )}

        {date && <div className="text-gray-500 text-sm text-right">{date}</div>}
      </div>
    </div>
  );
};

export default FAQCard;

import React from 'react';

interface CategorySectionHeaderProps {
  title: string;
  link?: string;
  icon?: string;
  img?: string;
  className?: string;
  linkColor?: string;
}

const CategorySectionHeader: React.FC<CategorySectionHeaderProps> = ({
  title,
  link = '#',
  icon,
  img = '',
  className = '',
  linkColor = 'text-green-400',
}) => {
  return (
    <div
      className={`
        relative
        flex items-center justify-between 
        mb-4 h-[100px] px-6 rounded-md
        ${className}
      `}
    >
      {img && (
        <img
          src={img}
          alt=""
          className="absolute left-0 top-0 h-full object-cover"
        />
      )}
      <div></div>
      <div className="relative flex items-center gap-2 z-10 mt-3">
        {icon && <img src={icon} className="h-8 w-8 object-contain" />}
        <div className="text-2xl font-bold text-white uppercase">{title}</div>
      </div>
      <a
        href={link}
        className={`relative z-10 hover:underline text-sm ${linkColor}`}
      >
        Xem tất cả →
      </a>
    </div>
  );
};

export default CategorySectionHeader;

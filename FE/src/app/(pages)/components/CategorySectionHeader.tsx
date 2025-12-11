import React from 'react';

interface CategorySectionHeaderProps {
  title: string;
  link?: string;
  icon?: string;
  img?: string;
  className?: string;
  linkComponent?: React.ReactNode;
}

const CategorySectionHeader: React.FC<CategorySectionHeaderProps> = ({
  title,
  link = '#',
  icon,
  img = '',
  className = '',
  linkComponent,
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
      <div className="relative flex items-center gap-2 z-10 mt-4">
        {icon && <img src={icon} className="h-14 w-14 object-contain" />}
        <div className="text-4xl font-bold text-white uppercase">{title}</div>
      </div>
      {linkComponent && (
        <div className="relative z-10 mt-2">{linkComponent}</div>
      )}
    </div>
  );
};

export default CategorySectionHeader;

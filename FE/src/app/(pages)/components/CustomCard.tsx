import React, { ReactNode } from 'react';

interface CustomCardProps {
  title?: React.ReactNode | null;
  children?: React.ReactNode | null;
  className?: string | null;
  classTitle?: string | null;
  icon?: ReactNode | null;
}

const CustomCard = ({
  title,
  children,
  className = '',
  classTitle = '',
  icon,
}: CustomCardProps) => {
  return (
    <>
      <div
        className={`rounded overflow-hidden w-full border border-red-500! mb-2 bg-white custom-card ${className}`}
      >
        {title && (
          <div
            className={`bg-[#CD0000] p-2 text-white flex items-center ${classTitle}`}
          >
            <span className="uppercase font-semibold">
              {icon} {title}
            </span>
          </div>
        )}
        <div className="relative bg-black p-2">{children}</div>
      </div>
    </>
  );
};

export default CustomCard;

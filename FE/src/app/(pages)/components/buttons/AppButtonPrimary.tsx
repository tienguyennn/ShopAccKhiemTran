import React from 'react';

interface AppButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

const AppButtonPrimary: React.FC<AppButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative
        inline-flex
        items-center
        justify-center
        px-10 py-2
        font-bold
        uppercase
        leading-none
        text-white
        transition
        bg-[#890000E8]
        [clip-path:polygon(0%_80%,6%_100%,88%_100%,100%_20%,94%_0%,12%_0%)]
        hover:bg-red-500
        before:content-['']
        before:absolute
        before:inset-0
        before:bg-[#CD0000]
        before:[clip-path:polygon(0%_80%,6%_100%,88%_100%,100%_20%,94%_0%,12%_0%)]
        before:-translate-x-0.5
        before:-translate-y-0.5
        w-full
      "
    >
      <span className="relative -translate-x-[2px] -translate-y-[2px]">
        {children}
      </span>
    </button>
  );
};

export default AppButtonPrimary;

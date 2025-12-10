import React from 'react';

interface ContainerFluidProps {
  children: React.ReactNode;
  img?: string;
  className?: string;
}

const ContainerFluid: React.FC<ContainerFluidProps> = ({
  children,
  img = '/img/bg-s1.png',
  className = '',
}) => {
  return (
    <div
      className={`
        relative 
        bg-cover bg-center 
        p-6
        ${className}
      `}
      style={{ backgroundImage: `url('${img}')` }}
    >
      {/* Vignette overlay */}
      <div
        className="
          absolute inset-0 
          pointer-events-none
          bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_20%,rgba(0,0,0,0.9)_100%)]
        "
      ></div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ContainerFluid;

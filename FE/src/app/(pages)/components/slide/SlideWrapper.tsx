import React from 'react';

const SlideWrapper = () => {
  return (
    <div
      className="
  relative 
  w-full 
  aspect-video
  rounded-xl 
  overflow-hidden 
  border-2 
  border-red-600
"
    >
      <div
        className="
      absolute inset-0 
      bg-cover bg-center
      bg-[url('/img/slides/slide-img-01.png')]
    "
      />
    </div>
  );
};

export default SlideWrapper;

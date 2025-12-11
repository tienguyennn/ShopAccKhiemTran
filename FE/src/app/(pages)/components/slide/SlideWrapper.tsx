'use client';

import { Carousel } from 'antd';
import React from 'react';

interface SlideWrapperProps {
  images: string[];
  autoplay?: boolean;
}

const SlideWrapper: React.FC<SlideWrapperProps> = ({
  images,
  autoplay = true,
}) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-red-600">
      <Carousel autoplay={autoplay} className="absolute inset-0">
        {images.map((src, index) => (
          <div key={index} className="h-full w-full">
            <img
              src={src}
              className="h-full w-full object-cover"
              alt={`slide-${index}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default SlideWrapper;

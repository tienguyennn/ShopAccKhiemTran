interface SlideWrapperProps {
  img: string;
  className?: string;
  link?: string;
}

export default function SlideWrapper({
  img,
  className = '',
  link = '',
}: SlideWrapperProps) {
  const Wrapper: any = link ? 'a' : 'div';

  return (
    <Wrapper
      href={link || undefined}
      className={`w-full bg-transparent block ${className}`}
    >
      <img src={img} alt="slide" className="w-full h-auto object-contain" />
    </Wrapper>
  );
}

import React, { useState, useRef, useEffect } from 'react';

interface MascotItemProps {
  src: string;
  alt: string;
  index: number;
}

const MascotItem: React.FC<MascotItemProps> = ({ src, alt, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = () => {
    if (!isDragging) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPos({ x: e.movementX + pos.x, y: e.movementY + pos.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Auto reset on release
    setPos({ x: 0, y: 0 });
  };

  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, pos]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      style={{
        width: '90px',
        height: '90px',
        objectFit: 'contain',
        cursor: isDragging ? 'grabbing' : 'grab',
        position: 'relative',
        transform: `translate(${pos.x}px, ${pos.y}px) ${isHovered ? 'scale(1.1)' : isClicked ? 'scale(0.9)' : 'scale(1)'}`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
        zIndex: isDragging ? 999 : 1,
        boxShadow: 'none',
        margin: '10px 0',
        borderRadius: '50%',
        background: 'transparent',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    />
  );
};

interface RightMascotsProps {
  customImages?: string[]; // Support custom image array
}

const RightMascots: React.FC<RightMascotsProps> = ({ customImages }) => {
  const defaultImages = [
    '/src/assets/mascots/mascot1.png',
    '/src/assets/mascots/mascot2.png',
    '/src/assets/mascots/mascot3.png',
    '/src/assets/mascots/mascot4.png',
    '/src/assets/mascots/mascot5.png',
  ];

  const images = customImages || defaultImages;

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      width: '120px',
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-end',
      gap: '20px'
    }}>
      {images.map((imageSrc, index) => (
        <MascotItem
          key={index}
          src={imageSrc}
          alt={`Mascot ${index + 1}`}
          index={index}
        />
      ))}
    </div>
  );
};

export default RightMascots;

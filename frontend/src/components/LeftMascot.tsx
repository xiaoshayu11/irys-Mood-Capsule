import React from 'react';

interface LeftMascotProps {
  customImage?: string; // Support custom image
}

const LeftMascot: React.FC<LeftMascotProps> = ({ customImage }) => {
  return (
    <div style={{
      position: 'fixed',
      left: '60px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      opacity: 0.6,
      transition: 'all 0.3s ease'
    }}>
      {/* Large mascot */}
      <div style={{
        width: '450px',
        height: '450px',
        background: 'transparent',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLDivElement).style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLDivElement).style.transform = 'scale(1)';
      }}>
        {customImage ? (
          // Use custom image
          <img
            src={customImage}
            alt="Left Mascot"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 'inherit'
            }}
          />
        ) : (
          // Use CSS-drawn mascot
          <>
            {/* Eyes */}
            <div style={{
              position: 'absolute',
              top: '30px',
              left: '25px',
              width: '20px',
              height: '20px',
              background: 'white',
              borderRadius: '50%',
              boxShadow: 'inset 0 0 0 3px #333'
            }} />
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '25px',
              width: '20px',
              height: '20px',
              background: 'white',
              borderRadius: '50%',
              boxShadow: 'inset 0 0 0 3px #333'
            }} />
            
            {/* Pupils */}
            <div style={{
              position: 'absolute',
              top: '35px',
              left: '30px',
              width: '10px',
              height: '10px',
              background: '#333',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              top: '35px',
              right: '30px',
              width: '10px',
              height: '10px',
              background: '#333',
              borderRadius: '50%'
            }} />
            
            {/* Highlights */}
            <div style={{
              position: 'absolute',
              top: '32px',
              left: '27px',
              width: '6px',
              height: '6px',
              background: 'white',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              top: '32px',
              right: '27px',
              width: '6px',
              height: '6px',
              background: 'white',
              borderRadius: '50%'
            }} />
            
            {/* Mouth */}
            <div style={{
              position: 'absolute',
              bottom: '35px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '30px',
              height: '15px',
              border: '3px solid #333',
              borderTop: 'none',
              borderRadius: '0 0 30px 30px'
            }} />
            
            {/* Cheek blush */}
            <div style={{
              position: 'absolute',
              top: '50px',
              left: '15px',
              width: '12px',
              height: '8px',
              background: 'rgba(255, 182, 193, 0.6)',
              borderRadius: '50%'
            }} />
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '15px',
              width: '12px',
              height: '8px',
              background: 'rgba(255, 182, 193, 0.6)',
              borderRadius: '50%'
            }} />
          </>
        )}
      </div>
    </div>
  );
};

export default LeftMascot;

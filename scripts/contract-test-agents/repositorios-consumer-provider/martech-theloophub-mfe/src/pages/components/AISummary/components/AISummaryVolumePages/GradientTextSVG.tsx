import { useEffect, useRef, useState } from 'react';

import { GradientTextSVGStyles as Styles } from './AISummaryVolumePages.styles';

interface GradientTextSVGProps {
  children: string;
}

export const GradientTextSVG = ({ children }: GradientTextSVGProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(32);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.offsetHeight;
      setHeight(contentHeight);
    }
  }, [children]);

  return (
    <Styles.Svg width="100%" height={height}>
      <foreignObject width="100%" height={height}>
        <div ref={contentRef}>
          <style>{`
            .pdf-gradient-text {
              background: linear-gradient(348deg, #000 40.19%, #e5b611 124.17%);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
              font: 600 24px 'Barlow', sans-serif;
              line-height: 1.3;
              margin: 0;
              font-size: 20px;
            }
            `}</style>
          <p className="pdf-gradient-text">{children}</p>
        </div>
      </foreignObject>
    </Styles.Svg>
  );
};

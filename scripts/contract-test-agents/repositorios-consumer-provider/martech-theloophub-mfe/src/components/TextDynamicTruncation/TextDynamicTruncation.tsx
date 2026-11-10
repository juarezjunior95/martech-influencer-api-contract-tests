import { Paragraph } from '@hexa-ui/components';
import { ParagraphProps } from '@hexa-ui/components/dist/declarations/src/lib/typography/Paragraph/ParagraphTypes';
import { useTruncationDetection } from 'hooks/useTruncationDetection';

interface TextWithDynamicTruncationProps extends ParagraphProps {
  children: string;
  shouldTruncate?: boolean;
  Component?: React.ElementType;
  dataTestId?: string;
}

export const TextDynamicTruncation: React.FC<
  TextWithDynamicTruncationProps
> = ({
  children,
  shouldTruncate = true,
  Component = Paragraph,
  dataTestId,
  ...rest
}) => {
  const { ref, isTruncated } = useTruncationDetection<HTMLParagraphElement>(
    children,
    { enabled: shouldTruncate },
  );

  return (
    <Component
      {...rest}
      ref={shouldTruncate ? ref : undefined}
      title={isTruncated ? children : undefined}
      data-testid={dataTestId}
      style={{
        display: 'block',
        textOverflow: shouldTruncate ? 'ellipsis' : 'clip',
        maxWidth: shouldTruncate ? '100%' : 'auto',
        overflow: shouldTruncate ? 'hidden' : 'visible',
        whiteSpace: shouldTruncate ? 'nowrap' : 'normal',
      }}
    >
      {children}
    </Component>
  );
};

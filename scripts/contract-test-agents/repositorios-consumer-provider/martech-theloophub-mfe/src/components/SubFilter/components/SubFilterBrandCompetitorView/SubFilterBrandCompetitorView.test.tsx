import React from 'react';
import { IntlProvider } from 'react-intl';

import { fireEvent, render, screen } from '@testing-library/react';
import { Option } from 'models/Filters';

jest.mock('./SubFilterBrandCompetitorView.styles', () => ({
  SubFilterBrandCompetitorBox: ({
    children,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'brand-competitor-box'}>{children}</div>
  ),
  SubFilterBrandCompetitorTagContainer: ({
    children,
    'data-testid': dataTestId,
  }: any) => <div data-testid={dataTestId}>{children}</div>,
}));

jest.mock('@hexa-ui/components', () => ({
  Button: ({
    children,
    onClick,
    elevated,
    size,
    variant,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <button
      onClick={onClick}
      data-testid={dataTestId || 'select-button'}
      data-elevated={String(elevated)}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
  Paragraph: ({ children, ...props }: any) => (
    <p data-testid="competitor-paragraph" {...props}>
      {children}
    </p>
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, ...props }: any) => (
    <div data-testid="close-icon" {...props}>
      {icon.displayName || 'Icon'}
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Close: { displayName: 'Close' },
}));

jest.mock('components', () => ({
  BrandImg: ({ src, alt }: any) => (
    <div data-testid="brand-img">
      Src: {src || 'none'}, Alt: {alt || 'none'}
    </div>
  ),
  Tag: ({ text, textColor, borderColor }: any) => (
    <div
      data-testid={`tag-${text.toLowerCase()}`}
      data-text-color={textColor}
      data-border-color={borderColor}
    >
      {text}
    </div>
  ),
}));

import {
  SubFilterBrandCompetitorView,
  SubFilterBrandCompetitorViewProps,
} from './SubFilterBrandCompetitorView';

const messages = {
  'Label.Abi': 'ABI',
  'Label.competitor': 'Competitor',
};

const renderWithIntl = (
  component: React.ReactElement,
  locale = 'en',
  customMessages = messages,
) => {
  return render(
    <IntlProvider locale={locale} messages={customMessages}>
      {component}
    </IntlProvider>,
  );
};

describe('SubFilterBrandCompetitorView', () => {
  const mockOnOpenModal = jest.fn();

  const defaultProps: SubFilterBrandCompetitorViewProps = {
    competitorIsActive: false,
    hasBrandAbi: false,
    brand: 'brahma',
    brandCompetitor: undefined,
    onOpenModal: mockOnOpenModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the component', () => {
      renderWithIntl(<SubFilterBrandCompetitorView {...defaultProps} />);

      expect(screen.getByTestId('brand-competitor-box')).toBeInTheDocument();
    });

    it('should render Close icon', () => {
      renderWithIntl(<SubFilterBrandCompetitorView {...defaultProps} />);

      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toHaveTextContent('Close');
    });
  });

  describe('showAbiTag calculation', () => {
    it('should show ABI tag when competitorIsActive is true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={false}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();
      expect(screen.getByTestId('tag-abi')).toHaveTextContent('ABI');
    });

    it('should show ABI tag when hasBrandAbi is false', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={false}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();
    });

    it('should NOT show ABI tag when competitorIsActive is false and hasBrandAbi is true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      expect(screen.queryByTestId('tag-abi')).not.toBeInTheDocument();
    });

    it('should show ABI tag when both are true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={true}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();
    });
  });

  describe('ABI Tag styling', () => {
    it('should apply correct colors to ABI tag', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
        />,
      );

      const abiTag = screen.getByTestId('tag-abi');
      expect(abiTag).toHaveAttribute('data-text-color', '#8E710B');
      expect(abiTag).toHaveAttribute('data-border-color', '#D1A33C');
    });
  });

  describe('BrandImg rendering', () => {
    it('should render BrandImg when hasBrandAbi is true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand="skol"
          brandImageUrl="https://cdn.example.com/brands/skol-square.png"
          brandAbiFieldValue="skol-beats"
        />,
      );

      expect(screen.getByTestId('brand-img')).toBeInTheDocument();
      expect(screen.getByTestId('brand-img')).toHaveTextContent(
        'Src: https://cdn.example.com/brands/skol-square.png, Alt: skol-beats',
      );
    });

    it('should NOT render BrandImg when hasBrandAbi is false', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView {...defaultProps} hasBrandAbi={false} />,
      );

      expect(screen.queryByTestId('brand-img')).not.toBeInTheDocument();
    });

    it('should pass brandImageUrl to BrandImg', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand="brahma"
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
        />,
      );

      expect(screen.getByTestId('brand-img')).toHaveTextContent(
        'Src: https://cdn.example.com/brands/brahma-square.png',
      );
    });

    it('should pass brandAbiFieldValue as alt to BrandImg', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand="brahma"
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
          brandAbiFieldValue="brahma-chopp"
        />,
      );

      expect(screen.getByTestId('brand-img')).toHaveTextContent(
        'Alt: brahma-chopp',
      );
    });

    it('should handle undefined brandAbiFieldValue', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand="brahma"
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
          brandAbiFieldValue={undefined}
        />,
      );

      expect(screen.getByTestId('brand-img')).toHaveTextContent('Alt: brahma');
    });

    it('should NOT render BrandImg when brandImageUrl is missing', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand="brahma"
        />,
      );

      expect(screen.queryByTestId('brand-img')).not.toBeInTheDocument();
    });
  });

  describe('showCompetitorSection calculation', () => {
    it('should show competitor section when competitorIsActive is true', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
    });

    it('should show competitor section when hasBrandAbi is false', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={false}
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
    });

    it('should NOT show competitor section when both false/true respectively', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      expect(
        screen.queryByTestId('competitor-paragraph'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('tag-competitor')).not.toBeInTheDocument();
    });

    it('should show competitor section when both are true', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={true}
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
    });
  });

  describe('Competitor display', () => {
    it('should display competitor label in paragraph', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('competitor-paragraph')).toHaveTextContent(
        'Heineken',
      );
    });

    it('should handle undefined brandCompetitor', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          brandCompetitor={undefined}
        />,
      );

      const paragraph = screen.getByTestId('competitor-paragraph');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toBeEmptyDOMElement();
    });

    it('should handle competitor without label', () => {
      const competitor: Option = { value: 'heineken', label: null };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          brandCompetitor={competitor}
        />,
      );

      const paragraph = screen.getByTestId('competitor-paragraph');
      expect(paragraph).toBeInTheDocument();
    });
  });

  describe('Competitor Tag styling', () => {
    it('should apply correct colors to Competitor tag', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          brandCompetitor={competitor}
        />,
      );

      const competitorTag = screen.getByTestId('tag-competitor');
      expect(competitorTag).toHaveAttribute('data-text-color', '#4C5965');
      expect(competitorTag).toHaveAttribute('data-border-color', '#7B919D');
    });
  });

  describe('showSelectButton calculation', () => {
    it('should show button when competitorIsActive is false and hasBrandAbi is true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      expect(screen.getByTestId('select-button')).toBeInTheDocument();
    });

    it('should NOT show button when competitorIsActive is true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={true}
        />,
      );

      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });

    it('should NOT show button when hasBrandAbi is false', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={false}
        />,
      );

      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });

    it('should NOT show button when both are false', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={false}
        />,
      );

      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });

    it('should NOT show button when both are true', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={true}
        />,
      );

      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });
  });

  describe('Select Button', () => {
    it('should use default label when selectButtonLabel is not provided', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      expect(screen.getByTestId('select-button')).toHaveTextContent(
        'Select a Competitor',
      );
    });

    it('should use custom label when selectButtonLabel is provided', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
          selectButtonLabel="Choose Competitor"
        />,
      );

      expect(screen.getByTestId('select-button')).toHaveTextContent(
        'Choose Competitor',
      );
    });

    it('should call onOpenModal when button is clicked', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      const button = screen.getByTestId('select-button');
      fireEvent.click(button);

      expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
    });

    it('should have correct props (elevated, size, variant)', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      const button = screen.getByTestId('select-button');
      expect(button).toHaveAttribute('data-elevated', 'true');
      expect(button).toHaveAttribute('data-size', 'medium');
      expect(button).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('useIntl integration', () => {
    it('should format ABI label using intl', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toHaveTextContent('ABI');
    });

    it('should format Competitor label using intl', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('tag-competitor')).toHaveTextContent(
        'Competitor',
      );
    });
  });

  describe('Complete Scenarios', () => {
    it('should render scenario: No competitor, no brand (initial state)', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={false}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();

      expect(screen.queryByTestId('brand-img')).not.toBeInTheDocument();
      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });

    it('should render scenario: Has brand, no competitor selected', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
          brand="brahma"
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
          brandAbiFieldValue="brahma-chopp"
        />,
      );

      expect(screen.queryByTestId('tag-abi')).not.toBeInTheDocument();
      expect(screen.getByTestId('brand-img')).toBeInTheDocument();
      expect(
        screen.queryByTestId('competitor-paragraph'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('tag-competitor')).not.toBeInTheDocument();
      expect(screen.getByTestId('select-button')).toBeInTheDocument();
    });

    it('should render scenario: Has brand and competitor selected', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={true}
          brand="brahma"
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
          brandAbiFieldValue="brahma-chopp"
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();
      expect(screen.getByTestId('brand-img')).toBeInTheDocument();
      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('competitor-paragraph')).toHaveTextContent(
        'Heineken',
      );
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });

    it('should render scenario: Only competitor selected (no brand)', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={false}
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();
      expect(screen.queryByTestId('brand-img')).not.toBeInTheDocument();
      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('competitor-paragraph')).toHaveTextContent(
        'Heineken',
      );
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
      expect(screen.queryByTestId('select-button')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all false props', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={false}
        />,
      );

      expect(screen.getByTestId('brand-competitor-box')).toBeInTheDocument();
      expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    });

    it('should handle all true props', () => {
      const competitor: Option = { value: 'heineken', label: 'Heineken' };

      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={true}
          hasBrandAbi={true}
          brand="brahma"
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
          brandAbiFieldValue="brahma-chopp"
          brandCompetitor={competitor}
        />,
      );

      expect(screen.getByTestId('brand-competitor-box')).toBeInTheDocument();
      expect(screen.getByTestId('tag-abi')).toBeInTheDocument();
      expect(screen.getByTestId('brand-img')).toBeInTheDocument();
      expect(screen.getByTestId('competitor-paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('tag-competitor')).toBeInTheDocument();
    });

    it('should handle empty string brand', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand=""
          brandImageUrl="https://cdn.example.com/brands/placeholder.png"
        />,
      );

      expect(screen.getByTestId('brand-img')).toHaveTextContent('Alt: brand');
    });

    it('should handle null brand', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          hasBrandAbi={true}
          brand={null}
          brandImageUrl="https://cdn.example.com/brands/brahma-square.png"
        />,
      );

      expect(screen.getByTestId('brand-img')).toBeInTheDocument();
    });

    it('should handle multiple button clicks', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          {...defaultProps}
          competitorIsActive={false}
          hasBrandAbi={true}
        />,
      );

      const button = screen.getByTestId('select-button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnOpenModal).toHaveBeenCalledTimes(3);
    });

    it('should render without crashing when all optional props are undefined', () => {
      renderWithIntl(
        <SubFilterBrandCompetitorView
          competitorIsActive={false}
          hasBrandAbi={false}
          brand={undefined}
          brandCompetitor={undefined}
          onOpenModal={mockOnOpenModal}
          selectButtonLabel={undefined}
          brandAbiFieldValue={undefined}
        />,
      );

      expect(screen.getByTestId('brand-competitor-box')).toBeInTheDocument();
    });
  });
});

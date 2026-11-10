import { render } from '@testing-library/react';
import * as hooks from 'hooks';

import { FieldRenderer } from './FieldRenderer';

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  usePageFilterForm: jest.fn(),
}));

type FieldStubProps = {
  onValueChange: (value: { value: string; label: string }) => void;
  fieldKey: string;
  'data-testid'?: string;
};

const createFieldStub = (defaultTestId: string, value: string, label: string) =>
  function FieldStub({
    onValueChange,
    fieldKey,
    'data-testid': dataTestId,
  }: FieldStubProps) {
    return (
      <button
        type="button"
        data-testid={dataTestId || defaultTestId}
        onClick={() => onValueChange({ value, label })}
      >
        {defaultTestId} - {fieldKey}
      </button>
    );
  };

jest.mock('../ZoneField/ZoneField', () => ({
  ZoneField: createFieldStub('zone-field', 'NAZ', 'NAZ'),
}));

jest.mock('../CountryField/CountryField', () => ({
  CountryField: createFieldStub('country-field', 'US', 'US'),
}));

jest.mock('../BrandsField/BrandsField', () => ({
  BrandsField: createFieldStub('brands-field', 'Brand1', 'Brand 1'),
}));

jest.mock('../YearsField/YearsField', () => ({
  YearsField: createFieldStub('years-field', '2024', '2024'),
}));

jest.mock('../SegmentsField/SegmentsField', () => ({
  SegmentsField: createFieldStub('segments-field', 's1', 's1'),
}));

jest.mock('../ProductScopeField/ProductScopeField', () => ({
  ProductScopeField: createFieldStub(
    'product-scope-field',
    'Beer + Adjacencies',
    'Beer + Adjacencies',
  ),
}));

jest.mock('../SubBrandsField/SubBrandsField', () => ({
  SubBrandsField: createFieldStub('sub-brands-field', 'sb1', 'sb1'),
}));

jest.mock('../BrandsAbiField/BrandsAbiField', () => ({
  BrandsAbiField: createFieldStub('brands-abi-field', 'ba1', 'ba1'),
}));

jest.mock('../BrandsCompField/BrandsCompField', () => ({
  BrandsCompField: createFieldStub('brands-comp-field', 'bc1', 'bc1'),
}));

jest.mock('../BeerPriceSegmentField/BeerPriceSegmentField', () => ({
  BeerPriceSegmentField: createFieldStub(
    'beer-price-segment-field',
    'bps',
    'bps',
  ),
}));

jest.mock('../GlobalBrandsField/GlobalBrandsField', () => ({
  GlobalBrandsField: createFieldStub('global-brands-field', 'gb', 'gb'),
}));

jest.mock('../GrowthLeversField/GrowthLeversField', () => ({
  GrowthLeversField: createFieldStub('growth-levers-field', 'gl', 'gl'),
}));

jest.mock('../YtdMonthField/YtdMonthField', () => ({
  YtdMonthField: createFieldStub('ytd-month-field', 'ytd', 'ytd'),
}));

jest.mock('../ScopesField/ScopesField', () => ({
  ScopesField: createFieldStub('scopes-field', 'sc', 'sc'),
}));

jest.mock('../SubScopesField/SubScopesField', () => ({
  SubScopesField: createFieldStub('sub-scopes-field', 'ssc', 'ssc'),
}));

jest.mock(
  '../AudienceTargetingBrandsField/AudienceTargetingBrandsField',
  () => ({
    AudienceTargetingBrandsField: createFieldStub('atb-field', 'atb', 'atb'),
  }),
);

jest.mock(
  '../AudienceTargetingBrandsCompField/AudienceTargetingBrandsCompField',
  () => ({
    AudienceTargetingBrandsCompField: createFieldStub(
      'atbc-field',
      'atbc',
      'atbc',
    ),
  }),
);

jest.mock('../PosPeriodsField/PosPeriodsField', () => ({
  PosPeriodsField: createFieldStub('pos-periods-field', 'pp', 'pp'),
}));

jest.mock('../DistributionScopesField/DistributionScopesField', () => ({
  DistributionScopesField: createFieldStub(
    'distribution-scopes-field',
    'ds',
    'ds',
  ),
}));

jest.mock('../KPIField/KpiField', () => ({
  KPIField: createFieldStub('kpi-field', 'kpi', 'kpi'),
}));

jest.mock('../BrandFilterGroupingFields/BrandFilterGroupingFields', () => ({
  BrandFilterGroupingsField: createFieldStub('bfg-field', 'bfg', 'bfg'),
}));

jest.mock('../PortfoliosField/PortfoliosField', () => ({
  PortfoliosField: createFieldStub('portfolios-field', 'pf', 'pf'),
}));

describe('FieldRenderer', () => {
  let mockUsePageFilterApplied: jest.SpyInstance;
  let mockUsePageFilterForm: jest.SpyInstance;
  let mockOnValueChange: jest.Mock;

  const mockApplied = {
    zone: 'LATAM',
    country: 'BR',
  };

  const mockForm = {
    zone: 'NAZ',
    country: 'US',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockOnValueChange = jest.fn();
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');
    mockUsePageFilterForm = jest.spyOn(hooks, 'usePageFilterForm');

    mockUsePageFilterApplied.mockReturnValue({ applied: mockApplied });
    mockUsePageFilterForm.mockReturnValue({ form: mockForm });
  });

  describe('field rendering', () => {
    it('should render ZoneField when fieldKey is zone', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="zone"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(getByTestId('zone-field')).toBeInTheDocument();
    });

    it('should render CountryField when fieldKey is country', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="country"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(getByTestId('country-field')).toBeInTheDocument();
    });

    it('should render BrandsField when fieldKey is brands', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="brands"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(getByTestId('brands-field')).toBeInTheDocument();
    });

    it('should render ProductScopeField when fieldKey is product_scope', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="product_scope"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(getByTestId('product-scope-field')).toBeInTheDocument();
    });

    it('should return null for unknown field key', () => {
      const { container } = render(
        <FieldRenderer
          fieldKey="unknown-field"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('value source', () => {
    it('should use applied values when isAutoApply is true', () => {
      render(
        <FieldRenderer
          fieldKey="zone"
          pageName="test-page"
          isAutoApply={true}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
    });

    it('should use form values when isAutoApply is false', () => {
      render(
        <FieldRenderer
          fieldKey="zone"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(mockUsePageFilterForm).toHaveBeenCalledWith('test-page');
    });
  });

  describe('value change handling', () => {
    it('should call onValueChange with fieldKey and option', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="country"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      getByTestId('country-field').click();

      expect(mockOnValueChange).toHaveBeenCalledWith({
        value: 'US',
        label: 'US',
      });
    });
  });

  describe('page name', () => {
    it('should use provided pageName for hooks', () => {
      render(
        <FieldRenderer
          fieldKey="zone"
          pageName="custom-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      expect(mockUsePageFilterApplied).toHaveBeenCalledWith('custom-page');
      expect(mockUsePageFilterForm).toHaveBeenCalledWith('custom-page');
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass data-testid to field component when dataTestId is provided', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="zone"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
          dataTestId="custom"
        />,
      );

      expect(getByTestId('field-renderer-zone-custom')).toBeInTheDocument();
    });

    it('should pass data-testid to different field components', () => {
      const { getByTestId } = render(
        <FieldRenderer
          fieldKey="country"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
          dataTestId="custom"
        />,
      );

      expect(getByTestId('field-renderer-country-custom')).toBeInTheDocument();
    });

    it('should not pass data-testid when dataTestId is not provided', () => {
      const { container } = render(
        <FieldRenderer
          fieldKey="zone"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
        />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="field-renderer-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(
        container.querySelector('[data-testid="zone-field"]'),
      ).toBeInTheDocument();
    });

    it('should not pass data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <FieldRenderer
          fieldKey="zone"
          pageName="test-page"
          isAutoApply={false}
          onValueChange={mockOnValueChange}
          dataTestId={undefined}
        />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="field-renderer-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(
        container.querySelector('[data-testid="zone-field"]'),
      ).toBeInTheDocument();
    });
  });
});

import { act } from 'react-dom/test-utils';

import { renderHook } from '@testing-library/react-hooks';

import { useExportGlobalPageHeader } from './useExportGlobalPageHeader';

const mockOnExport = jest.fn().mockResolvedValue(undefined);

jest.mock('hooks', () => ({ useExportPdf: jest.fn() }));

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/constants/pdfConfig',
  () => ({
    PDF_DEFAULT_CONFIG: {
      scale: 1,
      format: 'a4',
      orientation: 'landscape',
      margin: 0,
    },
  }),
);

jest.mock('pages/pillars/ValueCreation/VolumePages/contexts', () => ({
  useRegisterLoading: jest.fn(),
  useVolumePagesKpi: jest.fn(() => ({
    kpi: 'volume',
    kpiName: 'Volume',
  })),
}));

jest.mock(
  'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/sections',
  () => ({
    globalExportPageSections: [
      'main-cover',
      'secondary-cover',
      'global-volume',
    ],
  }),
);
jest.mock(
  'pages/pillars/ValueCreation/VolumePages/hooks/useVolumePageExportScopeName',
  () => ({
    useVolumePageExportScopeName: jest.fn(() => 'Total ABI'),
  }),
);

const mockUseExportPdf = jest.requireMock('hooks').useExportPdf;

describe('useExportGlobalPageHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseExportPdf.mockReturnValue({ onExport: mockOnExport });
  });

  it('returns handlePDFExport function', () => {
    const { result } = renderHook(() =>
      useExportGlobalPageHeader({ monthYear: 'Jan 2025' }),
    );

    expect(typeof result.current.handlePDFExport).toBe('function');
  });

  it('passes filename with monthYear.toUpperCase() to useExportPdf', () => {
    renderHook(() => useExportGlobalPageHeader({ monthYear: 'Jan 2025' }));

    expect(mockUseExportPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        filename:
          'Volume Page - Total ABI - Value Creation - Global Volume Pages - JAN 2025',
      }),
    );
  });

  it('includes PDF default config properties in useExportPdf call', () => {
    renderHook(() => useExportGlobalPageHeader({ monthYear: 'Jan 2025' }));

    expect(mockUseExportPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        scale: 1,
        format: 'a4',
        orientation: 'landscape',
        margin: 0,
      }),
    );
  });

  it('calls onExport when handlePDFExport is invoked', async () => {
    const { result } = renderHook(() =>
      useExportGlobalPageHeader({ monthYear: 'Jan 2025' }),
    );

    await act(async () => {
      await result.current.handlePDFExport();
    });

    expect(mockOnExport).toHaveBeenCalled();
  });

  it('calls onExport with DOM elements matching page section names', async () => {
    const mockElement = document.createElement('section');
    jest.spyOn(document, 'querySelector').mockReturnValue(mockElement);

    const { result } = renderHook(() =>
      useExportGlobalPageHeader({ monthYear: 'Jan 2025' }),
    );

    await act(async () => {
      await result.current.handlePDFExport();
    });

    expect(mockOnExport).toHaveBeenCalledWith(
      expect.arrayContaining([mockElement]),
    );
  });

  it('filters out null elements from document.querySelector results', async () => {
    jest.spyOn(document, 'querySelector').mockReturnValue(null);

    const { result } = renderHook(() =>
      useExportGlobalPageHeader({ monthYear: 'Jan 2025' }),
    );

    await act(async () => {
      await result.current.handlePDFExport();
    });

    expect(mockOnExport).toHaveBeenCalledWith([]);
  });

  it('registers exporting state via useRegisterLoading', () => {
    const mockUseRegisterLoading = jest.requireMock(
      'pages/pillars/ValueCreation/VolumePages/contexts',
    ).useRegisterLoading;

    renderHook(() => useExportGlobalPageHeader({ monthYear: 'Jan 2025' }));

    expect(mockUseRegisterLoading).toHaveBeenCalledWith('global-export', false);
  });

  it('updates filename when monthYear prop changes', () => {
    const { rerender } = renderHook(
      ({ monthYear }: { monthYear: string }) =>
        useExportGlobalPageHeader({ monthYear }),
      { initialProps: { monthYear: 'Jan 2025' } },
    );

    expect(mockUseExportPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        filename:
          'Volume Page - Total ABI - Value Creation - Global Volume Pages - JAN 2025',
      }),
    );

    rerender({ monthYear: 'Feb 2025' });

    expect(mockUseExportPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        filename:
          'Volume Page - Total ABI - Value Creation - Global Volume Pages - FEB 2025',
      }),
    );
  });
});

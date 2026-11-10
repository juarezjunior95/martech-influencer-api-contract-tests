import React from 'react';

/**
 * Shared test mocks for the PPR Country test suite.
 *
 * Lives under `mocks/` so the path is excluded by
 * `collectCoverageFrom: '!src/**\/mocks/**\/*'` in jest.config.js.
 *
 * Why: the same inline `jest.mock(...)` for `TemplateSlide`,
 * `StyledExportPageSection` and `DataStateHandler` was duplicated across
 * several suites under `components/VolumePprExportSections/*` and
 * `components/Slides/*`. Extracting keeps the same mock shape (no behavior
 * change) while reducing line noise.
 */

interface TemplateSlideMockProps {
  children?: React.ReactNode;
  title: string;
}

export const TemplateSlideMock = ({
  children,
  title,
}: TemplateSlideMockProps) => (
  <div data-testid={`template-${title}`}>{children}</div>
);

interface StyledExportPageSectionMockProps {
  children?: React.ReactNode;
}

export const StyledExportPageSectionMock = ({
  children,
}: StyledExportPageSectionMockProps) => <section>{children}</section>;

interface DataStateHandlerMockProps {
  loading: boolean;
  error?: Error | null;
  empty?: boolean;
  children: React.ReactNode;
  dataTestId?: string;
}

export const DataStateHandlerMock = ({
  loading,
  error,
  empty,
  children,
  dataTestId,
}: DataStateHandlerMockProps) => {
  const id = dataTestId ?? 'data-state-handler';
  return (
    <div data-testid={id}>
      <span data-testid={`${id}-loading`}>{String(loading)}</span>
      <span data-testid={`${id}-error`}>{String(!!error)}</span>
      <span data-testid={`${id}-empty`}>{String(!!empty)}</span>
      {!loading && !error && !empty ? children : null}
    </div>
  );
};

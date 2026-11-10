import { useMemo } from 'react';

import { TabInfo, TabsWithFilters } from 'components';
import { ModalExample } from 'components/ai/examples/ModalExample';
import { createTab } from 'utils/tab';

import { AlertExample } from './components/AlertExample/AlertExample';
import { BarChartExample } from './components/BarChartExample/BarChartExample';
import { BigNumberExample } from './components/BigNumberExample/BigNumberExample';
import { BrandAvatarExample } from './components/BrandAvatarExample/BrandAvatarExample';
import { BreadcrumbsExample } from './components/BreadcrumbsExample/BreadcrumbsExample';
import { BreakdownSectionExample } from './components/BreakdownSectionExample/BreakdownSectionExample';
import { CategoryExample } from './components/CategoryExample/CategoryExample';
import { ChartHeaderExample } from './components/ChartHeaderExample/ChartHeader';
import { ChatAIUIExample } from './components/ChatAIUIExample/ChatAIUIExample';
import { ComparisonLineExamples } from './components/ComparisonLineExamples/ComparisonLineExamples';
import { DataTableExample } from './components/DataTableExample/DataTableExample';
import { DivergingBarChartExample } from './components/DivergingBarChartExample/DivergingBarChartExample';
import { InteractiveChartsExample } from './components/InteractiveChartsExample/InteractiveChartsExample';
import { LegendExample } from './components/LegendExample/LegendExample';
import { LineChartExample } from './components/LineChartExample/LineChartExample';
import { SelectExample } from './components/SelectExample/SelectExample';
import { SubPillarCardExample } from './components/SubPillarCardExample/SubPillarCardExample';
import { TableOfContentsExample } from './components/TableOfContentsExample/TableOfContentsExample';
import { TemplateSlideExample } from './components/TemplateSlideExample/TemplateSlide';
import { WaterfallChartExample } from './components/WaterfallChartExample/WaterfallChartExample';

export const ComponentsPage = () => {
  const tabs = useMemo<TabInfo[]>(
    () => [
      createTab('ai-chat-ui', 'AI Chat UI', <ChatAIUIExample />, false),
      createTab(
        'interactive-charts',
        'Interactive Charts',
        <InteractiveChartsExample />,
        false,
      ),
      createTab('line-chart', 'Line Chart', <LineChartExample />, false),
      createTab('bar-chart', 'Bar Chart', <BarChartExample />, false),
      createTab(
        'breakdown-section',
        'Breakdown Section',
        <BreakdownSectionExample />,
        false,
      ),
      createTab(
        'diverging-bar-chart',
        'Diverging Bar Chart',
        <DivergingBarChartExample />,
        false,
      ),
      createTab(
        'waterfall-bar-chart',
        'Waterfall Bar Chart',
        <WaterfallChartExample />,
        false,
      ),
      createTab(
        'chart-legend-bar-chart',
        'Chart Legend',
        <LegendExample />,
        false,
      ),
      createTab('big-number', 'Big Number', <BigNumberExample />, false),
      createTab(
        'category-growth-levers',
        'Category Growth Levers',
        <CategoryExample />,
        false,
      ),
      createTab(
        'comparison-line',
        'Comparison Line',
        <ComparisonLineExamples />,
        false,
      ),
      createTab(
        'template-slide',
        'Template Slide',
        <TemplateSlideExample />,
        false,
      ),
      createTab('brand-avatar', 'Brand Avatar', <BrandAvatarExample />, false),
      createTab('chart-header', 'Chart Header', <ChartHeaderExample />, false),
      createTab('select', 'Select', <SelectExample />, false),
      createTab('breadcrumbs', 'Breadcrumbs', <BreadcrumbsExample />, false),
      createTab('alert', 'Alert', <AlertExample />, false),
      createTab(
        'sub-pillar-card',
        'Sub Pillar Card',
        <SubPillarCardExample />,
        false,
      ),
      createTab('ai-modal', 'AI Modal', <ModalExample />, false),
      createTab('data-table', 'Data Table', <DataTableExample />, false),
      createTab(
        'table-of-contents',
        'Table of Contents',
        <TableOfContentsExample />,
        false,
      ),
    ],
    [],
  );

  return (
    <TabsWithFilters
      dataTestId="components"
      filter={{
        pageName: 'value-creation_volume-pages',
        visibleFields: ['zones', 'country', 'time_frame'],
        hidden: true,
      }}
      tabConfig={{
        tabs,
        baseRoute: '/development/components',
      }}
    />
  );
};

import { TableDataType } from '../types';

export const cellTypesMock: TableDataType = {
  header: [
    { id: 'type', title: 'Cell Type', align: 'left' },
    { id: 'example', title: 'Example', align: 'center' },
  ],
  rows: [
    [
      {
        type: { value: 'Header Grid (2x2)' },
        example: {
          value: 'Main Title',
          contentType: 'header',
          subtext: 'Top Right',
          subtitle: 'Bottom Left',
          icon: 'BarChart2',
        },
      },
      {
        type: { value: 'Primary Text' },
        example: {
          value: 'Important Text',
          contentType: 'primaryText',
        },
      },
      {
        type: { value: 'Secondary Text' },
        example: {
          value: 'Supporting text with less emphasis',
          contentType: 'secondaryText',
        },
      },
      {
        type: { value: 'Number (simple)' },
        example: {
          value: 1234,
          unitMeasure: '%',
        },
      },
      {
        type: { value: 'Number (increase)' },
        example: {
          value: 12.5,
          unitMeasure: '%',
          variation: 12.5,
          variationMeasure: 'vs LY',
        },
      },
      {
        type: { value: 'Number (decrease)' },
        example: {
          value: -8.3,
          unitMeasure: '%',
          variation: -8.3,
          variationMeasure: 'vs LY',
        },
      },
      {
        type: { value: 'Number (color only)' },
        example: {
          value: 5.2,
          unitMeasure: '%',
          variation: 5.2,
          showArrow: false,
        },
      },
      {
        type: { value: 'Number (cost down = good)' },
        example: {
          value: -5.2,
          unitMeasure: '%',
          iconVariationDirection: 'down',
          variationDirection: 'up',
          variationMeasure: 'vs LY',
        },
      },
      {
        type: { value: 'Number (revenue down = bad)' },
        example: {
          value: -3.1,
          unitMeasure: '%',
          iconVariationDirection: 'down',
          variationDirection: 'down',
          variationMeasure: 'vs LY',
        },
      },
      {
        type: { value: 'Circle Image + Text' },
        example: {
          value: 'Brazil',
          contentType: 'circleImageText',
          img: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/BRA.png',
          imgName: 'Brazil',
          imgShape: 'circle',
        },
      },
      {
        type: { value: 'External Image' },
        example: {
          value: 'Placeholder',
          contentType: 'circleImageText',
          img: 'https://placehold.co/60x60',
          imgName: 'External placeholder',
          imgShape: 'square',
        },
      },
      {
        type: { value: 'Image Top Position' },
        example: {
          value: 'Brazil',
          contentType: 'circleImageText',
          img: 'https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/BRA.png',
          imgName: 'Brazil',
          imgShape: 'circle',
          imagePosition: 'top',
        },
      },
    ],
  ],
};

export const interactiveCellsMock: TableDataType = {
  header: [
    { id: 'type', title: 'Cell Type', align: 'left' },
    { id: 'example', title: 'Example', align: 'center' },
  ],
  rows: [
    [
      {
        type: { value: 'Checkbox (unchecked)' },
        example: {
          value: 'Option A',
          checkbox: true,
          checkboxState: 'unchecked',
        },
      },
      {
        type: { value: 'Checkbox (checked)' },
        example: {
          value: 'Option B',
          checkbox: true,
          checkboxState: 'checked',
        },
      },
      {
        type: { value: 'Checkbox (indeterminate)' },
        example: {
          value: 'Option C',
          checkbox: true,
          checkboxState: 'indeterminate',
        },
      },
      {
        type: { value: 'Checkbox (disabled)' },
        example: {
          value: 'Disabled option',
          checkbox: true,
          checkboxState: 'unchecked',
          disabled: true,
        },
      },
      {
        type: { value: 'Icon (Design System)' },
        example: {
          icon: 'BarChart2',
          value: 'Metrics',
        },
      },
      {
        type: { value: 'Icon (World)' },
        example: {
          icon: 'World',
          value: 'Global Region',
          iconSize: 'medium',
        },
      },
      {
        type: { value: 'Icon (SVG path)' },
        example: {
          icon: 'assets/icons/filters.svg',
          value: 'Filters',
        },
      },
      {
        type: { value: 'Icon (External URL)' },
        example: {
          icon: 'https://placehold.co/20x20',
          value: 'External Icon',
        },
      },
      {
        type: { value: 'Icon (Right position)' },
        example: {
          icon: 'Check',
          value: 'Completed',
          iconPosition: 'right',
        },
      },
      {
        type: { value: 'Double Value (inline)' },
        example: {
          value: 45.1,
          unitMeasure: '%',
          secondaryValue: 1000,
        },
      },
      {
        type: { value: 'Double Value (stacked)' },
        example: {
          value: 45.1,
          unitMeasure: '%',
          secondaryValue: 1000,
          secondaryUnitMeasure: ' units',
          layout: 'stacked',
        },
      },
    ],
  ],
};

export const alignmentMock: TableDataType = {
  header: [
    { id: 'left', title: 'Left', align: 'left' },
    { id: 'center', title: 'Center', align: 'center' },
    { id: 'right', title: 'Right', align: 'right' },
  ],
  rows: [
    [
      {
        left: { value: 'Axis' },
        center: { value: 'Axis' },
        right: { value: 'Axis' },
      },
      {
        left: { value: 'Text', contentType: 'primaryText' },
        center: { value: 'Text', contentType: 'primaryText' },
        right: { value: 'Text', contentType: 'primaryText' },
      },
      {
        left: { value: 'Text' },
        center: { value: 'Text' },
        right: { value: 'Text' },
      },
      {
        left: { value: '0000' },
        center: { value: '0000' },
        right: { value: '0000' },
      },
      {
        left: { value: '0000', variation: 5.2, variationMeasure: '' },
        center: { value: '0000', variation: 5.2, variationMeasure: '' },
        right: { value: '0000', variation: 5.2, variationMeasure: '' },
      },
      {
        left: { value: '0000', variation: -3.1, variationMeasure: '' },
        center: { value: '0000', variation: -3.1, variationMeasure: '' },
        right: { value: '0000', variation: -3.1, variationMeasure: '' },
      },
    ],
  ],
};

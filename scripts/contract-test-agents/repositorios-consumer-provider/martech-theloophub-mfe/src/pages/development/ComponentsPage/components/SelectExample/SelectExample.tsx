import { useState } from 'react';

import { Heading, Paragraph } from '@hexa-ui/components';
import { Award, Beer, MapPin, Package, TrendingUp } from '@hexa-ui/icons2';
import { Select } from 'components';
import { Option } from 'models/Filters';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

// Chip placeholder component
const ChipPlaceholder = (options: Option[] | Option) => {
  if (!options?.[0]) return null;
  const op = options?.[0] || {};
  return (
    <img
      src={`https://theloop20.test-abinbev.acsitefactory.com/modules/custom/abinbev_loop_components/assets/img/rounded_flags/${op?.value}.png`}
      alt={op?.label}
      width={16}
      height={16}
    />
  );
};

const ChipPlaceholder2 = (option: Option) => {
  if (option?.value === 'Budweiser') {
    return (
      <img
        src="https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/styles/content_brand_square_image/public/2025-01/Budweiser_0.png?itok=9b6rIGGh"
        alt="Budweiser"
        width={16}
        height={16}
        style={{ borderRadius: '50%' }}
      />
    );
  }
  if (option?.value === 'Stella Artois') {
    return (
      <img
        src="https://theloop20.test-abinbev.acsitefactory.com/sites/g/files/wnfebl11871/files/styles/content_brand_square_image/public/2025-01/Stella%20Artois.png?itok=7x8ZUc0g"
        alt="Stella Artois"
        width={16}
        height={16}
        style={{ borderRadius: '50%' }}
      />
    );
  }
  return null;
};

const ChipPlaceholderWithIcon = (option: Option) => {
  if (!option?.icon) return null;
  const IconComponent = option.icon;
  return <IconComponent />;
};

// Mock data
const simpleOptions: Option[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
];

const countriesOptions: Option[] = [
  { value: 'BRA', label: 'Brazil' },
  { value: 'ARG', label: 'Argentina' },
  { value: 'MEX', label: 'Mexico' },
  { value: 'USA', label: 'United States' },
  { value: 'CAN', label: 'Canada' },
  { value: 'GBR', label: 'United Kingdom' },
  { value: 'DEU', label: 'Germany' },
  { value: 'FRA', label: 'France' },
  { value: 'ESP', label: 'Spain' },
  { value: 'ITA', label: 'Italy' },
];

const groupedOptions = [
  {
    group: 'Zone 1',
    values: [
      { value: 'z1-item1', label: 'Item 1' },
      { value: 'z1-item2', label: 'Item 2' },
      { value: 'z1-item3', label: 'Item 3' },
    ],
  },
  {
    group: 'Zone 2',
    values: [
      { value: 'z2-item1', label: 'Item 1' },
      { value: 'z2-item2', label: 'Item 2' },
      { value: 'z2-item3', label: 'Item 3' },
    ],
  },
  {
    group: 'Zone 3',
    values: [
      { value: 'z3-item1', label: 'Item 1' },
      { value: 'z3-item2', label: 'Item 2' },
    ],
  },
];

const brandsOptions: Option[] = [
  { value: 'Budweiser', label: 'Budweiser' },
  { value: 'Stella Artois', label: 'Stella Artois' },
  { value: 'Corona', label: 'Corona' },
  { value: "Beck's", label: "Beck's" },
  { value: 'Brahma', label: 'Brahma' },
  { value: 'Skol', label: 'Skol' },
  { value: 'Antarctica', label: 'Antarctica' },
  { value: 'Quilmes', label: 'Quilmes' },
];

// Options with some disabled
const optionsWithDisabled: Option[] = [
  { value: 'option1', label: 'Option 1 (Available)' },
  { value: 'option2', label: 'Option 2 (Disabled)', isDisabled: true },
  { value: 'option3', label: 'Option 3 (Available)' },
  { value: 'option4', label: 'Option 4 (Disabled)', isDisabled: true },
  { value: 'option5', label: 'Option 5 (Available)' },
  { value: 'option6', label: 'Option 6 (Disabled)', isDisabled: true },
];

// Options with icons
const optionsWithIcons: Option[] = [
  { value: 'trending', label: 'Trending Products', icon: TrendingUp },
  { value: 'featured', label: 'Featured Items', icon: Award },
  { value: 'beverages', label: 'Beverages', icon: Beer },
  { value: 'locations', label: 'Store Locations', icon: MapPin },
];

export const SelectExample = () => {
  // Single select states
  const [singleValue, setSingleValue] = useState<string | Option>('');
  const [singleWithIcon, setSingleWithIcon] = useState<string | Option>('');
  const [singleSearchable, setSingleSearchable] = useState<string | Option>('');
  const [singleClearable, setSingleClearable] = useState<string | Option>('');
  const [singleOptional, setSingleOptional] = useState<string | Option>('');
  const [singleOptionalChips, setSingleOptionalChips] = useState<
    string | Option
  >('option1');
  const [singleDisabled] = useState<string | Option>('option2');
  const [singleError, setSingleError] = useState<string | Option>('');

  // Multiple select states
  const [multipleValue, setMultipleValue] = useState<Option[]>([]);
  const [multipleWithChips, setMultipleWithChips] = useState<Option[]>([]);
  const [multipleGrouped, setMultipleGrouped] = useState<Option[]>([]);
  const [multipleNoSelectAll, setMultipleNoSelectAll] = useState<Option[]>([]);
  const [
    multipleWithChipsClearChipsDisabled,
    setMultipleWithChipsClearChipsDisabled,
  ] = useState<Option[]>([]);
  const [singleChipsWithPlaceholder, setSingleChipsWithPlaceholder] = useState<
    string | Option
  >('BRA');
  const [multipleChipsWithPlaceholder, setMultipleChipsWithPlaceholder] =
    useState<Option[]>([
      { value: 'Budweiser', label: 'Budweiser' },
      { value: 'Stella Artois', label: 'Stella Artois' },
    ]);
  const [
    multipleChipsWithPlaceholderDisabled,
    setMultipleChipsWithPlaceholderDisabled,
  ] = useState<Option[]>([
    { value: 'Budweiser', label: 'Budweiser' },
    { value: 'Stella Artois', label: 'Stella Artois' },
  ]);
  const [singleChipsWithPlaceholderDisabled] = useState<string | Option>(
    'Budweiser',
  );

  // MaxMenuItems states
  const [maxMenuItems5, setMaxMenuItems5] = useState<string | Option>('');
  const [maxMenuItems9, setMaxMenuItems9] = useState<string | Option>('');

  // maxChips states
  const [maxChips2, setMaxChips2] = useState<Option[]>([]);
  const [maxChips3, setMaxChips3] = useState<Option[]>([]);

  // allSelectedChip states
  const [allSelectedChipBasic, setAllSelectedChipBasic] = useState<Option[]>(
    [],
  );
  const [allSelectedChipWithIcon, setAllSelectedChipWithIcon] = useState<
    Option[]
  >([]);

  // Options with disabled and icons states
  const [optionsDisabled, setOptionsDisabled] = useState<string | Option>('');
  const [optionsWithIcon, setOptionsWithIcon] = useState<string | Option>('');
  const [multipleOptionsDisabled, setMultipleOptionsDisabled] = useState<
    Option[]
  >([]);
  const [multipleOptionsWithIcon, setMultipleOptionsWithIcon] = useState<
    Option[]
  >([]);

  // Size states
  const [smallSize, setSmallSize] = useState<string | Option>('');
  const [mediumSize, setMediumSize] = useState<string | Option>('');
  const [largeSize, setLargeSize] = useState<string | Option>('');

  // Shape states
  const [squareShape, setSquareShape] = useState<string | Option>('');
  const [pillShape, setPillShape] = useState<string | Option>('');

  // Appearance states
  const [defaultAppearance, setDefaultAppearance] = useState<string | Option>(
    '',
  );
  const [plainAppearance, setPlainAppearance] = useState<string | Option>('');

  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Select Component Examples</Heading>
      </StyledSection>

      {/* Basic Single Select Examples */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Basic Single Select
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="single-basic"
            label="Basic Select"
            placeholder="Choose an option"
            options={simpleOptions}
            value={singleValue}
            onValueChange={(val) => setSingleValue(val as string | Option)}
            fitContent
          />
        </div>
        <div>
          <Select
            id="single-with-icon"
            label="Select with Icon"
            placeholder="Choose a brand"
            options={brandsOptions}
            value={singleWithIcon}
            onValueChange={(val) => setSingleWithIcon(val as string | Option)}
            icon={Package}
            fitContent
          />
        </div>
        <div>
          <Select
            id="single-optional"
            label="Optional Select"
            placeholder="This is optional"
            options={simpleOptions}
            value={singleOptional}
            onValueChange={(val) => setSingleOptional(val as string | Option)}
            optional
            fitContent
          />
        </div>
        <div>
          <Select
            id="single-optional"
            label="Optional Select"
            placeholder=""
            valueLabel="Selected Options"
            options={simpleOptions}
            value={singleOptionalChips}
            onValueChange={(val) =>
              setSingleOptionalChips(val as string | Option)
            }
            optional
            chips
            fitContent
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="single-chips-with-placeholder"
            label="Single Chips with Placeholder"
            placeholder=""
            valueLabel="Country"
            options={countriesOptions}
            value={singleChipsWithPlaceholder}
            onValueChange={(val) =>
              setSingleChipsWithPlaceholder(val as string | Option)
            }
            chips
            getChipPlaceholder={ChipPlaceholder}
            shape="pill"
            fitContent
          />
        </div>
      </StyledSection>

      {/* Single Select with Features */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Single Select Features
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="single-searchable"
            label="Searchable"
            placeholder=""
            valueLabel="Can be searched"
            options={countriesOptions}
            value={singleSearchable}
            onValueChange={(val) => setSingleSearchable(val as string | Option)}
            searchable
            chips
            fitContent
          />
        </div>
        <div>
          <Select
            id="single-clearable"
            label="Clearable"
            placeholder="Can be cleared"
            options={simpleOptions}
            value={singleClearable}
            onValueChange={(val) => setSingleClearable(val as string | Option)}
            clearable
            fitContent
          />
        </div>
        <div>
          <Select
            id="single-disabled"
            label="Disabled"
            placeholder="Cannot interact"
            options={simpleOptions}
            value={singleDisabled}
            disabled
            fitContent
          />
        </div>

        <div>
          <Select
            id="single-chips-with-placeholder-disabled"
            label="Single Chips with Placeholder Disabled"
            placeholder=""
            valueLabel="Selected Options"
            options={countriesOptions}
            value={singleChipsWithPlaceholderDisabled}
            disabled
            chips
            clearChips={false}
            fitContent
          />
        </div>
      </StyledSection>

      {/* Select with States */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Select States
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="single-loading"
            label="Loading State"
            placeholder="Loading..."
            options={simpleOptions}
            loading
            fitContent
          />
        </div>
        <div>
          <Select
            id="single-error"
            label="Error State"
            placeholder="Has error"
            options={simpleOptions}
            value={singleError}
            onValueChange={(val) => setSingleError(val as string | Option)}
            error="This field is required"
            fitContent
          />
        </div>
      </StyledSection>

      {/* Multiple Select Examples */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Multiple Select
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="multiple-basic"
            label="Multiple Select"
            placeholder="Select multiple"
            valueLabel="Selected Options"
            options={simpleOptions}
            value={multipleValue}
            onValueChange={(val) => setMultipleValue(val as Option[])}
            multiple
            fitContent
          />
        </div>
        <div>
          <Select
            id="multiple-chips"
            label="Multiple with Chips"
            placeholder="Select brands"
            valueLabel="Selected Options"
            options={brandsOptions}
            value={multipleWithChips}
            onValueChange={(val) => setMultipleWithChips(val as Option[])}
            multiple
            chips
            fitContent
          />
        </div>
        <div>
          <Select
            id="multiple-chips-clear-chips-disabled"
            label="Multiple with Chips (Clear Chips disabled)"
            placeholder="Select brands"
            valueLabel="Selected Options"
            options={brandsOptions}
            value={multipleWithChipsClearChipsDisabled}
            onValueChange={(val) =>
              setMultipleWithChipsClearChipsDisabled(val as Option[])
            }
            multiple
            chips
            clearChips={false}
            fitContent
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="multiple-no-select-all"
            label="Without Select All"
            placeholder="Select multiple"
            valueLabel="Selected Options"
            options={simpleOptions}
            value={multipleNoSelectAll}
            onValueChange={(val) => setMultipleNoSelectAll(val as Option[])}
            multiple
            showSelectAll={false}
            fitContent
          />
        </div>
        <div>
          <Select
            id="multiple-chips-with-placeholder"
            label="Multiple Chips with Placeholder"
            placeholder="Select brands"
            valueLabel="Selected Brands"
            options={brandsOptions}
            value={multipleChipsWithPlaceholder}
            onValueChange={(val) =>
              setMultipleChipsWithPlaceholder(val as Option[])
            }
            multiple
            chips
            getChipPlaceholder={ChipPlaceholder2}
            fitContent
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="multiple-chips-with-placeholder-disabled"
            label="Multiple Chips with Placeholder Disabled"
            placeholder="Select brands"
            valueLabel="Selected Brands"
            options={brandsOptions}
            value={multipleChipsWithPlaceholderDisabled}
            onValueChange={(val) =>
              setMultipleChipsWithPlaceholderDisabled(val as Option[])
            }
            multiple
            chips
            clearChips={false}
            disabled
            fitContent
          />
        </div>
      </StyledSection>

      {/* Grouped Options */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Grouped Options
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div style={{ width: '400px' }}>
          <Select
            id="multiple-grouped"
            label="Grouped Select"
            placeholder="Select from groups"
            valueLabel="Select from groups"
            options={groupedOptions}
            value={multipleGrouped}
            onValueChange={(val) => setMultipleGrouped(val as Option[])}
            multiple
            fitContent
          />
        </div>
      </StyledSection>

      {/* Size Variants */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Size Variants
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="size-small"
            label="Small"
            placeholder="Small select"
            options={simpleOptions}
            value={smallSize}
            onValueChange={(val) => setSmallSize(val as string | Option)}
            size="small"
            fitContent
          />
        </div>
        <div>
          <Select
            id="size-medium"
            label="Medium"
            placeholder="Medium select"
            options={simpleOptions}
            value={mediumSize}
            onValueChange={(val) => setMediumSize(val as string | Option)}
            size="medium"
            fitContent
          />
        </div>
        <div style={{ width: '350px' }}>
          <Select
            id="size-large"
            label="Large (Default)"
            placeholder="Large select"
            options={simpleOptions}
            value={largeSize}
            onValueChange={(val) => setLargeSize(val as string | Option)}
            size="large"
            fitContent
          />
        </div>
      </StyledSection>

      {/* Shape Variants */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Shape Variants
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="shape-square"
            label="Square (Default)"
            placeholder="Square shape"
            options={simpleOptions}
            value={squareShape}
            onValueChange={(val) => setSquareShape(val as string | Option)}
            shape="square"
            fitContent
          />
        </div>
        <div>
          <Select
            id="shape-pill"
            label="Pill"
            placeholder="Pill shape"
            options={simpleOptions}
            value={pillShape}
            onValueChange={(val) => setPillShape(val as string | Option)}
            shape="pill"
            fitContent
          />
        </div>
      </StyledSection>

      {/* Appearance Variants */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Appearance Variants
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="appearance-default"
            label="Default Appearance"
            placeholder="Default style"
            options={simpleOptions}
            value={defaultAppearance}
            onValueChange={(val) =>
              setDefaultAppearance(val as string | Option)
            }
            appearance="default"
            fitContent
          />
        </div>
        <div>
          <Select
            id="appearance-plain"
            label="Plain Appearance"
            placeholder="Plain style"
            options={simpleOptions}
            value={plainAppearance}
            onValueChange={(val) => setPlainAppearance(val as string | Option)}
            appearance="plain"
            fitContent
          />
        </div>
      </StyledSection>

      {/* Max Menu Items Examples */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Max Menu Items (Scroll Limit)
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="max-menu-items-5"
            label="Max Menu Items: 5 (Default) - Large"
            placeholder="Open to see 5 items max"
            options={countriesOptions}
            value={maxMenuItems5}
            onValueChange={(val) => setMaxMenuItems5(val as string | Option)}
            maxMenuItems={5}
            size="large"
            searchable
            fitContent
          />
        </div>
        <div>
          <Select
            id="max-menu-items-9"
            label="Max Menu Items: 9 - Large"
            placeholder="Open to see 9 items max"
            options={countriesOptions}
            value={maxMenuItems9}
            onValueChange={(val) => setMaxMenuItems9(val as string | Option)}
            maxMenuItems={9}
            size="large"
            searchable
            fitContent
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="max-menu-items-5-medium"
            label="Max Menu Items: 5 - Medium"
            placeholder="Open to see 5 items max"
            options={countriesOptions}
            maxMenuItems={5}
            size="medium"
            searchable
            fitContent
          />
        </div>
        <div>
          <Select
            id="max-menu-items-9-medium"
            label="Max Menu Items: 9 - Medium"
            placeholder="Open to see 9 items max"
            options={countriesOptions}
            maxMenuItems={9}
            size="medium"
            searchable
            fitContent
          />
        </div>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="max-menu-items-5-small"
            label="Max Menu Items: 5 - Small"
            placeholder="Open to see 5 items max"
            options={countriesOptions}
            maxMenuItems={5}
            size="small"
            searchable
            fitContent
          />
        </div>
        <div>
          <Select
            id="max-menu-items-9-small"
            label="Max Menu Items: 9 - Small"
            placeholder="Open to see 9 items max"
            options={countriesOptions}
            maxMenuItems={9}
            size="small"
            searchable
            fitContent
          />
        </div>
      </StyledSection>

      {/* maxChips */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          maxChips (Chip Display Limit)
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="max-chips-2"
            label="maxChips={2} — select more than 2 to see overflow"
            placeholder="Select brands"
            valueLabel="Selected Brands"
            options={brandsOptions}
            value={maxChips2}
            onValueChange={(val) => setMaxChips2(val as Option[])}
            multiple
            chips
            maxChips={2}
            showSelectAll
            searchable
            fitContent
          />
        </div>
        <div>
          <Select
            id="max-chips-3"
            label="maxChips={3} — pill shape"
            placeholder="Select brands"
            valueLabel="Selected Brands"
            options={brandsOptions}
            value={maxChips3}
            onValueChange={(val) => setMaxChips3(val as Option[])}
            multiple
            chips
            maxChips={3}
            showSelectAll
            searchable
            shape="pill"
            fitContent
          />
        </div>
      </StyledSection>

      {/* allSelectedChip */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          allSelectedChip (All-Selected Chip Label)
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="all-selected-chip-basic"
            label="allSelectedChip — select all to see the chip"
            placeholder="Select options"
            valueLabel="Selected Options"
            options={simpleOptions}
            value={allSelectedChipBasic}
            onValueChange={(val) => setAllSelectedChipBasic(val as Option[])}
            multiple
            chips
            maxChips={2}
            showSelectAll
            selectAllLabel="Select All"
            allSelectedChip="All options"
            searchable
            fitContent
          />
        </div>
        <div>
          <Select
            id="all-selected-chip-with-icon"
            label="allSelectedChip + icon + pill — select all"
            placeholder="Select brands"
            valueLabel="Brands"
            options={brandsOptions}
            value={allSelectedChipWithIcon}
            onValueChange={(val) => setAllSelectedChipWithIcon(val as Option[])}
            multiple
            chips
            maxChips={2}
            showSelectAll
            selectAllLabel="All Brands"
            allSelectedChip="All Brands Selected"
            icon={Beer}
            shape="pill"
            size="medium"
            searchable
            fitContent
          />
        </div>
      </StyledSection>

      {/* Options with Disabled and Icons */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Options with Disabled States
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="options-disabled-single"
            label="Single Select - Some Options Disabled"
            placeholder="Try to select disabled options"
            options={optionsWithDisabled}
            value={optionsDisabled}
            onValueChange={(val) => setOptionsDisabled(val as string | Option)}
            fitContent
          />
        </div>
        <div>
          <Select
            id="options-disabled-multiple"
            label="Multiple Select - Some Options Disabled"
            placeholder="Select multiple (some disabled)"
            options={optionsWithDisabled}
            value={multipleOptionsDisabled}
            valueLabel="Selected Options"
            onValueChange={(val) => setMultipleOptionsDisabled(val as Option[])}
            multiple
            chips
            fitContent
          />
        </div>
      </StyledSection>

      {/* Options with Icons */}
      <StyledSection>
        <Paragraph
          style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '24px' }}
        >
          Options with Icons
        </Paragraph>
      </StyledSection>
      <StyledSection>
        <div>
          <Select
            id="options-with-icon-single"
            label="Single Select - Options with Icons"
            placeholder="Select a category"
            options={optionsWithIcons}
            value={optionsWithIcon}
            onValueChange={(val) => setOptionsWithIcon(val as string | Option)}
            icon={
              typeof optionsWithIcon === 'object' && optionsWithIcon?.icon
                ? optionsWithIcon.icon
                : optionsWithIcons.find((opt) => opt.value === optionsWithIcon)
                    ?.icon
            }
            fitContent
          />
        </div>
        <div>
          <Select
            id="options-with-icon-multiple"
            label="Multiple Select - Options with Icons"
            placeholder="Select categories"
            options={optionsWithIcons}
            value={multipleOptionsWithIcon}
            valueLabel="Selected Categories"
            onValueChange={(val) => setMultipleOptionsWithIcon(val as Option[])}
            multiple
            chips
            getChipPlaceholder={ChipPlaceholderWithIcon}
            fitContent
          />
        </div>
      </StyledSection>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </StyledContainer>
  );
};

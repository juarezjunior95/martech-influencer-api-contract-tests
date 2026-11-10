import { useCallback, useMemo } from 'react';

import type {
  LabelValuePair,
  QueryParameter,
  SmartFlowConfig,
} from 'models/InsightsCopilot';
import { useGetExhaustiveValuesQuery } from 'redux/api/insightsCopilot';

import { Select } from '../../atoms/Select';
import { DiagnosisContainer, TextSpan } from './SmartFlowDiagnosis.styles';
import { parseTemplate, sortDropdownValues } from './templateParser';

export interface SmartFlowDiagnosisProps {
  flow: SmartFlowConfig;
  selectedParams: Record<string, LabelValuePair[]>;
  onParamChange: (key: string, values: LabelValuePair[]) => void;
  projectKey: string;
}

const FALLBACK_PARAM: QueryParameter = {
  input_type: 'static',
  placeholder_text: 'Select...',
  is_mandatory: false,
  allow_multiselect: false,
  default_options: [],
  static_options: [],
};

const SmartFlowSelect = ({
  param,
  selected,
  onChange,
  projectKey,
}: {
  param: QueryParameter;
  selected: LabelValuePair[];
  onChange: (values: LabelValuePair[]) => void;
  projectKey: string;
}) => {
  const { data: asyncOptions = [], isLoading } = useGetExhaustiveValuesQuery(
    {
      projectKey,
      sourceTables: param.source_tables ?? [],
    },
    { skip: !param.source_tables?.length },
  );

  const sortedOptions = useMemo(
    () =>
      sortDropdownValues(
        param.default_options || [],
        param.static_options || [],
        asyncOptions,
      ),
    [param.default_options, param.static_options, asyncOptions],
  );

  return (
    <Select
      options={sortedOptions}
      selected={selected}
      onChange={onChange}
      placeholder={param.placeholder_text}
      required={param.is_mandatory}
      allowMultiSelect={param.allow_multiselect}
      loading={isLoading}
      searchable
    />
  );
};

export const SmartFlowDiagnosis = ({
  flow,
  selectedParams,
  onParamChange,
  projectKey,
}: SmartFlowDiagnosisProps) => {
  const parts = useMemo(() => parseTemplate(flow.query), [flow.query]);

  const params = flow.query_parameters || {};

  const handleParamChange = useCallback(
    (key: string) => (values: LabelValuePair[]) => {
      onParamChange(key, values);
    },
    [onParamChange],
  );

  return (
    <DiagnosisContainer>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <TextSpan key={`text-${index}-${part.content}`}>
              {part.content}
            </TextSpan>
          );
        }

        // API keys have @ prefix (e.g. "@brand"), template parser strips it
        const paramKey = `@${part.content}`;
        const param = params[paramKey] || FALLBACK_PARAM;
        const selected = selectedParams[paramKey] || [];

        if (param.input_type === 'search') {
          return (
            <SmartFlowSelect
              key={part.content}
              param={param}
              selected={selected}
              onChange={handleParamChange(paramKey)}
              projectKey={projectKey}
            />
          );
        }

        const options = sortDropdownValues(
          param.default_options || [],
          param.static_options || [],
        );

        return (
          <Select
            key={part.content}
            options={options}
            selected={selected}
            onChange={handleParamChange(paramKey)}
            placeholder={param.placeholder_text || part.content}
            required={param.is_mandatory}
            allowMultiSelect={param.allow_multiselect}
            searchable
          />
        );
      })}
    </DiagnosisContainer>
  );
};

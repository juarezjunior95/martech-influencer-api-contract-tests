import { ZeroStackMinHeightPlugin } from '../plugins/ZeroStackMinHeightPlugin';
import { ResponsiveConfig, StackedAreaData } from '../types';
import { createAreaConnectorPlugin } from './AreaConnectorPlugin';
import { createRoundedCornersPlugin } from './RoundedCornersPlugin';
import { ZeroLabelPlugin } from './ZeroLabelPlugin';

export function getStackedAreaPlugins(
  data: StackedAreaData,
  config: ResponsiveConfig,
) {
  return [
    ZeroStackMinHeightPlugin,
    ZeroLabelPlugin,
    createRoundedCornersPlugin(config.borderRadius),
    createAreaConnectorPlugin(data.connectorColors),
  ];
}

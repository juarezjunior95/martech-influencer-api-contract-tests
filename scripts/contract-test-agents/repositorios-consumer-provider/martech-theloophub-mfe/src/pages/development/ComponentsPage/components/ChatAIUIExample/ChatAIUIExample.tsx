import { useState } from 'react';

import {
  BetaTagExample,
  BottomBarExample,
  ButtonExample,
  ChatAreaExample,
  ChatHeaderExample,
  CheckboxExample,
  CopyButtonExample,
  DividerExample,
  DrawerExample,
  DropdownExample,
  ExecutionLogExample,
  InputExample,
  LoaderExample,
  MarkdownPlaygroundExample,
  MessageBubbleExample,
  ModalExample,
  SidebarExample,
  SmartFlowButtonExample,
  SmartFlowDiagnosisExample,
  SmartFlowOverlayExample,
  SmartFlowSelectExample,
  StepperExample,
  TemplateCardExample,
  TextAreaExample,
  ToasterExample,
  ToastExample,
  TooltipExample,
} from 'components/ai/examples';

import 'components/ai/tokens/styles.css';
import {
  Arrow,
  CategoryButton,
  Content,
  Grid,
  Header,
  ItemButton,
  ItemsList,
  Layout,
  Page,
  Sidebar,
  SidebarGroup,
} from './ChatAIUIExample.styles';

type CategoryKey = 'atoms' | 'molecules' | 'organisms' | 'playground';

interface SidebarItem {
  key: string;
  label: string;
  component: React.FC;
}

interface Category {
  key: CategoryKey;
  label: string;
  items: SidebarItem[];
}

const categories: Category[] = [
  {
    key: 'atoms',
    label: 'Atoms',
    items: [
      { key: 'beta-tag', label: 'BetaTag', component: BetaTagExample },
      { key: 'button', label: 'Button', component: ButtonExample },
      {
        key: 'copy-button',
        label: 'CopyButton',
        component: CopyButtonExample,
      },
      { key: 'checkbox', label: 'Checkbox', component: CheckboxExample },
      { key: 'divider', label: 'Divider', component: DividerExample },
      { key: 'dropdown', label: 'Dropdown', component: DropdownExample },
      { key: 'input', label: 'Input', component: InputExample },
      { key: 'loader', label: 'Loader', component: LoaderExample },
      { key: 'stepper', label: 'Stepper', component: StepperExample },
      { key: 'toast', label: 'Toast', component: ToastExample },
      { key: 'toaster', label: 'Toaster', component: ToasterExample },
      { key: 'tooltip', label: 'Tooltip', component: TooltipExample },
      {
        key: 'smartflow-button',
        label: 'SmartFlowButton',
        component: SmartFlowButtonExample,
      },
    ],
  },
  {
    key: 'molecules',
    label: 'Molecules',
    items: [
      {
        key: 'bottom-bar',
        label: 'BottomBar',
        component: BottomBarExample,
      },
      {
        key: 'chat-header',
        label: 'ChatHeader',
        component: ChatHeaderExample,
      },
      {
        key: 'message-bubble',
        label: 'MessageBubble',
        component: MessageBubbleExample,
      },
      {
        key: 'smartflow-diagnosis',
        label: 'SmartFlowDiagnosis',
        component: SmartFlowDiagnosisExample,
      },
      {
        key: 'smartflow-select',
        label: 'SmartFlowSelect',
        component: SmartFlowSelectExample,
      },
      {
        key: 'template-card',
        label: 'TemplateCard',
        component: TemplateCardExample,
      },
      { key: 'textarea', label: 'TextArea', component: TextAreaExample },
    ],
  },
  {
    key: 'organisms',
    label: 'Organisms',
    items: [
      {
        key: 'chat-area',
        label: 'ChatArea',
        component: ChatAreaExample,
      },
      { key: 'drawer', label: 'Drawer', component: DrawerExample },
      {
        key: 'execution-log',
        label: 'ExecutionLog',
        component: ExecutionLogExample,
      },
      { key: 'modal', label: 'Modal', component: ModalExample },
      { key: 'sidebar', label: 'Sidebar', component: SidebarExample },
      {
        key: 'smartflow-overlay',
        label: 'SmartFlowOverlay',
        component: SmartFlowOverlayExample,
      },
    ],
  },
  {
    key: 'playground',
    label: 'Playground',
    items: [
      {
        key: 'markdown',
        label: 'MarkdownPlayground',
        component: MarkdownPlaygroundExample,
      },
    ],
  },
];

export const ChatAIUIExample = () => {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<CategoryKey>
  >(new Set(['atoms']));
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('atoms');
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleCategory = (key: CategoryKey) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleCategoryClick = (key: CategoryKey) => {
    setActiveCategory(key);
    setActiveItem(null);
    toggleCategory(key);
  };

  const handleItemClick = (categoryKey: CategoryKey, itemKey: string) => {
    setActiveCategory(categoryKey);
    setActiveItem(itemKey);
    if (!expandedCategories.has(categoryKey)) {
      setExpandedCategories((prev) => new Set(prev).add(categoryKey));
    }
  };

  const renderContent = () => {
    const category = categories.find((c) => c.key === activeCategory);
    if (!category) return null;

    if (activeItem) {
      const item = category.items.find((i) => i.key === activeItem);
      if (!item) return null;
      const Component = item.component;
      return <Component />;
    }

    return (
      <>
        {category.items.map((item) => {
          const Component = item.component;
          return <Component key={item.key} />;
        })}
      </>
    );
  };

  return (
    <Page>
      <Header>
        <h1>AI Chat UI</h1>
        <p>Componentes para interfaces de chat com IA</p>
      </Header>

      <Layout>
        <Sidebar>
          {categories.map((category) => (
            <SidebarGroup key={category.key}>
              <CategoryButton
                isActive={activeCategory === category.key && !activeItem}
                onClick={() => handleCategoryClick(category.key)}
              >
                <Arrow isExpanded={expandedCategories.has(category.key)}>
                  &#9654;
                </Arrow>
                {category.label}
              </CategoryButton>

              {expandedCategories.has(category.key) && (
                <ItemsList>
                  {category.items.map((item) => (
                    <li key={item.key}>
                      <ItemButton
                        isActive={
                          activeCategory === category.key &&
                          activeItem === item.key
                        }
                        onClick={() => handleItemClick(category.key, item.key)}
                      >
                        {item.label}
                      </ItemButton>
                    </li>
                  ))}
                </ItemsList>
              )}
            </SidebarGroup>
          ))}
        </Sidebar>

        <Content>
          <Grid>{renderContent()}</Grid>
        </Content>
      </Layout>
    </Page>
  );
};

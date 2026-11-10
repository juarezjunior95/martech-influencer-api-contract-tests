import styled from '@emotion/styled';

export const Page = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: var(--ai-chat-font-family, 'Avant', sans-serif);
`;

export const Header = styled.header`
  margin-bottom: 24px;

  h1 {
    font-family: 'Barlow', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--ai-chat-color-text-primary, #141414);
    margin: 0 0 8px;
  }

  p {
    font-size: 16px;
    color: var(--ai-chat-color-fg-secondary, #5c5c5c);
    margin: 0;
  }
`;

export const Layout = styled.div`
  display: flex;
  gap: 24px;
`;

export const Sidebar = styled.nav`
  width: 180px;
  flex-shrink: 0;
  background: var(--ai-chat-color-bg-default-subtle, #fafafa);
  border-radius: var(--ai-chat-radius-md, 8px);
  padding: 12px 0;
  align-self: flex-start;
  position: sticky;
  top: 32px;
  border: 1px solid var(--ai-chat-color-bd-tertiary, rgba(0, 0, 0, 0.08));
`;

export const SidebarGroup = styled.div`
  margin-bottom: 2px;
`;

export const CategoryButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: ${({ isActive }) =>
    isActive ? 'rgba(229, 182, 17, 0.08)' : 'none'};
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ isActive }) =>
    isActive
      ? 'var(--ai-chat-color-primary, #e5b611)'
      : 'var(--ai-chat-color-text-primary, #141414)'};
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ isActive }) =>
      isActive
        ? 'rgba(229, 182, 17, 0.12)'
        : 'var(--ai-chat-color-bg-secondary, #f3f3f3)'};
  }
`;

export const Arrow = styled.span<{ isExpanded: boolean }>`
  font-size: 8px;
  display: inline-block;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  transition: transform 0.2s;
  transform: ${({ isExpanded }) =>
    isExpanded ? 'rotate(90deg)' : 'rotate(0)'};
`;

export const ItemsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 4px;
`;

export const ItemButton = styled.button<{ isActive: boolean }>`
  display: block;
  width: 100%;
  padding: 6px 16px 6px 36px;
  border: none;
  background: ${({ isActive }) =>
    isActive ? 'rgba(229, 182, 17, 0.08)' : 'none'};
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: ${({ isActive }) => (isActive ? 500 : 400)};
  color: ${({ isActive }) =>
    isActive
      ? 'var(--ai-chat-color-primary, #e5b611)'
      : 'var(--ai-chat-color-fg-secondary, #5c5c5c)'};
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ isActive }) =>
      isActive
        ? 'rgba(229, 182, 17, 0.12)'
        : 'var(--ai-chat-color-bg-secondary, #f3f3f3)'};
    color: ${({ isActive }) =>
      isActive
        ? 'var(--ai-chat-color-primary, #e5b611)'
        : 'var(--ai-chat-color-text-primary, #141414)'};
  }
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

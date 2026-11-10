import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
`;

export const EditorPanel = styled.div`
  flex: 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PreviewPanel = styled.div`
  flex: 3;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

export const TextArea = styled.textarea`
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  background: #fafafa;
  overflow: auto;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    background: #fff;
  }
`;

export const PreviewContainer = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
  min-width: 0;
`;

export const CharCount = styled.div`
  font-size: 11px;
  color: #999;
  text-align: right;
`;

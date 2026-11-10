import React from 'react';

import { render, screen } from '@testing-library/react';

import { ContainerWithScroll } from './container';

describe('container', () => {
  describe('ContainerWithScroll', () => {
    it('should render children correctly', () => {
      render(
        <ContainerWithScroll>
          <span data-testid="child">Test Content</span>
        </ContainerWithScroll>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should render with overflow autoY variant', () => {
      const { container } = render(
        <ContainerWithScroll overflow="autoY">Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with overflow autoX variant', () => {
      const { container } = render(
        <ContainerWithScroll overflow="autoX">Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with overflow hidden variant', () => {
      const { container } = render(
        <ContainerWithScroll overflow="hidden">Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with background white variant', () => {
      const { container } = render(
        <ContainerWithScroll background="white">Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with background none variant', () => {
      const { container } = render(
        <ContainerWithScroll background="none">Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with padding true variant', () => {
      const { container } = render(
        <ContainerWithScroll padding={true}>Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with padding false variant', () => {
      const { container } = render(
        <ContainerWithScroll padding={false}>Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with borderRadius true variant', () => {
      const { container } = render(
        <ContainerWithScroll borderRadius={true}>Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with borderRadius false variant', () => {
      const { container } = render(
        <ContainerWithScroll borderRadius={false}>Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with position relative variant', () => {
      const { container } = render(
        <ContainerWithScroll position="relative">Content</ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with multiple variants', () => {
      const { container } = render(
        <ContainerWithScroll
          overflow="autoY"
          background="white"
          padding={true}
          borderRadius={true}
          position="relative"
        >
          Content
        </ContainerWithScroll>,
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should apply has-scroll class when needed', () => {
      const { container } = render(
        <ContainerWithScroll className="has-scroll">
          Content
        </ContainerWithScroll>,
      );

      expect(container.firstChild).toHaveClass('has-scroll');
    });
  });
});

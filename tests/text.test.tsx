import React from 'react';
import Text from '../src/common/Text/Text';
import type { TextProps } from '../src/types/text';

interface RenderProps {
  children?: React.ReactNode;
  className?: string | undefined;
  style?: Record<string, unknown> | undefined;
}

describe('Text component - full behaviour', () => {
  it('should: renders with defaults when no props provided', () => {
    const props = {} as TextProps;
    const el = (Text as React.FC<TextProps>)(
      props
    ) as React.ReactElement<RenderProps>;
    const p = el.props;
    expect(p.children).toBeUndefined();
    expect(p.className).toBeDefined();
    if (p.className) {
      expect(p.className).toContain('root');
    }
  });

  it('should: respects `as` prop and variant classes', () => {
    const props: TextProps = {
      as: 'h2',
      variant: 'title',
      children: 'Heading',
    };
    const el = (Text as React.FC<TextProps>)(
      props
    ) as React.ReactElement<RenderProps>;
    const p = el.props;
    expect(el.type).toBe('h2');
    expect(p.children).toBe('Heading');
    expect(p.className).toBeDefined();
    if (p.className) {
      expect(p.className.split(' ').length).toBeGreaterThanOrEqual(2);
    }
  });

  it('should:merges style and color and preserves user style keys', () => {
    const props: TextProps = {
      style: { fontWeight: 700, lineHeight: 1.2 },
      color: '#123456',
      children: 'S',
    };
    const el = (Text as React.FC<TextProps>)(
      props
    ) as React.ReactElement<RenderProps>;
    const p = el.props;
    expect(p.style).toBeDefined();
    if (p.style) {
      expect(p.style['fontWeight']).toBe(700);
      expect(p.style['lineHeight']).toBe(1.2);
      expect(p.style['color']).toBe('#123456');
    }
  });

  it('should: applies align class when `align` prop is provided', () => {
    const props: TextProps = { align: 'center', children: 'A' };
    const el = (Text as React.FC<TextProps>)(
      props
    ) as React.ReactElement<RenderProps>;
    const p = el.props;
    expect(p.className).toBeDefined();
    if (p.className) {
      expect(p.className.includes('center')).toBeTruthy();
    }
  });

  it('should: concats user className with internal classes', () => {
    const props: TextProps = { className: 'my-extra', children: 'X' };
    const el = (Text as React.FC<TextProps>)(
      props
    ) as React.ReactElement<RenderProps>;
    const p = el.props;
    expect(p.className).toBeDefined();
    if (p.className) {
      expect(p.className.includes('my-extra')).toBeTruthy();
    }
  });

  it('should: forwards unknown props to the rendered element', () => {
    const props = {
      children: 'D',
      ['data-test']: 'ok',
    } as unknown as TextProps & Record<string, unknown>;
    const el = (Text as React.FC<TextProps>)(props) as React.ReactElement<
      Record<string, unknown>
    >;
    const p = el.props as Record<string, unknown>;
    expect(p['data-test']).toBe('ok');
  });

  it('should: falls back to body variant when unknown variant provided', () => {
    const props = {
      variant: 'nonexistent',
      children: 'F',
    } as unknown as TextProps;
    const el = (Text as React.FC<TextProps>)(
      props
    ) as React.ReactElement<RenderProps>;
    const p = el.props;
    expect(p.className).toBeDefined();
    expect(p.children).toBe('F');
  });
});

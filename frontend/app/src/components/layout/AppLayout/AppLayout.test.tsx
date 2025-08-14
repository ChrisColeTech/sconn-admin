import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(<AppLayout><div>Test content</div></AppLayout>);
    expect(container).toBeInTheDocument();
  });
});
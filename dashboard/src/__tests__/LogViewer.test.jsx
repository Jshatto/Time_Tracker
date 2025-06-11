import { render, screen } from '@testing-library/react';
import LogViewer from '../LogViewer';

test('renders log viewer heading', () => {
  render(<LogViewer />);
  const heading = screen.getByText(/time logs/i);
  expect(heading).toBeInTheDocument();
});

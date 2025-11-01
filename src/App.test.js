import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading initially', () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading.../i);
  expect(loadingElement).toBeInTheDocument();
});

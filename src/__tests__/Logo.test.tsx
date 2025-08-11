import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import Logo from '../components/logo/logo';

// Mock the logo image import
jest.mock('src/assets/icons/logo.svg', () => 'mocked-logo-path');

// Create a test theme
const theme = createTheme();

// Wrapper component to provide necessary context
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </ThemeProvider>
);

describe('Logo Component', () => {
  it('renders logo image correctly', () => {
    render(
      <TestWrapper>
        <Logo />
      </TestWrapper>
    );

    const logoImage = screen.getByRole('img');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'mocked-logo-path');
  });

  it('renders with correct dimensions', () => {
    render(
      <TestWrapper>
        <Logo />
      </TestWrapper>
    );

    const logoImage = screen.getByRole('img');
    expect(logoImage).toHaveStyle({
      width: '40px',
      height: '40px',
    });
  });

  it('renders as a link when disabledLink is false', () => {
    render(
      <TestWrapper>
        <Logo />
      </TestWrapper>
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders without link when disabledLink is true', () => {
    render(
      <TestWrapper>
        <Logo disabledLink />
      </TestWrapper>
    );

    const logoImage = screen.getByRole('img');
    expect(logoImage).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('applies custom styles when provided', () => {
    const customStyle = { width: 100, height: 100 };
    render(
      <TestWrapper>
        <Logo sx={customStyle} />
      </TestWrapper>
    );

    const logoImage = screen.getByRole('img');
    expect(logoImage).toHaveStyle({
      width: '100px',
      height: '100px',
    });
  });
}); 
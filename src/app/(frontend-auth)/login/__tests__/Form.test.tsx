import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../Form';
import { signIn } from 'next-auth/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next.js Image stub';
  },
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockReturnValue(null),
  }),
}));


describe('Login Form', () => {
  it('calls signIn with the expected credentials when the form is submitted', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true });

    render(<Form />);

    await userEvent.type(screen.getByLabelText(/email/i), "example@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "some_password");
    await userEvent.click(screen.getByTestId('credentials-signin'));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: "example@example.com",
        password: "some_password",
        redirect: false,
      });
    }, { timeout: 1000 });
  });
});

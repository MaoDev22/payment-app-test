import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import apiClient from 'utils/axios';
import store from 'store';
import router from 'Router';

jest.mock('utils/axios');

test('Payment flow - validate without logging in', async () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', amount: 2490000 },
    { id: 2, name: 'Product 2', amount: 2490000 },
    { id: 3, name: 'Product 3', amount: 2490000 }
  ];

  const mockLogin = {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmxvbkBnbWFpbC5jb20iLCJzdWIiOjE1LCJpYXQiOjE3MjU2MjUzMDEsImV4cCI6MTcyNTYyODkwMX0.5qGUCr1oNyd_0qthWaRPdX36ZMjjn1b2d2OSgX_gtRQ'
  };

  apiClient.post.mockImplementation((path) => {
    switch (path) {
      case '/products/filter-products':
        return Promise.resolve({ data: mockProducts });
      case '/users/login':
        return Promise.resolve({ data: mockLogin });
      case '/auth/validate-token':
        return Promise.resolve({ data: { message: 'The token is valid' } });
      case '/transactions':
        return Promise.resolve({ data: { message: 'Transaction requested successfully' } });
      default:
        return Promise.reject(new Error('Unknown path'));
    }
  });

  await act(async () => {
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  });

  const linkElement = await screen.findByText(/PayApp/i);
  expect(linkElement).toBeInTheDocument();

  expect(apiClient.post).toHaveBeenCalledWith('/products/filter-products', { searchText: '' });

  const buttons = await screen.findAllByText(/Añadir al carrito/i);
  expect(buttons.length).toBeGreaterThanOrEqual(3);

  buttons.slice(0, 2).forEach(button => fireEvent.click(button));

  const textContainer = await screen.findByTestId('counter-cart');
  expect(textContainer.textContent).toBe('2');

  const cartButton = screen.getByTestId('shoping-cart-button');
  fireEvent.click(cartButton);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/shoping-cart');
  });

  const product1 = await screen.findByText(/Product 1/i);
  const product2 = await screen.findByText(/Product 2/i);
  const product3 = await screen.queryByText(/Product 3/i);

  expect(product1).toBeInTheDocument();
  expect(product2).toBeInTheDocument();
  expect(product3).not.toBeInTheDocument();

  const openModalButton = await screen.findByTestId('open-modal-button');
  fireEvent.click(openModalButton);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/login');
  });

  await act(() => {
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'marlon@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'semeolvido' } });
  });

  fireEvent.click(screen.getByTestId('login-button'));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/shoping-cart');
  });

  const openPaymentModalButton = await screen.findByTestId('open-modal-button');
  fireEvent.click(openPaymentModalButton);

  await waitFor(() => {
    expect(window.location.pathname).toBe('/shoping-cart');
  });

  const modalPaymentText = await screen.findByText(/Digite los datos de su tarjeta/i);
  expect(modalPaymentText).toBeInTheDocument();

  await act(() => {
    fireEvent.change(screen.getByLabelText(/Número de tarjeta/i), { target: { value: '4111 1111 1111 1111' } });
    fireEvent.change(screen.getByLabelText(/Fecha de expiración/i), { target: { value: '2044-11' } });
    fireEvent.change(screen.getByLabelText(/CVV/i), { target: { value: 123 } });
    fireEvent.change(screen.getByLabelText(/Dirección de entrega/i), { target: { value: '1234 Elm Street, Springfield, IL 62704' } });
  });

  const paymentButton = screen.getByTestId('payment-button');
  expect(paymentButton).toBeInTheDocument();

  fireEvent.click(paymentButton);
});

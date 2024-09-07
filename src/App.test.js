import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';

import apiClient from 'utils/axios';
import store from 'store';
import App from 'App';

jest.mock('utils/axios');

test('Render App', async () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', amount: 2490000 },
    { id: 2, name: 'Product 2', amount: 2490000 },
    { id: 3, name: 'Product 3', amount: 2490000 }
  ];
  apiClient.post.mockResolvedValue({ data: mockProducts });

  await act(async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  const linkElement = screen.getByText(/PayApp/i);
  expect(linkElement).toBeInTheDocument();
})

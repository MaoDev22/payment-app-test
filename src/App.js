import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import AOSProvider from 'components/common/AOSProvider';
import store from 'store';
import router from 'Router';

function App() {

  return (
    <Provider store={store}>
      <AOSProvider>
        <RouterProvider router={router} />
      </AOSProvider>
    </Provider>
  );
}

export default App;

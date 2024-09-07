import apiClient from 'utils/axios';
import store, { setAuthToken } from 'store';
import router from 'Router';

jest.mock('store');
jest.mock('Router', () => ({
  navigate: jest.fn(),
}));

describe('apiClient', () => {
  const mockToken = 'mock-token';
  const mockState = { token: mockToken };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Request interceptor', () => {
    it('should add Authorization header if token exists', async () => {
      store.getState.mockReturnValue(mockState);

      const mockRequest = {
        headers: {},
      };

      const result = await apiClient.interceptors.request.handlers[0].fulfilled(mockRequest);

      expect(result.headers['Authorization']).toBe(`Bearer ${mockToken}`);
    });

    it('should not add Authorization header if no token exists', async () => {
      store.getState.mockReturnValue({ token: null });

      const mockRequest = {
        headers: {},
      };

      const result = await apiClient.interceptors.request.handlers[0].fulfilled(mockRequest);

      expect(result.headers['Authorization']).toBeUndefined();
    });

    it('should reject the request if an error occurs', async () => {
      const mockError = new Error('Request error');
      const requestReject = apiClient.interceptors.request.handlers[0].rejected;

      await expect(requestReject(mockError)).rejects.toThrow('Request error');
    });
  });

  describe('Response interceptor', () => {
    it('should return the response if successful', async () => {
      const mockResponse = { data: 'mock data' };
      const result = await apiClient.interceptors.response.handlers[0].fulfilled(mockResponse);

      expect(result).toBe(mockResponse);
    });

    it('should handle 401 errors and redirect to login if token validation fails', async () => {
        const mockError = {
          response: {
            status: 401,
            data: { path: '/auth/validate-token' },
          },
        };
  
        const dispatchMock = jest.fn();
        store.dispatch = dispatchMock;
  
        const responseReject = apiClient.interceptors.response.handlers[0].rejected;
        
        await expect(responseReject(mockError)).rejects.toMatchObject(mockError);
  
        expect(dispatchMock).toHaveBeenCalledWith(setAuthToken(null));
        expect(router.navigate).toHaveBeenCalledWith('/login');
    });

    it('should reject other errors without redirecting', async () => {
        const mockError = {
          response: {
            status: 404,
            data: { message: 'Not found' },
          },
        };
  
        const responseReject = apiClient.interceptors.response.handlers[0].rejected;

        await expect(responseReject(mockError)).rejects.toMatchObject(mockError);
  
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should reject the response if no error response is present', async () => {
        const mockError = new Error('Network error');
        const responseReject = apiClient.interceptors.response.handlers[0].rejected;
  
        await expect(responseReject(mockError)).rejects.toEqual(mockError);
        expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});

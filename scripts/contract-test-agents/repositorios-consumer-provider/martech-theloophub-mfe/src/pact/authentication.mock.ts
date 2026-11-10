export const useAuthenticationService = () => ({
  getUserCountryAndLanguage: () => ({ user_country: '' }),
  enhancedAxios: jest.fn(),
});

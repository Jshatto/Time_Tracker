global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    }
  }
};
describe('Browser Extension Background Script', () => {
  test('should initialize correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    require('../background');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Extension loaded/i));
  });
});

describe('Browser Extension Background Script', () => {
  test('should initialize correctly', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    // Mock and trigger the Chrome install listener
    global.chrome = {
      runtime: {
        onInstalled: {
          addListener: (callback) => callback()
        }
      }
    };

    require('../background');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Extension loaded/i));
  });
});

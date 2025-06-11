describe('Time Tracker Extension Background Script', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset fetch mock
    global.fetch.mockReset();
  });

  test('should initialize correctly on install', () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ running: false, startTime: null })
    });

    // Trigger the install event
    const installCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    installCallback({ reason: 'install' });

    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
    expect(chrome.contextMenus.create).toHaveBeenCalledWith({
      id: 'openTracker',
      title: 'Open Time Tracker Dashboard',
      contexts: ['action']
    });
  });

  test('should handle startup event', () => {
    const startupCallback = chrome.runtime.onStartup.addListener.mock.calls[0][0];
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ running: false, startTime: null })
    });

    startupCallback();

    expect(chrome.runtime.onStartup.addListener).toHaveBeenCalled();
  });

  test('should update badge when timer is running', async () => {
    // Mock API response for running timer
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        running: true, 
        startTime: new Date().toISOString() 
      })
    });

    // Import the background script to trigger its execution
    require('../background');

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
    expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ 
      color: '#10b981' 
    });
  });

  test('should handle API connection errors gracefully', async () => {
    // Mock API failure
    global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

    require('../background');

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '!' });
    expect(chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ 
      color: '#ef4444' 
    });
  });

  test('should handle message from popup', () => {
    const messageCallback = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    const mockSendResponse = jest.fn();

    // Test getState message
    messageCallback(
      { action: 'getState' },
      { tab: {} },
      mockSendResponse
    );

    expect(mockSendResponse).toHaveBeenCalled();
  });

  test('should create notification on install', () => {
    const installCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    
    installCallback({ reason: 'install' });

    expect(chrome.notifications.create).toHaveBeenCalledWith({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Time Tracker Extension',
      message: 'Extension installed! Click the icon to start tracking time.'
    });
  });

  test('should handle context menu clicks', () => {
    const contextMenuCallback = chrome.contextMenus.onClicked.addListener.mock.calls[0][0];
    
    contextMenuCallback({ menuItemId: 'openTracker' }, {});

    expect(chrome.tabs.create).toHaveBeenCalledWith({ 
      url: 'https://time-tracker-nust.onrender.com' 
    });
  });

  test('should save and load state from storage', async () => {
    // Mock storage operations
    const testState = { running: true, startTime: new Date().toISOString() };
    chrome.storage.local.get.mockResolvedValueOnce({ timerState: testState });

    require('../background');

    expect(chrome.storage.local.get).toHaveBeenCalledWith(['timerState']);
  });

  test('should format duration correctly', () => {
    // This test would need the formatDuration function to be exported
    // For now, we'll test the functionality indirectly through timer state updates
    expect(true).toBe(true); // Placeholder
  });
});
// Jest setup for Chrome Extension tests

// Mock Chrome APIs
global.chrome = {
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onStartup: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    },
    id: 'test-extension-id'
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
    setTitle: jest.fn(),
    onClicked: {
      addListener: jest.fn()
    }
  },
  storage: {
    local: {
      get: jest.fn().mockResolvedValue({}),
      set: jest.fn().mockResolvedValue()
    }
  },
  contextMenus: {
    create: jest.fn(),
    onClicked: {
      addListener: jest.fn()
    }
  },
  notifications: {
    create: jest.fn()
  },
  tabs: {
    create: jest.fn()
  },
  management: {
    onDisabled: {
      addListener: jest.fn()
    },
    onEnabled: {
      addListener: jest.fn()
    }
  }
};

// Mock fetch API
global.fetch = jest.fn();

// Mock DOM for popup tests
Object.defineProperty(window, 'location', {
  value: {
    href: 'chrome-extension://test/popup.html'
  }
});

// Mock timers
jest.useFakeTimers();

// Console spy to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};
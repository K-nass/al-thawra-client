export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const DEFAULT_VOLUME = 0.8;
export const DEFAULT_PLAYBACK_RATE = 1;

export const CONTROLS_HIDE_DELAY = 3000;
export const CONTROLS_FADE_DURATION = 300;

export const SEEK_STEP = 10;
export const VOLUME_STEP = 0.1;

// Performance optimization constants
export const TIMEUPDATE_THROTTLE = 60; // ~16fps, smooth enough for time display
export const PROGRESS_THROTTLE = 500; // Update buffered progress every 500ms
export const HOVER_DEBOUNCE = 100; // Debounce hover preview calculations
export const VOLUME_DEBOUNCE = 50; // Debounce volume change callbacks
export const MOUSEMOVE_THROTTLE = 100; // Throttle mouse move for controls visibility


export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: [' ', 'k'],
  MUTE: ['m'],
  FULLSCREEN: ['f'],
  THEATER_MODE: ['t'],
  PICTURE_IN_PICTURE: ['i'],
  SEEK_FORWARD: ['ArrowRight', 'l'],
  SEEK_BACKWARD: ['ArrowLeft', 'j'],
  VOLUME_UP: ['ArrowUp'],
  VOLUME_DOWN: ['ArrowDown'],
  SPEED_UP: ['>'],
  SPEED_DOWN: ['<'],
  RESTART: ['0'],
  SEEK_10: ['1'],
  SEEK_20: ['2'],
  SEEK_30: ['3'],
  SEEK_40: ['4'],
  SEEK_50: ['5'],
  SEEK_60: ['6'],
  SEEK_70: ['7'],
  SEEK_80: ['8'],
  SEEK_90: ['9'],
} as const;

export const ERROR_MESSAGES = {
  ABORTED: 'تم إلغاء تحميل الفيديو',
  NETWORK: 'فشل تحميل الفيديو بسبب خطأ في الشبكة',
  DECODE: 'فشل فك تشفير الفيديو',
  SRC_NOT_SUPPORTED: 'تنسيق الفيديو غير مدعوم',
  UNKNOWN: 'حدث خطأ غير معروف',
} as const;

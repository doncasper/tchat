import type { ChatConfig } from '../../types/config';

export class QueryParamService {
  private static readonly PARAM_MAPPING: Record<string, keyof ChatConfig> = {
    ch: 'channel',
    ts: 'textSize',
    t: 'theme',
    h: 'showHeader',
    mm: 'maxMessages',
    md: 'messageDuration',
    bg: 'enableBackground',
    s: 'scale',
    r: 'radius',
    ms: 'enableMessageShadow',
    ets: 'enableTextShadow',
    ml: 'messageLayout',
    nl: 'notificationLayout',
    sound: 'enableSound',
    anim: 'enableAnimations',
    scroll: 'autoScroll',
    time: 'showTimestamps',
    badges: 'showBadges',
    emotes: 'showEmotes'
  };

  static parseQueryParams(): Partial<ChatConfig> {
    const urlParams = new URLSearchParams(window.location.search);
    const config: Partial<ChatConfig> = {};

    for (const [shortParam, fullParam] of Object.entries(this.PARAM_MAPPING)) {
      const value = urlParams.get(shortParam);
      if (value !== null) {
        config[fullParam] = this.parseValue(fullParam, value);
      }
    }

    return config;
  }

  static updateQueryParams(config: Partial<ChatConfig>): void {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    for (const [fullParam, value] of Object.entries(config)) {
      const shortParam = Object.keys(this.PARAM_MAPPING).find(
        key => this.PARAM_MAPPING[key] === fullParam
      );
      if (shortParam && value !== undefined) {
        params.set(shortParam, this.stringifyValue(fullParam as keyof ChatConfig, value));
      }
    }

    window.history.replaceState({}, '', url.toString());
  }

  private static parseValue(param: keyof ChatConfig, value: string): any {
    switch (param) {
      case 'textSize':
      case 'maxMessages':
      case 'messageDuration':
      case 'scale':
      case 'radius':
        return parseInt(value, 10);
      case 'showHeader':
      case 'enableBackground':
      case 'enableMessageShadow':
      case 'enableTextShadow':
      case 'enableSound':
      case 'enableAnimations':
      case 'autoScroll':
      case 'showTimestamps':
      case 'showBadges':
      case 'showEmotes':
        return value === '1';
      default:
        return value;
    }
  }

  private static stringifyValue(_: keyof ChatConfig, value: any): string {
    if (typeof value === 'boolean') {
      return value ? '1' : '0';
    }
    return String(value);
  }
} 
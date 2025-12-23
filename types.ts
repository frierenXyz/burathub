export enum SystemStep {
  WELCOME = 0,
  CHECKPOINT_1 = 1,
  CHECKPOINT_2 = 2,
  KEY_GENERATED = 3
}

export interface CheckpointConfig {
  id: number;
  title: string;
  description: string;
  targetUrl: string;
  waitDurationSeconds: number;
}

export interface KeyData {
  value: string;
  generatedAt: number;
  expiresAt: number;
}

export interface AppConfig {
  appName: string;
  keyPrefix: string;
  keyExpiryHours: number;
  checkpoints: CheckpointConfig[];
  luaScript: string;
}

export type AdminView = 'login' | 'dashboard';
export type DashboardTab = 'overview' | 'integration' | 'provider' | 'lua';
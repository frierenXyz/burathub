import { CheckpointConfig } from './types';

// In a real scenario, these URLs would be your ad-link provider or sponsor pages
export const CHECKPOINTS: CheckpointConfig[] = [
  {
    id: 1,
    title: "Checkpoint 1: Sponsor Validation",
    description: "Visit our partner site to proceed. Wait 5 seconds after the page loads to verify your session.",
    targetUrl: "https://example.com/sponsor-1", // Replace with real link
    waitDurationSeconds: 5
  },
  {
    id: 2,
    title: "Checkpoint 2: Final Verification",
    description: "Complete the final step by visiting the second partner link. Your key will be generated immediately after.",
    targetUrl: "https://example.com/sponsor-2", // Replace with real link
    waitDurationSeconds: 8
  }
];

export const APP_NAME = "BURAT HUB";
export const KEY_PREFIX = "BURAT-";
export const KEY_EXPIRY_HOURS = 10;
export const ADMIN_ACCESS_KEY = "admin123"; // CHANGE THIS to set your admin password
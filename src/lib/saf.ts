import { registerPlugin } from '@capacitor/core';

export interface SafPlugin {
  pickDirectory(): Promise<{ uri: string; name: string }>;
  listFiles(options: { uri: string }): Promise<{ files: any[] }>;
  readFile(options: { uri: string }): Promise<{ data: string }>;
  writeFile(options: { uri: string; data: string }): Promise<void>;
}

export const Saf = registerPlugin<SafPlugin>('Saf');

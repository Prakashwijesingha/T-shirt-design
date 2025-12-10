export type ShirtType = 'polo' | 'crew';
export type Gender = 'male' | 'female';

export interface ShirtConfig {
  type: ShirtType;
  baseColor: string;
  sleeveColor: string;
  collarColor: string; // Used for Polo collar or Crew neck rib
  buttonColor: string; // Button color for Polos
  collarSize: number;  // Scale factor for collar/rib
  logoUrl: string | null;
  logoScale: number;
  // Accents
  tippingLines: number;       // 0 = None, 1 = Single, 2 = Double, 3 = Triple
  enableChestStripe: boolean; // Stripe across chest (below collar)
  accentColor: string;        // Color for these stripes
}

export const DEFAULT_CONFIG: ShirtConfig = {
  type: 'polo',
  baseColor: '#1e293b',
  sleeveColor: '#1e293b',
  collarColor: '#ef4444',
  buttonColor: '#ffffff',
  collarSize: 1.0,
  logoUrl: null,
  logoScale: 1,
  tippingLines: 0,
  enableChestStripe: false,
  accentColor: '#ffffff',
};

export const COLORS = [
  '#ffffff', '#000000', '#1e293b', '#334155', 
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#d946ef', '#f43f5e', '#78350f'
];
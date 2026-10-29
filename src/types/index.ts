export type RescueCategory = "Bakery" | "Produce" | "Prepared meals";
export type RescueFilter = "All rescues" | RescueCategory;
export type ContactRole = "restaurant" | "shelter" | "volunteer";

export interface Rescue {
  id: string;
  restaurant: string;
  type: string;
  category: RescueCategory;
  items: string[];
  quantity: number;
  unit: string;
  pickupWindow: string;
  distance: string;
  address: string;
  dietary: string;
  urgent?: boolean;
}

export interface Metric {
  value: number;
  label: string;
  suffix?: string;
  decimals?: number;
}

export interface Testimonial {
  initials: string;
  name: string;
  role: string;
  quote: string;
  color: string;
}

export interface SceneSettings {
  mobile: boolean;
  reducedMotion: boolean;
}

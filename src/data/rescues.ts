import type { Metric, Rescue, RescueFilter, Testimonial } from "@/types";

/** Illustrative fixtures, not a connected inventory or real-time service. */
export const rescues: Rescue[] = [
  {
    id: "green-bowl",
    restaurant: "Green Bowl Kitchen",
    type: "Farm-to-table restaurant",
    category: "Prepared meals",
    items: ["Harvest grain bowls", "Roasted vegetable soup"],
    quantity: 24,
    unit: "servings",
    pickupWindow: "Today, 5:00–6:00 PM",
    distance: "0.4 mi away",
    address: "18 Market Street · Demo location",
    dietary: "Vegetarian · Contains grains",
    urgent: true,
  },
  {
    id: "sunrise-bakery",
    restaurant: "Sunrise Bakery",
    type: "Neighborhood bakery",
    category: "Bakery",
    items: ["Sourdough loaves", "Whole-grain rolls"],
    quantity: 18,
    unit: "boxes",
    pickupWindow: "Today, 6:00–7:00 PM",
    distance: "0.7 mi away",
    address: "42 Willow Avenue · Demo location",
    dietary: "Contains wheat · Ask about allergens",
  },
  {
    id: "neighborhood-grocer",
    restaurant: "Neighborhood Grocer",
    type: "Independent grocery store",
    category: "Produce",
    items: ["Seasonal apples", "Leafy greens", "Root vegetables"],
    quantity: 32,
    unit: "bags",
    pickupWindow: "Today, 4:30–5:30 PM",
    distance: "1.1 mi away",
    address: "65 Oak Lane · Demo location",
    dietary: "Fresh produce · Unprepared",
    urgent: true,
  },
  {
    id: "little-basil",
    restaurant: "Little Basil Trattoria",
    type: "Family-run Italian kitchen",
    category: "Prepared meals",
    items: ["Garden pasta", "Tomato & lentil soup"],
    quantity: 16,
    unit: "servings",
    pickupWindow: "Today, 7:00–8:00 PM",
    distance: "1.3 mi away",
    address: "9 Garden Road · Demo location",
    dietary: "Vegetarian · Contains wheat",
  },
  {
    id: "daily-bread",
    restaurant: "Daily Bread Café",
    type: "Coffee shop & café",
    category: "Bakery",
    items: ["Breakfast pastries", "Seed crackers"],
    quantity: 20,
    unit: "portions",
    pickupWindow: "Today, 5:30–6:30 PM",
    distance: "1.6 mi away",
    address: "31 Station Street · Demo location",
    dietary: "Mixed selection · Contains nuts and wheat",
  },
  {
    id: "farmstand",
    restaurant: "Farmstand Collective",
    type: "Local farmers’ market",
    category: "Produce",
    items: ["Orchard fruit", "Seasonal vegetable boxes"],
    quantity: 15,
    unit: "crates",
    pickupWindow: "Tomorrow, 9:00–10:00 AM",
    distance: "2.0 mi away",
    address: "80 Riverside Walk · Demo location",
    dietary: "Fresh produce · Unprepared",
  },
];

export const rescueFilters: RescueFilter[] = [
  "All rescues",
  "Prepared meals",
  "Bakery",
  "Produce",
];

export const heroMetrics: Metric[] = [
  { value: 12400, suffix: "+", label: "Meals rescued" },
  { value: 38, label: "Partner kitchens" },
  { value: 24, label: "Community shelters" },
  { value: 92, suffix: "%", label: "On-time pickups" },
];

export const impactMetrics: Metric[] = [
  { value: 12400, suffix: "+", label: "Meals shared, not wasted" },
  { value: 38, label: "Restaurants making a difference" },
  { value: 24, label: "Shelters in our demo network" },
  { value: 6.2, decimals: 1, label: "Tonnes of food kept in circulation" },
];

export const monthlyMeals = [
  { month: "May", meals: 1200 },
  { month: "Jun", meals: 1600 },
  { month: "Jul", meals: 1800 },
  { month: "Aug", meals: 2100 },
  { month: "Sep", meals: 2600 },
  { month: "Oct", meals: 3100 },
];

export const testimonials: Testimonial[] = [
  {
    initials: "AM",
    name: "Alex Morgan",
    role: "Restaurant partner",
    quote:
      "The food we put our hearts into now goes to people who need it. That feels like a much better ending than the bin.",
    color: "bg-primary",
  },
  {
    initials: "SR",
    name: "Sam Rivera",
    role: "Shelter coordinator",
    quote:
      "A reliable pickup means one less thing to worry about, and one more fresh meal on the table for our community.",
    color: "bg-sage/25",
  },
  {
    initials: "JP",
    name: "Jordan Patel",
    role: "Community volunteer",
    quote:
      "It’s a small trip across the neighborhood that makes a surprisingly big difference. Good food really does bring people together.",
    color: "bg-coral/20",
  },
];

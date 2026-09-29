export interface CoffeeAddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'signature' | 'cold' | 'classic' | 'special';
  image: string;
  isPopular?: boolean;
  calories?: string;
  tags?: string[];
  isInStock?: boolean;
  discountPercent?: number;
  addOns?: CoffeeAddOn[];
}

export const COLD_COFFEE_ADDONS: CoffeeAddOn[] = [
  { id: 'oreo-chunks', name: 'OREO CHUNKS', price: 20 },
  { id: 'caramel-syrup', name: 'CARAMEL SYRUP', price: 50 },
  { id: 'chocolate-syrup', name: 'CHOCOLATE SYRUP', price: 50 },
  { id: 'whipping-cream', name: 'WHIPPING CREAM', price: 50 },
  { id: 'chocochips', name: 'CHOCOLATE CHIPS', price: 20 },
  { id: 'sprinkles', name: 'SPRINKLES', price: 20 },
  { id: 'davidoff-strong-coffee', name: 'DAVIDOFF STRONG COFFEE', price: 70 },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'loaded-oreo',
    name: 'LOADED OREO',
    description: 'Dreamy, creamy and absolutely irresistible.',
    price: 650,
    currency: 'Rs.',
    category: 'special',
    image: '/images/loaded_oreo.png',
    isPopular: true,
    calories: '480 kcal',
    tags: ['Crushed Oreo', 'Whipped Cream', 'Chocolate Drizzle'],
    addOns: COLD_COFFEE_ADDONS
  },
  {
    id: 'vanilla-velvet',
    name: 'VANILLA VELVET',
    description: 'Smooth vanilla, pure comfort in a cup.',
    price: 599,
    currency: 'Rs.',
    category: 'signature',
    image: '/images/vanilla_velvet.png',
    isPopular: true,
    calories: '320 kcal',
    tags: ['Smooth Vanilla', 'Whipped Cream', 'Caramel Swirl'],
    addOns: COLD_COFFEE_ADDONS
  },
  {
    id: 'original-brew',
    name: 'THE ORIGINAL BREW',
    description: 'Pure coffee. Nothing else.',
    price: 350,
    currency: 'Rs.',
    category: 'classic',
    image: '/images/original_brew.png',
    calories: '15 kcal',
    tags: ['100% Arabica', 'Pure Espresso', 'Iced'],
    addOns: COLD_COFFEE_ADDONS
  },
  {
    id: 'midnight-mocha',
    name: 'MIDNIGHT MOCHA',
    description: 'Rich chocolate. Bold coffee. Pure indulgence.',
    price: 350,
    currency: 'Rs.',
    category: 'classic',
    image: '/images/midnight_mocha.png',
    isPopular: true,
    calories: '310 kcal',
    tags: ['Rich Chocolate', 'Bold Espresso', 'Cocoa Chunks'],
    addOns: COLD_COFFEE_ADDONS
  },
  {
    id: 'spanish-sunset',
    name: 'SPANISH SUNSET',
    description: 'A perfect blend of coffee, caramel and warmth.',
    price: 399,
    currency: 'Rs.',
    category: 'cold',
    image: '/images/spanish_sunset.png',
    calories: '280 kcal',
    tags: ['Spanish Latte', 'Caramel Drizzle', 'Layered'],
    addOns: COLD_COFFEE_ADDONS
  },
  {
    id: 'golden-caramel-bliss',
    name: 'GOLDEN CARAMEL BLISS',
    description: 'Sweet caramel. Smooth coffee. Total bliss.',
    price: 400,
    currency: 'Rs.',
    category: 'signature',
    image: '/images/golden_caramel_bliss.png',
    isPopular: true,
    calories: '330 kcal',
    tags: ['Sweet Caramel', 'Smooth Espresso', 'Caramel Crunch'],
    addOns: COLD_COFFEE_ADDONS
  },
  {
    id: 'bussin-signature',
    name: 'THE BUSSIN SIGNATURE',
    description: 'A signature taste, uniquely yours.',
    price: 550,
    currency: 'Rs.',
    category: 'signature',
    image: '/images/bussin_signature.png',
    calories: '390 kcal',
    tags: ['House Special', 'Triple Shot', 'Signature Crown'],
    addOns: COLD_COFFEE_ADDONS
  }
];

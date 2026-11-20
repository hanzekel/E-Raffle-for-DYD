// Central registry of DYD 2026 raffle prizes, display details, and optional asset/shop links

export interface PrizeItem {
  id: 'powerbank' | 'turbo-fan' | 'tumbler' | 'starbucks-gc' | 'earbuds' | 'merch';
  tier: 'major' | 'minor';
  rankLabel: string;
  name: string;
  brandOrType: string;
  description: string;
  // Drop a photo inside frontend/public/prizes/ and set e.g. '/prizes/powerbank.png'
  imageSrc?: string;
  // Paste Shopee or TikTok Shop URL here when finalized
  shopUrl?: string;
  shopLabel?: string;
}

export const RAFFLE_PRIZES: PrizeItem[] = [
  {
    id: 'powerbank',
    tier: 'major',
    rankLabel: '1st Prize • Major',
    name: 'Powerbank',
    brandOrType: 'Orashare / Romoss',
    description: 'High-capacity fast-charging powerbank to keep your devices powered all camp long.',
    imageSrc: '/prizes/powerbank.jpg',
  },
  {
    id: 'turbo-fan',
    tier: 'major',
    rankLabel: '2nd Prize • Major',
    name: 'Turbo Fan',
    brandOrType: 'Jisulife',
    description: 'Compact high-speed handheld turbo fan built for outdoor rallies and hot days.',
    imageSrc: '/prizes/turbo-fan.jpg',
  },
  {
    id: 'tumbler',
    tier: 'major',
    rankLabel: '3rd Prize • Major',
    name: 'Insulated Tumbler',
    brandOrType: 'Aquaflask',
    description: 'Durable insulated stainless steel flask to keep your drinks ice-cold all day.',
    imageSrc: '/prizes/tumbler.jpg',
  },
  {
    id: 'starbucks-gc',
    tier: 'minor',
    rankLabel: 'Minor Prize',
    name: 'Starbucks Gift Card',
    brandOrType: '₱300 Value',
    description: 'Treat yourself to your favorite handcrafted coffee or refresher.',
    imageSrc: '/prizes/starbucks-gc.jpg',
  },
  {
    id: 'earbuds',
    tier: 'minor',
    rankLabel: 'Minor Prize',
    name: 'Bluetooth Earbuds',
    brandOrType: 'Wireless Audio',
    description: 'Sleek true-wireless earbuds for music, podcasts, and daily commutes.',
    imageSrc: '/prizes/earbuds.jpg',
  },
  {
    id: 'merch',
    tier: 'minor',
    rankLabel: 'Minor Prize',
    name: 'Official DYD Merch',
    brandOrType: 'Limited Edition',
    description: 'Commemorative 40 Years in Mission youth ministry keepsake merch.',
  },
];

export const LIVE_DRAW_PRESET_PRIZES = [
  '1st Prize (Major): Powerbank (Orashare / Romoss)',
  '2nd Prize (Major): Turbo Fan (Jisulife)',
  '3rd Prize (Major): Insulated Tumbler (Aquaflask)',
  'Minor Prize: Starbucks ₱300 Gift Card',
  'Minor Prize: Bluetooth Earbuds',
  'Minor Prize: Official DYD Merch',
];

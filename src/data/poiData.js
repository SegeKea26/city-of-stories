export const POI_DATA = [
  {
    id: 'cecemel-cabin',
    position: [11, 2, -22],
    cameraPosition: [11, 2, -25],
    label: 'Cecemel Cabin',
    tourOrder: 1,
    text: 'Step into this cozy haven where the aroma of warm cecemel—a traditional Belgian hot chocolate infused with citrus—fills the crisp winter air. Here, locals and visitors alike gather to warm their hands around steaming mugs, sharing stories and laughter. The crackling fireplace and soft amber glow create the perfect sanctuary from the cold.',
    image1: 'https://images.unsplash.com/photo-1527521177846-5caa13c0daea?w=300&h=150&fit=crop',
    image2: 'https://images.unsplash.com/photo-1449244908441-8829872d2607?w=300&h=150&fit=crop',
    nextId: 'luna-park',
    prevId: 'winterfest'
  },
  {
    id: 'luna-park',
    position: [-13.5, 2, 12],
    cameraPosition: [-13.5, 2, 10],
    label: 'Luna Park',
    tourOrder: 2,
    text: 'Welcome to the enchanted heart of the winter festival, where laughter echoes across the snowy grounds. Vintage-style carousel horses spin beneath glittering lights, while roller coasters twist through the crisp night air. The sweet scents of roasted chestnuts and hot cider drift through the fairgrounds, creating a magical atmosphere where families and friends create unforgettable winter memories.',
    image1: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=300&h=150&fit=crop',
    image2: 'https://images.unsplash.com/photo-1551632786-de41eccf9017?w=300&h=150&fit=crop',
    nextId: 'red-cabin',
    prevId: 'cecemel-cabin'
  },
  {
    id: 'red-cabin',
    position: [-30, 2, -4],
    cameraPosition: [-27, 2, -4],
    label: 'Red Cabin',
    tourOrder: 3,
    text: 'A striking beacon of warmth painted in vibrant scarlet, this cabin stands out against the winter landscape like a jewel. Inside, blankets and cushions invite you to settle by the fire, where hot mulled wine and freshly baked treats await. It\'s a cherished refuge where the cold outside only makes the warmth within feel more precious.',
    image1: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=150&fit=crop',
    image2: 'https://images.unsplash.com/photo-1494414278900-3a5b27e0dae8?w=300&h=150&fit=crop',
    nextId: 'fishing-game',
    prevId: 'luna-park'
  },
  {
    id: 'fishing-game',
    position: [7, 2, 32],
    cameraPosition: [7, 2, 36],
    label: 'Fishing Game',
    tourOrder: 4,
    text: 'Test your skill at this beloved winter tradition where wooden poles and patient hands compete for colorful prizes. Watch as others celebrate their catches with infectious joy. Whether you succeed or not, the real treasure is the laughter shared and the festive spirit of friendly competition that fills this enchanting corner of the fairgrounds.',
    image1: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=300&h=150&fit=crop',
    image2: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=150&fit=crop',
    nextId: 'wheel-cashier',
    prevId: 'red-cabin'
  },
  {
    id: 'wheel-cashier',
    position: [0, 2, 5],
    cameraPosition: [0, 2, 12],
    label: 'Wheel Cashier',
    tourOrder: 5,
    text: 'At the beating heart of the winter fair stands this iconic booth, a gateway to adventure and wonder. Here, tickets are exchanged for dreams of spinning wheels, delightful rides, and cherished memories. The ferris wheel looms majestically beyond, a testament to the joy and magic that awaits those who venture forth into this winter wonderland.',
    image1: 'https://images.unsplash.com/photo-1540575467063-178f50002c4b?w=300&h=150&fit=crop',
    image2: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=150&fit=crop',
    nextId: 'winterfest',
    prevId: 'fishing-game',
    specialAction: 'ferrisWheel'
  }
];

export const WINTERFEST_HOME = {
  id: 'winterfest',
  label: 'ghent winterfest',
  text: 'Welcome to Ghent Winterfest, where winter magic comes to life. Step into a world of twinkling lights, festive traditions, and shared warmth. Explore iconic locations, from cozy cabins to thrilling rides, and discover the enchanting stories that make this season unforgettable. Begin your journey now.',
  image1: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=150&fit=crop',
  image2: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=150&fit=crop',
  buttonLabel: 'start virtual tour'
};

export const getPOIById = (id) => {
  return POI_DATA.find(poi => poi.id === id);
};

export const getPOIIndex = (id) => {
  return POI_DATA.findIndex(poi => poi.id === id);
};

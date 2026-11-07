// All copy and media for the site lives here so sections stay presentational.

const img = (name) => `/images/${name}.webp`

export const BRAND = {
  name: 'The Art of Coffee',
  short: 'AOC',
  tagline: 'Specialty roastery & café — est. 2014',
}

export const NAV_LINKS = [
  { label: 'Anatomy', href: '#anatomy' },
  { label: 'Journey', href: '#journey' },
  { label: 'Menu', href: '#menu' },
  { label: 'Story', href: '#story' },
  { label: 'Visit', href: '#visit' },
]

export const HERO = {
  background: img('hero-beans'),
}

/* Exploded cup — order matches the 3D layers top → bottom */
export const LAYERS = [
  {
    key: 'lid',
    name: 'Crystal Dome Lid',
    short: 'Lid',
    spec: 'rPET · 100% recyclable',
    text: 'A clear dome that seals in aroma and leaves room for the crown of cream beneath it.',
  },
  {
    key: 'cream',
    name: 'Vanilla Chantilly',
    short: 'Whipped cream',
    spec: '35% cream · Madagascar vanilla',
    text: 'Hand-whipped cream infused with vanilla bean, finished with a ribbon of salted caramel.',
  },
  {
    key: 'foam',
    name: 'Cold Foam Cloud',
    short: 'Foam',
    spec: '−2°C · 40 ml',
    text: 'Micro-textured cold foam that slowly melts into the espresso, softening every sip.',
  },
  {
    key: 'espresso',
    name: 'Double Ristretto',
    short: 'Espresso',
    spec: '18 g in · 36 g out · 27 s',
    text: 'Two short shots of our Huila single origin: syrupy, dark chocolate, a cherry finish.',
  },
  {
    key: 'ice',
    name: 'Clear-Cut Ice',
    short: 'Ice',
    spec: 'Filtered · 48 h slow freeze',
    text: 'Slow-frozen, crystal-clear cubes that chill without diluting the character of the cup.',
  },
  {
    key: 'milk',
    name: 'High-Pasture Milk',
    short: 'Milk',
    spec: '3.8% fat · 4°C',
    text: 'Fresh whole milk, rich and naturally sweet, lightly marbled where the espresso falls.',
  },
  {
    key: 'body',
    name: 'Double-Wall Glass',
    short: 'Cup body',
    spec: '16 oz · kraft sleeve',
    text: 'A tapered glass vessel wrapped in a hand-printed sleeve, built to show every layer.',
  },
  {
    key: 'base',
    name: 'Weighted Amber Base',
    short: 'Base',
    spec: 'Tempered · 180 g',
    text: 'A heavy amber-tinted foot that keeps the cup grounded and the ritual steady.',
  },
]

export const JOURNEY = [
  {
    no: '01',
    title: 'Origin',
    meta: 'Huila, Colombia · 1,850 m',
    text: 'High-altitude farms where cool nights and volcanic soil slow the cherry’s ripening and deepen its sweetness.',
    image: img('origin'),
  },
  {
    no: '02',
    title: 'Harvest',
    meta: 'Hand-picked · Selective',
    text: 'Only perfectly ripe cherries are picked by hand, pass after pass, then dried on raised beds for twenty days.',
    image: img('harvest'),
  },
  {
    no: '03',
    title: 'Roasting',
    meta: 'Small batch · 12 kg drum',
    text: 'Roasted by ear, eye and data, developed just long enough to reveal sugar and never char.',
    image: img('roasting'),
  },
  {
    no: '04',
    title: 'Grinding',
    meta: 'Steel burrs · On demand',
    text: 'Ground seconds before brewing for a uniform particle and a clean, even extraction.',
    image: img('grinding'),
  },
  {
    no: '05',
    title: 'Extraction',
    meta: '93°C · 27 seconds',
    text: 'Water meets coffee at exactly ninety-three degrees. Pressure, time and ratio, measured for every cup.',
    image: img('extraction'),
  },
  {
    no: '06',
    title: 'The Cup',
    meta: 'Served · Savoured',
    text: 'The moment it all comes together: aroma, warmth, and a quiet minute that belongs only to you.',
    image: img('experience'),
  },
]

export const MENU = [
  {
    name: 'Espresso',
    price: 3.8,
    size: '60 ml',
    temp: 'Hot',
    text: 'A double ristretto of our seasonal single origin. Dense, syrupy and bittersweet.',
    notes: ['Dark cocoa', 'Cherry', 'Molasses'],
    image: img('espresso'),
  },
  {
    name: 'Americano',
    price: 4.2,
    size: '240 ml',
    temp: 'Hot',
    text: 'Espresso lengthened with hot filtered water, for clarity and a long, clean finish.',
    notes: ['Cedar', 'Brown sugar', 'Citrus'],
    image: img('americano'),
  },
  {
    name: 'Cappuccino',
    price: 4.9,
    size: '180 ml',
    temp: 'Hot',
    text: 'Equal thirds of espresso, steamed milk and velvet micro-foam, dusted with cacao.',
    notes: ['Hazelnut', 'Cream', 'Cacao'],
    image: img('cappuccino'),
  },
  {
    name: 'Latte',
    price: 5.2,
    size: '300 ml',
    temp: 'Hot',
    text: 'Silky steamed milk poured over a double shot and finished with our signature tulip.',
    notes: ['Caramel', 'Milk chocolate', 'Vanilla'],
    image: img('latte'),
  },
  {
    name: 'Mocha',
    price: 5.6,
    size: '300 ml',
    temp: 'Hot',
    text: 'Single-origin espresso, 70% dark chocolate ganache, steamed milk and chantilly.',
    notes: ['Ganache', 'Toffee', 'Orange zest'],
    image: img('mocha'),
  },
  {
    name: 'Caramel Macchiato',
    price: 5.8,
    size: '350 ml',
    temp: 'Iced or hot',
    text: 'Vanilla-laced milk marked with espresso and a lattice of house salted caramel.',
    notes: ['Salted caramel', 'Vanilla', 'Butter'],
    image: img('caramel-macchiato'),
  },
  {
    name: 'Iced Coffee',
    price: 5.4,
    size: '473 ml',
    temp: 'Iced',
    text: 'Our eight-layer signature: ristretto, cold foam and clear-cut ice over whole milk.',
    notes: ['Cocoa nib', 'Cream', 'Cherry'],
    image: img('iced-coffee'),
  },
  {
    name: 'Cold Brew',
    price: 5.0,
    size: '400 ml',
    temp: 'Iced',
    text: 'Steeped for eighteen hours in cold filtered water. Smooth, low in acidity, quietly bold.',
    notes: ['Dark chocolate', 'Plum', 'Black tea'],
    image: img('cold-brew'),
  },
]

export const STORY = {
  manifesto:
    'We believe coffee is not a commodity but a craft — a chain of a hundred careful hands, from the farmer at dawn to the barista who pours your cup. Our work is simply to honour every one of them.',
  images: {
    tall: img('story-pourover'),
    hands: img('story-hands'),
    barista: img('story-barista'),
  },
  pillars: [
    {
      no: 'I',
      title: 'Philosophy',
      text: 'Fewer things, done beautifully. A short menu we can stand behind, cup after cup.',
    },
    {
      no: 'II',
      title: 'Quality',
      text: 'Every lot is cupped, scored and traced to the farm. Anything under 86 points never leaves the lab.',
    },
    {
      no: 'III',
      title: 'Passion',
      text: 'Our baristas train for six months before pulling a shot for a guest. Obsession is the job description.',
    },
    {
      no: 'IV',
      title: 'Method',
      text: 'Ristretto ratios, 18-hour cold steeps, clear-cut ice. Small decisions that compound into something rare.',
    },
  ],
}

export const ATMOSPHERE = {
  hero: img('atmos-interior'),
  tiles: [
    { image: img('atmos-pour'), title: 'Preparation', text: 'Pour-over by hand, timed to the second.' },
    { image: img('atmos-barista'), title: 'The Barista', text: 'Craft you can watch from every seat.' },
    { image: img('atmos-people'), title: 'Our Guests', text: 'A room that hums, never shouts.' },
    { image: img('atmos-window'), title: 'Warm Light', text: 'Low lamps, long tables, slow afternoons.' },
    { image: img('atmos-bar'), title: 'The Bar', text: 'Six grinders. One for every origin.' },
    { image: img('atmos-sign'), title: 'Evenings', text: 'Open late, lit amber.' },
  ],
}

export const GALLERY = [
  { image: img('g-lattes'), caption: 'Morning ritual', meta: 'Flat whites, table four', span: 'md:col-span-7 md:row-span-2' },
  { image: img('g-art'), caption: 'Rosetta', meta: 'Latte art, by hand', span: 'md:col-span-5' },
  { image: img('g-shadow'), caption: 'Afternoon shadow', meta: 'Espresso, 4 pm', span: 'md:col-span-5' },
  { image: img('g-portafilter'), caption: 'Mise en place', meta: 'Doses, weighed', span: 'md:col-span-4' },
  { image: img('g-iced'), caption: 'The pour', meta: 'Iced signature', span: 'md:col-span-4 md:row-span-2' },
  { image: img('g-beans'), caption: 'Fresh roast', meta: 'Huila, washed', span: 'md:col-span-4' },
  { image: img('g-hands'), caption: 'Held warm', meta: 'Cappuccino', span: 'md:col-span-4' },
  { image: img('g-chemex'), caption: 'Slow bar', meta: 'Filter service', span: 'md:col-span-4' },
  { image: img('g-window'), caption: 'Window seat', meta: 'Reading hour', span: 'md:col-span-4' },
]

export const TESTIMONIALS = [
  {
    quote: 'The iced signature is a small piece of theatre. You watch every layer settle, then it tastes even better than it looks.',
    name: 'Amara Okafor',
    role: 'Food writer',
  },
  {
    quote: 'I’ve had espresso in Milan, Melbourne and Oslo. This is the one I think about on the way home.',
    name: 'Daniel Reyes',
    role: 'Architect, regular since 2016',
  },
  {
    quote: 'Quiet, warm, unhurried. The baristas remember how you take it, and somehow how your week went.',
    name: 'Sofia Lindqvist',
    role: 'Neighbour',
  },
  {
    quote: 'Their cold brew changed how I drink coffee. Smooth enough to sip black, deep enough to stay with you.',
    name: 'Kenji Watanabe',
    role: 'Chef',
  },
]

export const CONTACT = {
  address: ['24 Roastery Lane', 'Old Town, Riverside'],
  mapsQuery: 'coffee roastery old town',
  phone: '+1 (555) 014-2024',
  email: 'hello@theartofcoffee.co',
  hours: [
    { day: 'Monday – Friday', time: '7:00 – 19:00' },
    { day: 'Saturday', time: '8:00 – 20:00' },
    { day: 'Sunday', time: '8:30 – 17:00' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
  ],
  image: img('contact'),
}

export const FINALE = {
  image: img('finale'),
}

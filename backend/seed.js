const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const products = [
  // ═══════════════════════════════════════════
  //  DARK CHOCOLATE (8 products)
  // ═══════════════════════════════════════════
  {
    name: 'Belgian Dark Truffle',
    description: 'Exquisite Belgian dark truffles handcrafted with 72% single-origin Ghanaian cocoa. Each truffle features a velvety ganache center enrobed in a crisp dark chocolate shell and dusted with premium Dutch cocoa powder. A sophisticated indulgence for the true connoisseur who appreciates depth, complexity, and the bittersweet symphony of world-class dark chocolate.',
    price: 599,
    originalPrice: 749,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
    images: ['https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500', 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 120,
    rating: 4.8,
    numReviews: 234,
    featured: true,
    bestSeller: true,
    tags: ['premium', 'truffle', 'belgian', 'dark', 'gift-worthy']
  },
  {
    name: 'Midnight Cocoa Bliss',
    description: 'Dive into the deep, intense world of 85% pure dark chocolate. Our Midnight Cocoa Bliss is crafted for those who crave the bold, unapologetic taste of real cocoa. Made from sustainably sourced beans from the Ivory Coast, each square delivers a powerful antioxidant punch with a smooth, lingering finish that dark chocolate purists adore.',
    price: 349,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 200,
    rating: 4.6,
    numReviews: 178,
    featured: true,
    bestSeller: false,
    tags: ['intense', 'dark', 'pure-cocoa', 'antioxidant', 'sugar-low']
  },
  {
    name: 'Artisan Sea Salt Dark Chocolate',
    description: 'A masterful blend of 70% dark chocolate with delicate flakes of Maldon sea salt crystals. The interplay between deep, roasted cocoa notes and the mineral brightness of the salt creates an addictive flavor profile. Bean-to-bar crafted in small batches to ensure every piece meets our exacting standards of quality and taste.',
    price: 299,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 150,
    rating: 4.5,
    numReviews: 145,
    featured: false,
    bestSeller: true,
    tags: ['sea-salt', 'artisan', 'bean-to-bar', 'gourmet']
  },
  {
    name: 'Espresso Dark Chocolate Thins',
    description: 'Ultra-thin dark chocolate wafers infused with finely ground Colombian espresso. Each crisp, snappy thin delivers an electrifying coffee-chocolate experience that awakens the senses. Elegantly packaged in a collector\'s tin — perfect for gifting or keeping on your desk for that afternoon pick-me-up.',
    price: 399,
    originalPrice: 499,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500',
    images: ['https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500'],
    stock: 180,
    rating: 4.7,
    numReviews: 167,
    featured: true,
    bestSeller: true,
    tags: ['espresso', 'coffee', 'thins', 'crispy', 'collector-tin']
  },
  {
    name: 'Dark Chocolate Orange Peel',
    description: 'Sun-dried Mediterranean orange peel strips luxuriously coated in rich 65% dark chocolate. The citrusy zing of candied orange perfectly complements the bittersweet cocoa, creating a timeless flavor pairing that has delighted chocolate lovers for centuries. Each piece is hand-dipped for a thick, even coating.',
    price: 279,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500',
    images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500'],
    stock: 95,
    rating: 4.3,
    numReviews: 89,
    featured: false,
    bestSeller: false,
    tags: ['orange', 'citrus', 'hand-dipped', 'classic']
  },
  {
    name: 'Single Origin Madagascar Dark',
    description: 'A rare single-origin dark chocolate bar sourced exclusively from heirloom Criollo cacao trees in Madagascar. Notes of wild berries, vanilla, and a whisper of honey unfold on the palate. At 68% cocoa, it strikes the ideal balance between intensity and approachability — a must-try for any chocolate adventurer.',
    price: 449,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'],
    stock: 60,
    rating: 4.9,
    numReviews: 112,
    featured: true,
    bestSeller: false,
    tags: ['single-origin', 'madagascar', 'criollo', 'rare', 'premium']
  },
  {
    name: 'Dark Chocolate Almond Bark',
    description: 'Generous shards of dark chocolate bark studded with toasted California almonds and a sprinkle of Himalayan pink salt. This rustic, hand-broken treat is perfect for sharing — or not. Each batch is made in our copper kettles for that unique roasted depth you can only get from artisan craftsmanship.',
    price: 249,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500'],
    stock: 140,
    rating: 4.4,
    numReviews: 98,
    featured: false,
    bestSeller: true,
    tags: ['bark', 'almonds', 'pink-salt', 'shareable']
  },
  {
    name: 'Noir Velvet Ganache Squares',
    description: 'Twelve individually plated dark chocolate squares, each hiding a silky smooth ganache center made with fresh cream and a touch of Tahitian vanilla. The outer shell provides a satisfying snap before yielding to the molten-like interior. Presented in an elegant black & gold box.',
    price: 699,
    originalPrice: 849,
    category: 'Dark Chocolate',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
    stock: 75,
    rating: 4.8,
    numReviews: 201,
    featured: true,
    bestSeller: true,
    tags: ['ganache', 'luxury', 'gift-box', 'vanilla', 'premium']
  },

  // ═══════════════════════════════════════════
  //  MILK CHOCOLATE (8 products)
  // ═══════════════════════════════════════════
  {
    name: 'Velvet Cocoa Bar',
    description: 'Our signature milk chocolate bar — impossibly smooth, creamy, and perfectly sweet. Made from premium West African cocoa beans blended with fresh whole milk powder sourced from Swiss alpine dairies. A timeless classic that melts on your tongue and reminds you why milk chocolate is loved the world over. 100g of pure chocolate bliss.',
    price: 199,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'],
    stock: 300,
    rating: 4.5,
    numReviews: 312,
    featured: true,
    bestSeller: true,
    tags: ['classic', 'creamy', 'smooth', 'bestseller']
  },
  {
    name: 'Honeycomb Crunch Milk Chocolate',
    description: 'Crunchy honeycomb toffee pieces folded into rich Belgian milk chocolate. Every bite delivers a delightful contrast of textures — the snap of caramelized honeycomb against the smooth embrace of premium milk chocolate. A childhood favorite reimagined with gourmet ingredients.',
    price: 249,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 180,
    rating: 4.6,
    numReviews: 156,
    featured: false,
    bestSeller: true,
    tags: ['honeycomb', 'crunchy', 'toffee', 'textured']
  },
  {
    name: 'Cookies & Cream Fantasy',
    description: 'Dreamy milk chocolate loaded with crushed chocolate cookie pieces. Inspired by the beloved ice cream flavor, this bar transforms a classic combination into a premium chocolate experience. The cookie crumbs add a wonderful crunch while the creamy chocolate base keeps everything harmoniously together.',
    price: 229,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500'],
    stock: 220,
    rating: 4.4,
    numReviews: 189,
    featured: false,
    bestSeller: true,
    tags: ['cookies', 'cream', 'crunchy', 'fun']
  },
  {
    name: 'Silk Road Milk Chocolate Drops',
    description: 'Perfectly round milk chocolate drops, each the size of a coin, designed for snacking on the go. Made with 38% cocoa content for a balanced sweetness that never overwhelms. Comes in a resealable pouch so you can enjoy them throughout the day — if they last that long.',
    price: 149,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
    images: ['https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500'],
    stock: 400,
    rating: 4.3,
    numReviews: 267,
    featured: false,
    bestSeller: false,
    tags: ['drops', 'snack', 'resealable', 'portable']
  },
  {
    name: 'Roasted Coconut Milk Chocolate',
    description: 'Tropical toasted coconut flakes enrobed in silky milk chocolate with a hint of Madagascar vanilla. Close your eyes and let each bite transport you to a sun-drenched tropical paradise. The subtle nuttiness of the coconut pairs beautifully with the caramel notes of our milk chocolate base.',
    price: 269,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500',
    images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500'],
    stock: 130,
    rating: 4.2,
    numReviews: 78,
    featured: false,
    bestSeller: false,
    tags: ['coconut', 'tropical', 'vanilla', 'toasted']
  },
  {
    name: 'Strawberry Swirl Milk Bar',
    description: 'A playful milk chocolate bar with ribbons of real freeze-dried strawberry running through every layer. The berry tartness cuts through the sweetness perfectly, making this an irresistible treat. Pink-hued and visually stunning — it looks as good as it tastes.',
    price: 219,
    originalPrice: 279,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 160,
    rating: 4.5,
    numReviews: 134,
    featured: true,
    bestSeller: false,
    tags: ['strawberry', 'fruit', 'pink', 'swirl']
  },
  {
    name: 'Triple Milk Chocolate Layer Cake Bar',
    description: 'Three distinct layers of milk chocolate — white, classic, and caramelized — fused into a single decadent bar. Each layer has its own personality: the white is sweet and vanilla-forward, the classic is smooth and balanced, and the caramelized adds a toasty, rich depth.',
    price: 329,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500',
    images: ['https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500'],
    stock: 110,
    rating: 4.7,
    numReviews: 143,
    featured: true,
    bestSeller: false,
    tags: ['triple-layer', 'caramelized', 'white-chocolate', 'unique']
  },
  {
    name: 'Malted Milk Chocolate Buttons',
    description: 'Nostalgic malted milk chocolate buttons that taste like your favorite childhood milkshake in chocolate form. Each button is generously sized, perfectly round, and made with real malt extract for that authentic, comforting flavor. Great for baking, snacking, or topping your ice cream.',
    price: 179,
    category: 'Milk Chocolate',
    image: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500',
    images: ['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500'],
    stock: 250,
    rating: 4.3,
    numReviews: 198,
    featured: false,
    bestSeller: true,
    tags: ['malted', 'buttons', 'nostalgic', 'baking']
  },

  // ═══════════════════════════════════════════
  //  CARAMEL CANDY (7 products)
  // ═══════════════════════════════════════════
  {
    name: 'Caramel Lava Candy',
    description: 'Bite into a crisp chocolate shell and discover a river of molten salted caramel inside. Our Caramel Lava Candy is the ultimate sweet-salty indulgence — the caramel is made from scratch using real butter, heavy cream, and Himalayan pink salt, then encased in a premium dark chocolate dome.',
    price: 399,
    originalPrice: 499,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500',
    images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500', 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 100,
    rating: 4.9,
    numReviews: 287,
    featured: true,
    bestSeller: true,
    tags: ['lava', 'salted-caramel', 'molten', 'premium', 'bestseller']
  },
  {
    name: 'Butterscotch Caramel Chews',
    description: 'Soft, chewy caramel candies made with real brown butter and a splash of single-malt scotch for an adults-only butterscotch experience. Each piece is individually gold-foil wrapped to maintain peak freshness. Wonderfully addictive — you\'ve been warned.',
    price: 199,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
    images: ['https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500'],
    stock: 250,
    rating: 4.4,
    numReviews: 176,
    featured: false,
    bestSeller: true,
    tags: ['butterscotch', 'chewy', 'wrapped', 'soft']
  },
  {
    name: 'Salted Caramel Pretzel Bites',
    description: 'The ultimate snack trifecta: crunchy mini pretzel pieces coated in buttery salted caramel and then finished with a generous drizzle of milk chocolate. Sweet, salty, crunchy, and chocolatey all in one bite. Comes in a shareable tub — perfect for movie night.',
    price: 299,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500'],
    stock: 180,
    rating: 4.6,
    numReviews: 203,
    featured: true,
    bestSeller: false,
    tags: ['pretzel', 'salty', 'crunchy', 'shareable', 'snack']
  },
  {
    name: 'Golden Caramel Truffles',
    description: 'Luxurious truffles with a creamy caramel ganache center, coated in premium milk chocolate and finished with edible gold dust. Each truffle is a miniature work of art — almost too beautiful to eat. Almost. Packaged in a velvet-lined box of 12.',
    price: 549,
    originalPrice: 649,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
    stock: 65,
    rating: 4.8,
    numReviews: 156,
    featured: true,
    bestSeller: true,
    tags: ['truffles', 'gold', 'luxury', 'gift', 'edible-gold']
  },
  {
    name: 'Dulce de Leche Caramel Cups',
    description: 'Latin-inspired chocolate cups filled with authentic dulce de leche — slow-cooked sweetened milk that transforms into a thick, luscious caramel. The dark chocolate cup provides a bold counterpoint to the sweet, milky filling. A taste of South America in every cup.',
    price: 349,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 120,
    rating: 4.5,
    numReviews: 112,
    featured: false,
    bestSeller: false,
    tags: ['dulce-de-leche', 'cups', 'south-american', 'filled']
  },
  {
    name: 'Caramel Apple Crunch',
    description: 'The magic of caramel apples in candy form! Tangy dried apple pieces mixed with buttery caramel chunks and coated in smooth milk chocolate. Each pack captures the essence of autumn carnivals and crisp fall evenings. Seasonal favorite that\'s available all year.',
    price: 229,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 170,
    rating: 4.3,
    numReviews: 89,
    featured: false,
    bestSeller: false,
    tags: ['apple', 'autumn', 'crunchy', 'seasonal']
  },
  {
    name: 'Toffee Caramel Brittle',
    description: 'Old-fashioned toffee brittle made with golden caramel, roasted pecans, and a coating of rich dark chocolate. Hand-pulled and cracked into irregular pieces for that authentic artisan feel. Each tin contains a generous 250g of this dangerously addictive treat.',
    price: 379,
    category: 'Caramel Candy',
    image: 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500',
    images: ['https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500'],
    stock: 90,
    rating: 4.6,
    numReviews: 134,
    featured: false,
    bestSeller: true,
    tags: ['toffee', 'brittle', 'pecans', 'old-fashioned', 'tin']
  },

  // ═══════════════════════════════════════════
  //  HAZELNUT CHOCOLATE (7 products)
  // ═══════════════════════════════════════════
  {
    name: 'Hazelnut Crunch Bites',
    description: 'Irresistibly crunchy bites of roasted Piedmont hazelnuts enveloped in rich, velvety milk chocolate. Each bite-sized piece delivers the perfect ratio of nut to chocolate — generously nutty with a smooth, creamy finish. Packaged in a resealable kraft bag for snacking perfection.',
    price: 329,
    originalPrice: 399,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500',
    images: ['https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500', 'https://images.unsplash.com/photo-1606913084603-3e7702b01627?w=500'],
    stock: 200,
    rating: 4.7,
    numReviews: 245,
    featured: true,
    bestSeller: true,
    tags: ['hazelnut', 'crunchy', 'piedmont', 'snack', 'resealable']
  },
  {
    name: 'Golden Almond Chocolate',
    description: 'Whole roasted California almonds smothered in a golden layer of caramelized milk chocolate. The almonds are roasted in-house for maximum crunch and flavor, then hand-dipped twice for a luxuriously thick coating. Each cluster is a masterpiece of nutty, chocolatey perfection.',
    price: 349,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500'],
    stock: 150,
    rating: 4.6,
    numReviews: 167,
    featured: true,
    bestSeller: true,
    tags: ['almond', 'golden', 'roasted', 'clusters', 'hand-dipped']
  },
  {
    name: 'Gianduja Hazelnut Spread Bar',
    description: 'A smooth chocolate bar made with traditional Italian gianduja — a luxurious blend of 40% roasted hazelnut paste and premium milk chocolate. It practically melts on contact with your tongue. Inspired by the classic Piemontese recipe dating back to 1865.',
    price: 299,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'],
    stock: 130,
    rating: 4.8,
    numReviews: 198,
    featured: true,
    bestSeller: false,
    tags: ['gianduja', 'italian', 'hazelnut-paste', 'smooth', 'classic']
  },
  {
    name: 'Praline Hazelnut Bonbons',
    description: 'Hand-piped dark chocolate bonbons filled with a silky hazelnut praline paste. The praline is made by caramelizing hazelnuts with sugar and grinding them to a buttery smooth consistency. Each bonbon is decorated with a delicate hazelnut fragment on top. Box of 16.',
    price: 599,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
    stock: 70,
    rating: 4.9,
    numReviews: 176,
    featured: true,
    bestSeller: false,
    tags: ['praline', 'bonbons', 'handcrafted', 'luxury', 'box-of-16']
  },
  {
    name: 'Nutella Dream Chocolate Cups',
    description: 'Thick chocolate cups generously filled with a house-made hazelnut cocoa spread that rivals the world\'s most famous jar. Rich, creamy, and utterly decadent. Each cup is topped with a crushed hazelnut for that extra crunch and visual appeal. Pack of 8 cups.',
    price: 279,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 190,
    rating: 4.5,
    numReviews: 223,
    featured: false,
    bestSeller: true,
    tags: ['cups', 'spread', 'creamy', 'hazelnut-cocoa', 'popular']
  },
  {
    name: 'Roasted Hazelnut Dark Slab',
    description: 'A thick, rustic slab of 68% dark chocolate generously embedded with whole roasted hazelnuts. Deliberately unrefined and chunky — this is chocolate at its most primal and satisfying. Each slab is hand-poured and unique, because artisan means no two are exactly alike.',
    price: 259,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 115,
    rating: 4.4,
    numReviews: 98,
    featured: false,
    bestSeller: false,
    tags: ['slab', 'rustic', 'whole-nuts', 'dark', 'hand-poured']
  },
  {
    name: 'Hazelnut Wafer Delight',
    description: 'Crispy multi-layered wafers sandwiched with hazelnut cream and encased in smooth milk chocolate. Five paper-thin wafer layers alternate with four layers of roasted hazelnut filling — creating the most satisfying crunch with every bite. A European café classic.',
    price: 189,
    category: 'Hazelnut Chocolate',
    image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
    images: ['https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500'],
    stock: 260,
    rating: 4.3,
    numReviews: 187,
    featured: false,
    bestSeller: true,
    tags: ['wafer', 'crispy', 'layered', 'european', 'snack']
  },

  // ═══════════════════════════════════════════
  //  FRUIT CHOCOLATE (7 products)
  // ═══════════════════════════════════════════
  {
    name: 'Raspberry Rose Dark Chocolate',
    description: 'An enchanting fusion of freeze-dried raspberry pieces, delicate rose petals, and 70% dark chocolate. Floral, fruity, and deeply chocolatey — this bar is a sensory experience that feels like walking through a garden in bloom. Finished with an artistic dusting of edible rose powder.',
    price: 349,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500'],
    stock: 80,
    rating: 4.7,
    numReviews: 145,
    featured: true,
    bestSeller: false,
    tags: ['raspberry', 'rose', 'floral', 'artistic', 'exotic']
  },
  {
    name: 'Tropical Mango Passion Bites',
    description: 'Sun-ripened Alphonso mango and tangy passion fruit pieces folded into creamy white chocolate. Each bite bursts with tropical sunshine. Made with real fruit purée — no artificial flavors, just pure tropical paradise dipped in premium cocoa butter-rich white chocolate.',
    price: 279,
    originalPrice: 349,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500',
    images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500'],
    stock: 120,
    rating: 4.5,
    numReviews: 134,
    featured: true,
    bestSeller: true,
    tags: ['mango', 'passion-fruit', 'tropical', 'white-chocolate', 'natural']
  },
  {
    name: 'Blueberry Acai Superfood Chocolate',
    description: 'Health meets indulgence in this antioxidant-packed dark chocolate bar loaded with wild blueberries and Brazilian acai berry powder. Each square delivers a powerful punch of superfoods wrapped in 65% dark chocolate. Guilt-free snacking at its finest.',
    price: 299,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 150,
    rating: 4.4,
    numReviews: 112,
    featured: false,
    bestSeller: false,
    tags: ['blueberry', 'acai', 'superfood', 'antioxidant', 'healthy']
  },
  {
    name: 'Cherry Kirsch Truffles',
    description: 'Classic European cherry truffles soaked in Kirsch cherry brandy and dipped in velvety dark chocolate. Each truffle contains a juicy Luxardo cherry at its heart, surrounded by cherry-infused ganache. A sophisticated confection for special occasions. Box of 9.',
    price: 499,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
    stock: 55,
    rating: 4.8,
    numReviews: 167,
    featured: true,
    bestSeller: false,
    tags: ['cherry', 'kirsch', 'brandy', 'european', 'sophisticated']
  },
  {
    name: 'Citrus Burst Chocolate Thins',
    description: 'Paper-thin dark chocolate discs infused with a medley of candied lemon, lime, and orange zest. Each tin contains 20 perfectly crisp thins that shatter with a satisfying snap. The citrus oils release an incredible aroma the moment you open the collector\'s tin.',
    price: 329,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500',
    images: ['https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500'],
    stock: 100,
    rating: 4.3,
    numReviews: 87,
    featured: false,
    bestSeller: false,
    tags: ['citrus', 'lemon', 'lime', 'orange', 'thins', 'tin']
  },
  {
    name: 'Strawberry Cheesecake Chocolate Bar',
    description: 'A dessert-inspired white chocolate bar with swirls of tangy strawberry coulis and crunchy biscuit crumbs. It tastes exactly like a slice of New York cheesecake — creamy, fruity, and impossible to resist. Limited batch production for peak freshness.',
    price: 249,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 90,
    rating: 4.6,
    numReviews: 156,
    featured: false,
    bestSeller: true,
    tags: ['strawberry', 'cheesecake', 'dessert', 'biscuit', 'limited']
  },
  {
    name: 'Fig & Honey Dark Chocolate',
    description: 'Turkish dried figs and wildflower honey swirled into 60% dark chocolate for an earthy, naturally sweet treat. The figs add a wonderful chewiness while the honey provides subtle floral notes. An ancient Mediterranean combination brought to life in modern chocolate form.',
    price: 319,
    category: 'Fruit Chocolate',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'],
    stock: 85,
    rating: 4.5,
    numReviews: 93,
    featured: false,
    bestSeller: false,
    tags: ['fig', 'honey', 'mediterranean', 'earthy', 'natural']
  },

  // ═══════════════════════════════════════════
  //  CHOCOLATE BARS (7 products)
  // ═══════════════════════════════════════════
  {
    name: 'Classic Swiss Chocolate Bar',
    description: 'A 150g premium Swiss chocolate bar made using the traditional conching method for over 72 hours. The result is an incredibly smooth, melt-in-your-mouth texture that Swiss chocolate is famous for. Made with alpine milk and sustainably sourced cocoa from Ecuador.',
    price: 299,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
    images: ['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'],
    stock: 200,
    rating: 4.7,
    numReviews: 234,
    featured: true,
    bestSeller: true,
    tags: ['swiss', 'classic', 'conched', 'smooth', 'premium']
  },
  {
    name: 'Crunchy Peanut Butter Bar',
    description: 'A thick chocolate bar packed with a generous layer of crunchy peanut butter. Real roasted peanut pieces give each bite an irresistible texture, while the milk chocolate coating brings everything together. Protein-packed and absolutely delicious — your new gym bag staple.',
    price: 199,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=500'],
    stock: 280,
    rating: 4.5,
    numReviews: 312,
    featured: false,
    bestSeller: true,
    tags: ['peanut-butter', 'crunchy', 'protein', 'filling', 'popular']
  },
  {
    name: 'Matcha Green Tea White Chocolate Bar',
    description: 'Ceremonial-grade Japanese matcha whipped into creamy Belgian white chocolate. The vibrant green color is all natural — no dyes, just pure Uji matcha powder. Earthy, sweet, and subtly bitter all at once. A fusion masterpiece for adventurous palates.',
    price: 379,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500',
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500'],
    stock: 90,
    rating: 4.6,
    numReviews: 167,
    featured: true,
    bestSeller: false,
    tags: ['matcha', 'green-tea', 'japanese', 'white-chocolate', 'fusion']
  },
  {
    name: 'Salted Pistachio Milk Bar',
    description: 'Vibrant green Sicilian pistachio pieces studded throughout a bar of premium milk chocolate, with just a kiss of Fleur de Sel. The pistachio\'s natural earthiness and slight butteriness pair magnificently with the sweet milk chocolate. Visually stunning with its green-specked cross-section.',
    price: 349,
    originalPrice: 449,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500',
    images: ['https://images.unsplash.com/photo-1548741487-18d363dc4469?w=500'],
    stock: 100,
    rating: 4.8,
    numReviews: 189,
    featured: true,
    bestSeller: true,
    tags: ['pistachio', 'salted', 'sicilian', 'stunning', 'nuts']
  },
  {
    name: 'Chili Aztec Dark Bar',
    description: 'A bold, fiery dark chocolate bar inspired by the ancient Aztec drinking chocolate tradition. Infused with smoked chipotle chili, cinnamon, and a hint of cayenne pepper. The heat builds slowly and lingers long after the chocolate has melted. Not for the faint of heart.',
    price: 269,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500'],
    stock: 110,
    rating: 4.4,
    numReviews: 145,
    featured: false,
    bestSeller: false,
    tags: ['chili', 'spicy', 'aztec', 'cinnamon', 'bold']
  },
  {
    name: 'Caramelized Biscuit Cookie Bar',
    description: 'Inspired by the beloved Belgian speculoos cookie, this bar layers caramelized biscuit crumbs with spiced cookie butter cream inside smooth milk chocolate. Crunchy, spicy, sweet, and creamy — it\'s four textures and flavors in perfect harmony. Your coffee\'s new best friend.',
    price: 219,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500',
    images: ['https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500'],
    stock: 230,
    rating: 4.7,
    numReviews: 278,
    featured: false,
    bestSeller: true,
    tags: ['biscuit', 'speculoos', 'cookie-butter', 'spiced', 'coffee-pairing']
  },
  {
    name: 'Quinoa Crispies Dark Chocolate Bar',
    description: 'Popped quinoa crispies suspended in 72% dark chocolate for a bar that\'s light, crunchy, and nutrient-rich. High in protein and fibre, low in guilt. The quinoa adds a pleasant popcorn-like texture without overpowering the deep cocoa flavors. Vegan-friendly.',
    price: 249,
    category: 'Chocolate Bars',
    image: 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500',
    images: ['https://images.unsplash.com/photo-1553452118-621e1f860f43?w=500'],
    stock: 160,
    rating: 4.3,
    numReviews: 123,
    featured: false,
    bestSeller: false,
    tags: ['quinoa', 'crispy', 'vegan', 'protein', 'healthy']
  },

  // ═══════════════════════════════════════════
  //  CHOCOLATE GIFT BOXES (6 products)
  // ═══════════════════════════════════════════
  {
    name: 'Royal Assortment Gift Box',
    description: 'The crown jewel of our collection — a magnificent assortment of 36 handcrafted chocolates featuring dark, milk, and white varieties. Includes truffles, pralines, caramels, fruit-infused pieces, and nut clusters. Presented in a regal gold-embossed mahogany box with a satin ribbon. The ultimate gift for the chocolate connoisseur.',
    price: 999,
    originalPrice: null,
    category: 'Chocolate Gift Boxes',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500', 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500'],
    stock: 40,
    rating: 4.9,
    numReviews: 312,
    featured: true,
    bestSeller: true,
    tags: ['gift', 'assortment', 'premium', 'luxury', '36-piece', 'mahogany']
  },
  {
    name: 'Celebration Chocolate Tower',
    description: 'A stunning three-tier tower of chocolates, each level featuring a different theme: bottom tier has dark chocolate truffles, middle tier holds milk chocolate caramels, and the top tier is crowned with white chocolate bonbons. Wrapped in festive ribbons — makes an unforgettable centerpiece and gift.',
    price: 799,
    originalPrice: 949,
    category: 'Chocolate Gift Boxes',
    image: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500',
    images: ['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500'],
    stock: 35,
    rating: 4.8,
    numReviews: 198,
    featured: true,
    bestSeller: false,
    tags: ['tower', 'celebration', 'three-tier', 'centerpiece', 'festive']
  },
  {
    name: 'Heart Shaped Romance Box',
    description: 'A heart-shaped box containing 24 assorted milk and dark chocolate hearts — each filled with a different flavor: strawberry cream, hazelnut praline, salted caramel, champagne ganache, and more. The red velvet box with a satin bow makes it the quintessential romantic gift.',
    price: 649,
    category: 'Chocolate Gift Boxes',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
    stock: 60,
    rating: 4.7,
    numReviews: 234,
    featured: true,
    bestSeller: true,
    tags: ['heart', 'romantic', 'valentines', 'assorted', 'red-velvet']
  },
  {
    name: 'Artisan Tasting Collection',
    description: 'A curated tasting journey through 12 single-origin chocolates from around the world — Ghana, Madagascar, Ecuador, Venezuela, Vietnam, and Peru. Each piece is labeled with origin and tasting notes. Includes a chocolate tasting guide card. Perfect for the curious chocolate explorer.',
    price: 549,
    category: 'Chocolate Gift Boxes',
    image: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500',
    images: ['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500'],
    stock: 50,
    rating: 4.9,
    numReviews: 167,
    featured: true,
    bestSeller: false,
    tags: ['tasting', 'single-origin', 'world', 'curated', 'educational']
  },
  {
    name: 'Corporate Elegance Box',
    description: 'An elegant matte-black box of 20 premium chocolates, perfect for corporate gifting. Features a sophisticated selection of dark truffles, caramel pralines, and nut clusters. Space for custom branding and a personalized message card. Minimum order of 1 box.',
    price: 699,
    category: 'Chocolate Gift Boxes',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500',
    images: ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'],
    stock: 100,
    rating: 4.6,
    numReviews: 145,
    featured: false,
    bestSeller: true,
    tags: ['corporate', 'elegant', 'professional', 'branding', 'custom']
  },
  {
    name: 'Festive Season Hamper',
    description: 'A luxurious wicker hamper packed with 500g of assorted chocolates, a box of chocolate truffles, chocolate-covered almonds, hot cocoa mix, and a hand-painted ceramic mug. Wrapped in cellophane with a golden bow. The perfect all-in-one festive gift that says "I care about your happiness."',
    price: 899,
    originalPrice: 999,
    category: 'Chocolate Gift Boxes',
    image: 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500',
    images: ['https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=500'],
    stock: 45,
    rating: 4.8,
    numReviews: 189,
    featured: true,
    bestSeller: true,
    tags: ['hamper', 'festive', 'wicker', 'hot-cocoa', 'ceramic-mug', 'gift']
  }
];

const coupons = [
  {
    code: 'CHOCO10',
    discount: 10,
    minPurchase: 500,
    maxDiscount: 200,
    isActive: true,
    expiresAt: new Date('2027-12-31')
  },
  {
    code: 'SWEET20',
    discount: 20,
    minPurchase: 1000,
    maxDiscount: 500,
    isActive: true,
    expiresAt: new Date('2027-12-31')
  },
  {
    code: 'WELCOME15',
    discount: 15,
    minPurchase: 0,
    maxDiscount: 300,
    isActive: true,
    expiresAt: new Date('2027-12-31')
  },
  {
    code: 'FESTIVE25',
    discount: 25,
    minPurchase: 1500,
    maxDiscount: 750,
    isActive: true,
    expiresAt: new Date('2027-12-31')
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    await Coupon.deleteMany({});

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@chocodelight.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@chocodelight.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('  ✓ Admin user created: admin@chocodelight.com / admin123');
    }

    await Product.insertMany(products);
    await Coupon.insertMany(coupons);

    // Create test user and orders after products are inserted
    const testUserExists = await User.findOne({ email: 'test@example.com' });
    if (!testUserExists) {
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('  ✓ Test user created: test@example.com / test123');

      // Create some test orders for the test user
      const sampleProducts = await Product.find().limit(3);
      if (sampleProducts.length >= 3) {
        const order1 = await Order.create({
          user: testUser._id,
          items: [
            {
              product: sampleProducts[0]._id,
              name: sampleProducts[0].name,
              price: sampleProducts[0].price,
              quantity: 2,
              image: sampleProducts[0].image
            },
            {
              product: sampleProducts[1]._id,
              name: sampleProducts[1].name,
              price: sampleProducts[1].price,
              quantity: 1,
              image: sampleProducts[1].image
            }
          ],
          shippingAddress: {
            fullName: 'Test User',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            phone: '1234567890'
          },
          paymentMethod: 'COD',
          subtotal: (sampleProducts[0].price * 2) + sampleProducts[1].price,
          shippingPrice: 49,
          taxPrice: Math.round(((sampleProducts[0].price * 2) + sampleProducts[1].price) * 0.18),
          totalPrice: (sampleProducts[0].price * 2) + sampleProducts[1].price + 49 + Math.round(((sampleProducts[0].price * 2) + sampleProducts[1].price) * 0.18),
          status: 'Delivered',
          invoiceNumber: 'INV-202612-0001'
        });

        const order2 = await Order.create({
          user: testUser._id,
          items: [
            {
              product: sampleProducts[2]._id,
              name: sampleProducts[2].name,
              price: sampleProducts[2].price,
              quantity: 1,
              image: sampleProducts[2].image
            }
          ],
          shippingAddress: {
            fullName: 'Test User',
            address: '123 Test Street',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            phone: '1234567890'
          },
          paymentMethod: 'COD',
          subtotal: sampleProducts[2].price,
          shippingPrice: 49,
          taxPrice: Math.round(sampleProducts[2].price * 0.18),
          totalPrice: sampleProducts[2].price + 49 + Math.round(sampleProducts[2].price * 0.18),
          status: 'Processing',
          invoiceNumber: 'INV-202612-0002'
        });

        console.log('  ✓ Test orders created for test user');
      }
    }

    console.log('═══════════════════════════════════════════');
    console.log('  🍫 ChocoDelight Database Seeded!');
    console.log('═══════════════════════════════════════════');
    console.log(`  ✓ ${products.length} products added`);
    console.log(`  ✓ ${coupons.length} coupons added`);
    console.log('');
    console.log('  Categories:');
    const cats = [...new Set(products.map(p => p.category))];
    cats.forEach(cat => {
      const count = products.filter(p => p.category === cat).length;
      console.log(`    • ${cat}: ${count} products`);
    });
    console.log('');
    console.log('  Coupon Codes: CHOCO10, SWEET20, WELCOME15, FESTIVE25');
    console.log('═══════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();

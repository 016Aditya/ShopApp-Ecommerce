// =============================================================
//  seed.js  —  Bulk insert 40+ products into your Spring Boot API
//  LOCATION : Ecommerce-Frontend-Reactjs/seed/seed.js
//
//  HOW TO RUN:
//    1. cd seed
//    2. npm init -y && npm install axios
//    3. node seed.js
//
//  Make sure your Spring Boot backend is running on port 8080.
//  If your port is different, update BASE_URL below.
// =============================================================

const axios = require("axios");

const BASE_URL = "http://localhost:8080/api/products";

const products = [

  // ── ELECTRONICS ─ Mobile ────────────────────────────────────────
  {
    name: "Samsung Galaxy S25 Ultra",
    category: "Electronics",
    subcategory: "Mobile",
    brand: "Samsung",
    price: 99999,
    stock: 50,
    rating: 4.7,
    description: "Latest flagship with built-in S Pen, 200MP camera, and Snapdragon 8 Elite.",
    imageUrl: "https://m.media-amazon.com/images/I/71SqDuCGXEL.jpg",
  },
  {
    name: "iPhone 16 Pro Max 256GB",
    category: "Electronics",
    subcategory: "Mobile",
    brand: "Apple",
    price: 134900,
    stock: 35,
    rating: 4.8,
    description: "Apple Intelligence, A18 Pro chip, 5x optical zoom, titanium design.",
    imageUrl: "https://m.media-amazon.com/images/I/81fxjeu8fdL.jpg",
  },
  {
    name: "OnePlus 13 256GB/16GB",
    category: "Electronics",
    subcategory: "Mobile",
    brand: "OnePlus",
    price: 69999,
    stock: 60,
    rating: 4.5,
    description: "Snapdragon 8 Elite, Hasselblad cameras, 100W SUPERVOOC charging.",
    imageUrl: "https://m.media-amazon.com/images/I/61U7sK+BKWL.jpg",
  },

  // ── ELECTRONICS ─ Laptop ─────────────────────────────────────────
  {
    name: "Apple MacBook Air M3 15\" 8GB/256GB",
    category: "Electronics",
    subcategory: "Laptop",
    brand: "Apple",
    price: 114900,
    stock: 25,
    rating: 4.8,
    description: "Fanless design, 18-hour battery, M3 chip, Liquid Retina display.",
    imageUrl: "https://m.media-amazon.com/images/I/71vFKBpKakL.jpg",
  },
  {
    name: "Dell XPS 15 Core i9 RTX 4060",
    category: "Electronics",
    subcategory: "Laptop",
    brand: "Dell",
    price: 179990,
    stock: 15,
    rating: 4.6,
    description: "4K OLED display, 32GB RAM, 1TB SSD, premium build quality.",
    imageUrl: "https://m.media-amazon.com/images/I/71fO95MBEZL.jpg",
  },
  {
    name: "HP Pavilion 15 Ryzen 5 8GB/512GB",
    category: "Electronics",
    subcategory: "Laptop",
    brand: "HP",
    price: 52990,
    stock: 40,
    rating: 4.3,
    description: "AMD Ryzen 5 7530U, Full HD IPS display, Windows 11 Home.",
    imageUrl: "https://m.media-amazon.com/images/I/61RoxyVJBRL.jpg",
  },

  // ── ELECTRONICS ─ Headphones ─────────────────────────────────────
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    subcategory: "Headphones",
    brand: "Sony",
    price: 29990,
    stock: 80,
    rating: 4.8,
    description: "Industry-leading noise cancellation, 30-hour battery, multipoint connect.",
    imageUrl: "https://m.media-amazon.com/images/I/61lbSEPuMjL.jpg",
  },
  {
    name: "Boat Rockerz 450 Pro Wireless",
    category: "Electronics",
    subcategory: "Headphones",
    brand: "Boat",
    price: 1299,
    stock: 200,
    rating: 4.1,
    description: "40-hour playback, ASAP charge, ENx mic, signature sound.",
    imageUrl: "https://m.media-amazon.com/images/I/61S54FMfNqL.jpg",
  },

  // ── ELECTRONICS ─ TV ─────────────────────────────────────────────
  {
    name: "LG 55\" 4K OLED Smart TV C3",
    category: "Electronics",
    subcategory: "TV",
    brand: "LG",
    price: 139990,
    stock: 12,
    rating: 4.7,
    description: "OLED evo panel, 120Hz, Dolby Vision & Atmos, webOS 23.",
    imageUrl: "https://m.media-amazon.com/images/I/81HQKXP4-1L.jpg",
  },
  {
    name: "Mi 43\" 4K UHD Android TV",
    category: "Electronics",
    subcategory: "TV",
    brand: "Xiaomi",
    price: 27999,
    stock: 30,
    rating: 4.2,
    description: "4K Ultra HD, Android 11, far-field voice control, Dolby Audio.",
    imageUrl: "https://m.media-amazon.com/images/I/71B4IOnWIkL.jpg",
  },

  // ── CLOTHING ─ Shirt ─────────────────────────────────────────────
  {
    name: "Allen Solly Slim Fit Formal Shirt",
    category: "Clothing",
    subcategory: "Shirt",
    brand: "Allen Solly",
    price: 1299,
    stock: 120,
    rating: 4.3,
    description: "100% cotton, wrinkle-resistant, available in 6 colors.",
    imageUrl: "https://m.media-amazon.com/images/I/71d7rfSl4IL.jpg",
  },
  {
    name: "Van Heusen Checked Casual Shirt",
    category: "Clothing",
    subcategory: "Shirt",
    brand: "Van Heusen",
    price: 999,
    stock: 150,
    rating: 4.1,
    description: "Regular fit, pure cotton, machine washable.",
    imageUrl: "https://m.media-amazon.com/images/I/81YJiEMxhFL.jpg",
  },

  // ── CLOTHING ─ Jeans ─────────────────────────────────────────────
  {
    name: "Levi's 511 Slim Fit Jeans",
    category: "Clothing",
    subcategory: "Jeans",
    brand: "Levis",
    price: 2999,
    stock: 80,
    rating: 4.5,
    description: "Slim through hip and thigh, stretch denim, classic 5-pocket style.",
    imageUrl: "https://m.media-amazon.com/images/I/91i02ILsZFL.jpg",
  },
  {
    name: "Pepe Jeans Straight Fit Men's Jeans",
    category: "Clothing",
    subcategory: "Jeans",
    brand: "Pepe Jeans",
    price: 1799,
    stock: 100,
    rating: 4.0,
    description: "Straight fit, mid-rise, 98% cotton, zip fly.",
    imageUrl: "https://m.media-amazon.com/images/I/61sIoFbCShL.jpg",
  },

  // ── CLOTHING ─ Shoes ─────────────────────────────────────────────
  {
    name: "Nike Air Max 270 React",
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Nike",
    price: 9995,
    stock: 60,
    rating: 4.6,
    description: "Max Air unit, React foam, all-day comfort and bold style.",
    imageUrl: "https://m.media-amazon.com/images/I/61XUhrAbbOL.jpg",
  },
  {
    name: "Adidas Ultraboost 22 Running Shoes",
    category: "Clothing",
    subcategory: "Shoes",
    brand: "Adidas",
    price: 12999,
    stock: 45,
    rating: 4.7,
    description: "BOOST midsole, Primeknit+ upper, Continental rubber outsole.",
    imageUrl: "https://m.media-amazon.com/images/I/71E9PXSMKCL.jpg",
  },

  // ── CLOTHING ─ Dress ─────────────────────────────────────────────
  {
    name: "W Women's Floral Wrap Dress",
    category: "Clothing",
    subcategory: "Dress",
    brand: "W",
    price: 1699,
    stock: 70,
    rating: 4.2,
    description: "Floral print, V-neck, midi length, viscose fabric.",
    imageUrl: "https://m.media-amazon.com/images/I/71r9IQKIOHL.jpg",
  },

  // ── CLOTHING ─ Jacket ────────────────────────────────────────────
  {
    name: "The North Face Thermoball Eco Jacket",
    category: "Clothing",
    subcategory: "Jacket",
    brand: "The North Face",
    price: 14999,
    stock: 30,
    rating: 4.6,
    description: "Water-repellent, ThermoBall insulation, packs into its own pocket.",
    imageUrl: "https://m.media-amazon.com/images/I/71vxHgwrCML.jpg",
  },

  // ── CLOTHING ─ Kurta ─────────────────────────────────────────────
  {
    name: "Manyavar Men's Silk Kurta Set",
    category: "Clothing",
    subcategory: "Kurta",
    brand: "Manyavar",
    price: 3499,
    stock: 55,
    rating: 4.4,
    description: "Art silk, mandarin collar, festive wear, comes with churidar.",
    imageUrl: "https://m.media-amazon.com/images/I/71UOYT1vxDL.jpg",
  },

  // ── BOOKS ─ Novel ────────────────────────────────────────────────
  {
    name: "Atomic Habits by James Clear",
    category: "Books",
    subcategory: "Novel",
    brand: "Penguin",
    price: 399,
    stock: 300,
    rating: 4.9,
    description: "The proven system to build good habits and break bad ones.",
    imageUrl: "https://m.media-amazon.com/images/I/513Y5o-DYtL.jpg",
  },
  {
    name: "The Alchemist by Paulo Coelho",
    category: "Books",
    subcategory: "Novel",
    brand: "HarperCollins",
    price: 299,
    stock: 250,
    rating: 4.7,
    description: "A magical story about following your dream and listening to your heart.",
    imageUrl: "https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg",
  },
  {
    name: "Rich Dad Poor Dad by Robert Kiyosaki",
    category: "Books",
    subcategory: "Novel",
    brand: "Warner Books",
    price: 349,
    stock: 200,
    rating: 4.6,
    description: "What the rich teach their kids about money that the poor and middle class do not.",
    imageUrl: "https://m.media-amazon.com/images/I/51Zp4YPFKHL.jpg",
  },

  // ── BOOKS ─ Textbook ─────────────────────────────────────────────
  {
    name: "Introduction to Algorithms (CLRS)",
    category: "Books",
    subcategory: "Textbook",
    brand: "MIT Press",
    price: 2499,
    stock: 80,
    rating: 4.8,
    description: "The bible of algorithms — comprehensive coverage of data structures and algorithms.",
    imageUrl: "https://m.media-amazon.com/images/I/61Pgdn8Ys-L.jpg",
  },
  {
    name: "Java: The Complete Reference 12th Edition",
    category: "Books",
    subcategory: "Textbook",
    brand: "McGraw Hill",
    price: 899,
    stock: 120,
    rating: 4.5,
    description: "Complete coverage of Java 17+, ideal for beginners and professionals.",
    imageUrl: "https://m.media-amazon.com/images/I/51gMUkAq1WL.jpg",
  },

  // ── BOOKS ─ Stationery ───────────────────────────────────────────
  {
    name: "Classmate Premium Notebook Pack of 6",
    category: "Books",
    subcategory: "Stationery",
    brand: "Classmate",
    price: 249,
    stock: 500,
    rating: 4.3,
    description: "A4 size, 172 pages each, ruled, smooth writing experience.",
    imageUrl: "https://m.media-amazon.com/images/I/81fUb5xJTLL.jpg",
  },

  // ── BOOKS ─ Comics ───────────────────────────────────────────────
  {
    name: "Amar Chitra Katha Box Set of 20",
    category: "Books",
    subcategory: "Comics",
    brand: "ACK Media",
    price: 1499,
    stock: 90,
    rating: 4.6,
    description: "Classic Indian mythology and history comics, great for kids.",
    imageUrl: "https://m.media-amazon.com/images/I/81XVkBuYO0L.jpg",
  },

  // ── HOME ─ Furniture ─────────────────────────────────────────────
  {
    name: "Nilkamal Plastic Folding Table 4 Seater",
    category: "Home",
    subcategory: "Furniture",
    brand: "Nilkamal",
    price: 3499,
    stock: 40,
    rating: 4.1,
    description: "Weather-resistant, foldable for easy storage, ideal for indoor/outdoor.",
    imageUrl: "https://m.media-amazon.com/images/I/71MgbTPZBXL.jpg",
  },
  {
    name: "Wakefit Height Adjustable Study Desk",
    category: "Home",
    subcategory: "Furniture",
    brand: "Wakefit",
    price: 8999,
    stock: 25,
    rating: 4.4,
    description: "Electric height adjustment, cable management tray, anti-scratch surface.",
    imageUrl: "https://m.media-amazon.com/images/I/71t2Xex2RpL.jpg",
  },

  // ── HOME ─ Kitchen ───────────────────────────────────────────────
  {
    name: "Prestige Iris 750W Mixer Grinder 3 Jars",
    category: "Home",
    subcategory: "Kitchen",
    brand: "Prestige",
    price: 2299,
    stock: 100,
    rating: 4.4,
    description: "750W motor, 3 stainless steel jars, anti-drip coupler, 5-year warranty.",
    imageUrl: "https://m.media-amazon.com/images/I/71Sty-2WWKL.jpg",
  },
  {
    name: "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
    category: "Home",
    subcategory: "Kitchen",
    brand: "Instant Pot",
    price: 7999,
    stock: 35,
    rating: 4.6,
    description: "Pressure cooker, slow cooker, rice cooker, steamer, saut\u00e9, warmer.",
    imageUrl: "https://m.media-amazon.com/images/I/71V1C2GpSNL.jpg",
  },

  // ── HOME ─ Decor ──────────────────────────────────────────────────
  {
    name: "Tied Ribbons Wall Clock Modern Art",
    category: "Home",
    subcategory: "Decor",
    brand: "Tied Ribbons",
    price: 699,
    stock: 150,
    rating: 4.0,
    description: "Silent sweep movement, metal hands, MDF frame, 12 inch diameter.",
    imageUrl: "https://m.media-amazon.com/images/I/71vGFiTDXVL.jpg",
  },
  {
    name: "Pepperfry Ceramic Pot Planter Set of 3",
    category: "Home",
    subcategory: "Decor",
    brand: "Pepperfry",
    price: 1199,
    stock: 60,
    rating: 4.3,
    description: "Hand-painted ceramic, drainage hole, modern minimalist design.",
    imageUrl: "https://m.media-amazon.com/images/I/61+1BBHH7QL.jpg",
  },

  // ── SPORTS ─ Cricket ─────────────────────────────────────────────
  {
    name: "SS Ton Kashmir Willow Cricket Bat",
    category: "Sports",
    subcategory: "Cricket",
    brand: "SS",
    price: 1599,
    stock: 70,
    rating: 4.3,
    description: "Grade 1 Kashmir willow, full size, ideal for turf and tape ball.",
    imageUrl: "https://m.media-amazon.com/images/I/71XmL+w+JsL.jpg",
  },
  {
    name: "SG Test Cricket Ball Red Pack of 3",
    category: "Sports",
    subcategory: "Cricket",
    brand: "SG",
    price: 799,
    stock: 200,
    rating: 4.5,
    description: "Premium quality, hand-stitched seam, 5.5 oz, tournament grade.",
    imageUrl: "https://m.media-amazon.com/images/I/51YUHZ7rHAL.jpg",
  },

  // ── SPORTS ─ Football ────────────────────────────────────────────
  {
    name: "Nivia Storm Football Size 5",
    category: "Sports",
    subcategory: "Football",
    brand: "Nivia",
    price: 699,
    stock: 120,
    rating: 4.2,
    description: "32-panel design, machine stitched, butyl bladder, all-weather use.",
    imageUrl: "https://m.media-amazon.com/images/I/61YP2RfpC5L.jpg",
  },

  // ── SPORTS ─ Fitness ─────────────────────────────────────────────
  {
    name: "Boldfit Resistance Bands Set of 5",
    category: "Sports",
    subcategory: "Fitness",
    brand: "Boldfit",
    price: 499,
    stock: 300,
    rating: 4.4,
    description: "5 resistance levels, latex-free, includes carrying bag and door anchor.",
    imageUrl: "https://m.media-amazon.com/images/I/71JWKpjIe3L.jpg",
  },
  {
    name: "Kore PVC Dumbbells 10KG Pair",
    category: "Sports",
    subcategory: "Fitness",
    brand: "Kore",
    price: 1299,
    stock: 90,
    rating: 4.3,
    description: "PVC coated, anti-slip grip, fixed weight, ideal for home workouts.",
    imageUrl: "https://m.media-amazon.com/images/I/71lJGVGzMBL.jpg",
  },
  {
    name: "Strauss Yoga Mat Anti-Slip 6mm",
    category: "Sports",
    subcategory: "Fitness",
    brand: "Strauss",
    price: 699,
    stock: 180,
    rating: 4.2,
    description: "6mm thick, non-slip surface, moisture resistant, includes carry strap.",
    imageUrl: "https://m.media-amazon.com/images/I/61fvMp8SSVL.jpg",
  },
];

// ── Runner ──────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n\ud83c\udf31  Seeding ${products.length} products to ${BASE_URL}\n`);
  let success = 0;
  let fail = 0;

  for (const product of products) {
    try {
      await axios.post(BASE_URL, product);
      console.log(`  \u2705 ${product.category.padEnd(12)} | ${product.name}`);
      success++;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.log(`  \u274c FAILED  | ${product.name} \u2014 ${msg}`);
      fail++;
    }
  }

  console.log(`\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`);
  console.log(`  \u2705 Inserted : ${success}`);
  console.log(`  \u274c Failed   : ${fail}`);
  console.log(`\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n`);
}

seed();

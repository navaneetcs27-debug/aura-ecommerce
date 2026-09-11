const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");

const SEED_PRODUCTS = [
  {
    name: "Beige Jogger",
    category: "Pants",
    price: 30,
    stock: 24,
    imageUrl: "/images/products/beige_jogger(men).jpg",
    description: "Casual jogger made of 100% cotton jersey knit fabric. Perfect for running, lounging, or styling with your favorite streetwear kicks. Features elastic waistband, adjustable drawstring, and deep pockets."
  },
  {
    name: "Beige Sweater",
    category: "Sweaters",
    price: 78,
    stock: 15,
    imageUrl: "/images/products/beige_sweater(men).jpg",
    description: "Minimalist sweater knitted from 100% combed organic cotton with a comfortable ribbed neck, structured cuffs, and straight hemline."
  },
  {
    name: "Black Blouse",
    category: "Blouses",
    price: 80,
    stock: 30,
    imageUrl: "/images/products/black_blouse.jpg",
    description: "An elegant black blouse featuring delicate silhouette shaping, premium breathable cotton, and sleek modern button accents."
  },
  {
    name: "Black Coat",
    category: "Coats",
    price: 200,
    stock: 8,
    imageUrl: "/images/products/black_coat.jpg",
    description: "Timeless outerwear tailoring with high-grade thermal lining, deep flap pockets, and a detachable cinching waist belt."
  },
  {
    name: "Black Coat Long",
    category: "Coats",
    price: 250,
    stock: 10,
    imageUrl: "/images/products/black_coat(1).jpg",
    description: "Floor-length heavy wool coat crafted for extreme elegance and winter warmth with double-breasted horn buttons."
  },
  {
    name: "Black Dress",
    category: "Dresses",
    price: 130,
    stock: 18,
    imageUrl: "/images/products/black_dress.jpg",
    description: "Chic little black dress designed with subtle waist darting, side seam pockets, and a flattering scoop neckline."
  },
  {
    name: "Brown Coat",
    category: "Coats",
    price: 180,
    stock: 12,
    imageUrl: "/images/products/brown_coat.jpg",
    description: "Rich camel brown trench coat made with waterproof gabardine weave and tortoiseshell buckle details."
  },
  {
    name: "Checkered Pants",
    category: "Pants",
    price: 65,
    stock: 20,
    imageUrl: "/images/products/checkered_pants.jpg",
    description: "Modern tartan-patterned trousers featuring a tapered slim leg, pressed pleats, and comfortable stretch waistband."
  },
  {
    name: "Emerald Green Handbag",
    category: "Accessories",
    price: 95,
    stock: 14,
    imageUrl: "/images/products/green_bag.jpg",
    description: "Structured vegan leather tote bag with gold-tone hardware, magnetic closure, and removable shoulder strap."
  },
  {
    name: "Green Blouse",
    category: "Blouses",
    price: 75,
    stock: 22,
    imageUrl: "/images/products/green_blouse.jpg",
    description: "Sage green relaxed satin blouse with bishop sleeves and subtle mother-of-pearl buttons."
  },
  {
    name: "Forest Green Dress",
    category: "Dresses",
    price: 145,
    stock: 16,
    imageUrl: "/images/products/green_dress.jpg",
    description: "Flowy emerald evening dress made with sustainable viscose blend and adjustable tie-back strap detailing."
  },
  {
    name: "Green Casual Shirt",
    category: "Shirts",
    price: 55,
    stock: 25,
    imageUrl: "/images/products/green_shirt(men).jpg",
    description: "Olive linen-cotton blend casual button-down shirt designed with breathable open collar."
  },
  {
    name: "Grey Oxford Shirt",
    category: "Shirts",
    price: 58,
    stock: 28,
    imageUrl: "/images/products/grey_shirt(men).jpg",
    description: "Classic grey textured oxford cotton shirt with button-down collar and curved hemline."
  },
  {
    name: "Navy Joggers",
    category: "Pants",
    price: 35,
    stock: 32,
    imageUrl: "/images/products/navy_jogger_patn(men).jpg",
    description: "Deep navy athletic track pants with fleece lining, zippered side pockets, and ribbed cuffs."
  },
  {
    name: "Pastel Pink Blouse",
    category: "Blouses",
    price: 70,
    stock: 19,
    imageUrl: "/images/products/pink_blouse.jpg",
    description: "Soft blush pink chiffon top with subtle pleated collar and lightweight drape."
  },
  {
    name: "Pink Pastel Overcoat",
    category: "Coats",
    price: 210,
    stock: 9,
    imageUrl: "/images/products/pink_coat.jpg",
    description: "Statement pastel wool blend overcoat with notched lapels and satin interior lining."
  },
  {
    name: "Pink Silk Pyjama Set",
    category: "Loungewear",
    price: 60,
    stock: 21,
    imageUrl: "/images/products/pink_pyjamas.jpg",
    description: "Ultra-luxurious mulberry satin pajama set with contrast white piping and elastic waistband."
  },
  {
    name: "Salmon Casual Shirt",
    category: "Shirts",
    price: 52,
    stock: 26,
    imageUrl: "/images/products/pink_shirt(men).jpg",
    description: "Casual salmon pink slim-fit linen shirt tailored for warmer days and evening gatherings."
  },
  {
    name: "Plaid Pleated Skirt",
    category: "Skirts",
    price: 68,
    stock: 17,
    imageUrl: "/images/products/plaid_skirt.jpg",
    description: "Classic high-waisted pleated tartan skirt with hidden side zip and built-in safety lining."
  },
  {
    name: "Ruby Red Trench Coat",
    category: "Coats",
    price: 220,
    stock: 11,
    imageUrl: "/images/products/red_coat.jpg",
    description: "Bold crimson trench coat with storm flap, belted cuffs, and deep storm-resistant collar."
  },
  {
    name: "Ivory Silk Blouse",
    category: "Blouses",
    price: 85,
    stock: 23,
    imageUrl: "/images/products/white_blouse(1).jpg",
    description: "Pristine white silk crepe blouse with concealed front placket and French cuffs."
  },
  {
    name: "Classic White Blouse",
    category: "Blouses",
    price: 78,
    stock: 27,
    imageUrl: "/images/products/white_blouse.jpg",
    description: "Everyday staple cotton poplin button-up blouse with reinforced stitching and sharp collar."
  },
  {
    name: "Tailored White Trousers",
    category: "Pants",
    price: 72,
    stock: 19,
    imageUrl: "/images/products/white_pants.jpg",
    description: "Crisp white straight-leg tailored trousers with slant pockets and belt loops."
  },
  {
    name: "Signature White Shirt",
    category: "Shirts",
    price: 60,
    stock: 35,
    imageUrl: "/images/products/white_shirt(men).jpg",
    description: "Premium Egyptian cotton dress shirt with classic spread collar and single-cuff finish."
  }
];

async function seedDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI is missing in backend/.env");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected successfully.");

    // 1. Seed Users
    console.log("⏳ Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { email: "alex@example.com" },
      {
        name: "Alex Johnson",
        email: "alex@example.com",
        password: hashedPassword,
        role: "user"
      },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate(
      { email: "admin@aurastyle.com" },
      {
        name: "Aura Admin",
        email: "admin@aurastyle.com",
        password: hashedAdminPassword,
        role: "admin"
      },
      { upsert: true, new: true }
    );
    console.log("✅ Users seeded: alex@example.com (user), admin@aurastyle.com (admin)");

    // 2. Seed Products
    console.log("⏳ Seeding products...");
    let createdCount = 0;
    for (const item of SEED_PRODUCTS) {
      await Product.findOneAndUpdate(
        { name: item.name },
        item,
        { upsert: true, new: true }
      );
      createdCount++;
    }
    console.log(`✅ ${createdCount} Products synchronized in MongoDB!`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowProductionSeed = process.env.ALLOW_PRODUCTION_SEED === 'true';

  if (isProduction && !allowProductionSeed) {
    throw new Error(
      'Refusing to run destructive seed in production. Set ALLOW_PRODUCTION_SEED=true only if you intentionally want demo data.'
    );
  }

  console.log('Seeding database with realistic records...');
  
  // Wipe existing
  await prisma.wishlist.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('Secure@123', salt);

  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@ratex.com',
      password,
      address: 'Admin Headquarters, 123 Main St',
      role: 'ADMIN'
    }
  });

  const normal1 = await prisma.user.create({
    data: {
      name: 'John Customer',
      email: 'john.c@mail.com',
      password,
      address: '101 Residential Blvd',
      role: 'NORMAL'
    }
  });

  const normal2 = await prisma.user.create({
    data: {
      name: 'Sarah Customer',
      email: 'sarah.c@mail.com',
      password,
      address: '202 Oak Avenue',
      role: 'NORMAL'
    }
  });

  const storeData = [
    { name: "H&M", address: "Downtown Silicon Plaza", type: "tech", description: "Affordable fashion for men, women, and kids. Discover the latest trends with sustainable style choices and exclusive designer collaborations that keep you looking fresh every season." },
    { name: "Zara", address: "North Mall Annex", type: "retail", description: "Fast fashion at its finest. Zara brings runway-inspired designs to your wardrobe at accessible prices, with new collections dropping weekly to keep your style ahead of the curve." },
    { name: "Apple Store", address: "15 Fashion Ave", type: "tech", description: "Experience the world of Apple. Explore the latest iPhones, MacBooks, and accessories with hands-on demos, expert advice, and Genius Bar support to keep your devices running perfectly." },
    { name: "Nike Town", address: "42 Library St", type: "retail", description: "Just Do It. Nike Town offers a premium selection of athletic footwear, apparel, and gear for every sport. Customize your kicks at the Nike By You station and train like a champion." },
    { name: "Starbucks", address: "8 Morning Drive", type: "cafe", description: "Your daily dose of handcrafted coffee. From classic espresso to seasonal specialties, enjoy premium beverages and fresh pastries in a cozy atmosphere perfect for work or relaxation." },
    { name: "Best Buy", address: "Level 2, Arcadia Mall", type: "tech", description: "Your one-stop electronics destination. Find the latest TVs, laptops, gaming consoles, and smart home devices with expert consultation and competitive pricing on top tech brands." },
    { name: "Whole Foods", address: "99 Health Blvd", type: "grocery", description: "Organic, natural, and responsibly sourced groceries. Whole Foods Market provides premium produce, artisan cheeses, sustainable seafood, and a hot bar with chef-prepared meals daily." },
    { name: "Home Depot", address: "Warehouse District 4", type: "hardware", description: "Everything for your home improvement projects. From power tools to garden supplies, Home Depot has the materials, expertise, and workshops to help you build, repair, and renovate." },
    { name: "Adidas", address: "Shoe District, 7", type: "retail", description: "Impossible is nothing. Adidas combines sport performance with street style. Explore iconic sneakers like Ultraboost and Stan Smith, plus premium sportswear for training and lifestyle." },
    { name: "Barnes & Noble", address: "123 Geek Street", type: "books", description: "A haven for book lovers. Browse thousands of titles across every genre, discover rare finds, enjoy a café latte, and attend author events and book signings throughout the year." },
    { name: "Red Lobster", address: "Pier 39", type: "restaurant", description: "Fresh seafood served with passion. Enjoy hand-cracked lobster, snow crab legs, and signature Cheddar Bay Biscuits in a welcoming waterfront-style dining experience for the whole family." },
    { name: "Planet Fitness", address: "Power Center, Unit A", type: "gym", description: "The Judgement Free Zone. Planet Fitness offers a clean, welcoming gym environment with state-of-the-art cardio and strength equipment, free fitness training, and 24/7 access." },
    { name: "IKEA", address: "Spring Garden West", type: "retail", description: "Affordable home furnishing solutions with Scandinavian design. Walk through inspiring room setups, grab flat-pack furniture, and refuel at the iconic Swedish food court along the way." },
    { name: "Samsung Experience", address: "Tech Hub Sector", type: "tech", description: "Discover Samsung's innovative ecosystem. Try the latest Galaxy smartphones, tablets, wearables, and smart home devices in an interactive showroom designed to inspire and connect." },
    { name: "Urban Outfitters", address: "Retro Alley", type: "clothing", description: "Curated lifestyle brand for the free-spirited. Shop vintage-inspired clothing, quirky home décor, vinyl records, and unique gifts that celebrate individuality and creative expression." },
    { name: "Dunkin Donuts", address: "Coffee Corner", type: "cafe", description: "America runs on Dunkin'. Grab freshly brewed coffee, espresso drinks, and a wide variety of donuts, bagels, and breakfast sandwiches to fuel your morning in record time." },
    { name: "AutoZone", address: "Motorway 66", type: "hardware", description: "Get in the zone with AutoZone. Find auto parts, accessories, and maintenance supplies for every vehicle. Free battery testing, loaner tools, and expert advice keep you on the road." },
    { name: "Panera Bread", address: "Sugar Lane", type: "bakery", description: "Fresh-baked bread and wholesome meals. Panera serves artisan sandwiches, warm soups, crisp salads, and indulgent pastries made with clean ingredients you can feel good about." },
    { name: "Dave & Buster's", address: "Cyber District", type: "entertainment", description: "Eat, drink, play, and watch. Dave & Buster's combines a premium restaurant with the latest arcade games, virtual reality, and live sports viewing for the ultimate entertainment experience." },
    { name: "Sephora", address: "Beauty Hub", type: "service", description: "Beauty for all. Sephora curates the world's best skincare, makeup, and fragrance brands. Enjoy personalized consultations, free makeovers, and exclusive product launches in-store." }
  ];

  for (let i = 0; i < storeData.length; i++) {
    const s = storeData[i];
    
    // Each store requires exactly 1 unique owner
    const owner = await prisma.user.create({
      data: {
        name: `${s.name.split(' ')[0]} Owner`,
        email: `owner${i+1}@${s.type}.com`,
        password,
        address: `Manager HQ of ${s.name}`,
        role: 'STORE_OWNER'
      }
    });

    const averageRating = parseFloat(((Math.random() * 3) + 2).toFixed(2));
    
    // Using picsum photos seeded by store name so it stays consistent between regenerations
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(s.name.replace(/\s+/g, ''))}/400/250`;

    await prisma.store.create({
      data: {
        name: s.name,
        email: `contact@${s.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`,
        address: s.address,
        description: s.description,
        ownerId: owner.id,
        averageRating,
        imageUrl
      }
    });
  }

  // Create a couple of ratings bound to the normal users
  const allStores = await prisma.store.findMany();
  
  if (allStores.length >= 2) {
    await prisma.rating.create({
      data: { value: 4, userId: normal1.id, storeId: allStores[0].id }
    });
    
    await prisma.rating.create({
      data: { value: 5, userId: normal2.id, storeId: allStores[0].id }
    });

    await prisma.rating.create({
      data: { value: 3, userId: normal1.id, storeId: allStores[1].id }
    });
    
    // Give normal1 a wishlist item securely 
    await prisma.wishlist.create({
      data: { userId: normal1.id, storeId: allStores[5].id }
    });
  }

  console.log('Seeding completed successfully!');
  console.log('Dummy credentials for all accounts:');
  console.log('Password: Secure@123');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient, UserRole, HuntStatus, RewardType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@localtreasure.app' },
    update: {},
    create: {
      email: 'admin@localtreasure.app',
      displayName: 'Admin User',
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  // Create demo business user
  const businessUser = await prisma.user.upsert({
    where: { email: 'demo@business.com' },
    update: {},
    create: {
      email: 'demo@business.com',
      displayName: 'Demo Business Owner',
      role: UserRole.BUSINESS,
      isVerified: true,
    },
  });

  // Create demo business
  const demoBusiness = await prisma.business.upsert({
    where: { userId: businessUser.id },
    update: {},
    create: {
      userId: businessUser.id,
      name: 'Demo Coffee Shop',
      description: 'A cozy coffee shop in downtown San Francisco',
      website: 'https://democoffee.com',
      phone: '+1-555-0123',
      address: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      isVerified: true,
    },
  });

  // Create more demo businesses
  const businesses = [
    {
      name: 'Pizza Palace',
      description: 'Authentic Italian pizza in the heart of the city',
      address: '456 Union Square',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94108',
    },
    {
      name: 'Tech Bookstore',
      description: 'Books for developers and tech enthusiasts',
      address: '789 Mission Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
    },
    {
      name: 'Fitness First Gym',
      description: 'Premium fitness center with modern equipment',
      address: '321 Folsom Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
    },
    {
      name: 'Artisan Bakery',
      description: 'Fresh baked goods made daily',
      address: '654 Valencia Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110',
    },
  ];

  const createdBusinesses = [];
  for (const businessData of businesses) {
    const user = await prisma.user.create({
      data: {
        email: `${businessData.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
        displayName: `${businessData.name} Owner`,
        role: UserRole.BUSINESS,
        isVerified: true,
      },
    });

    const business = await prisma.business.create({
      data: {
        ...businessData,
        userId: user.id,
        isVerified: true,
      },
    });

    createdBusinesses.push(business);
  }

  // Create demo hunts
  const allBusinesses = [demoBusiness, ...createdBusinesses];
  
  for (const business of allBusinesses) {
    const hunt = await prisma.hunt.create({
      data: {
        businessId: business.id,
        title: `${business.name} Treasure Hunt`,
        description: `Find hidden treasures around ${business.name} and unlock exclusive rewards!`,
        status: HuntStatus.ACTIVE,
        startAt: new Date(),
        endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isPremium: false,
        maxClaims: 1000,
      },
    });

    // Create loot boxes for each hunt (around San Francisco)
    const lootBoxes = [
      {
        title: 'Welcome Bonus',
        description: 'Get 10% off your first order!',
        lat: 37.7749 + (Math.random() - 0.5) * 0.01, // Random location near SF
        lng: -122.4194 + (Math.random() - 0.5) * 0.01,
        rewardType: RewardType.DISCOUNT,
        rewardPayload: JSON.stringify({ discount: 10, type: 'percentage' }),
        hint: 'Look for the treasure near the main entrance',
      },
      {
        title: 'Free Item',
        description: 'Get a free item of your choice!',
        lat: 37.7749 + (Math.random() - 0.5) * 0.01,
        lng: -122.4194 + (Math.random() - 0.5) * 0.01,
        rewardType: RewardType.FREE_ITEM,
        rewardPayload: JSON.stringify({ item: 'any', maxValue: 15 }),
        hint: 'Hidden treasure awaits the curious explorer',
      },
    ];

    for (const lootBoxData of lootBoxes) {
      await prisma.lootBox.create({
        data: {
          ...lootBoxData,
          huntId: hunt.id,
          radiusMeters: 30,
          maxClaims: 100,
        },
      });
    }
  }

  // Create demo regular users
  const demoUsers = [
    {
      email: 'user1@example.com',
      displayName: 'Alice Johnson',
    },
    {
      email: 'user2@example.com',
      displayName: 'Bob Smith',
    },
    {
      email: 'user3@example.com',
      displayName: 'Carol Davis',
    },
  ];

  for (const userData of demoUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        role: UserRole.USER,
        isVerified: true,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('📧 Admin email: admin@localtreasure.app');
  console.log('📧 Demo business email: demo@business.com');
  console.log('🏢 Created 5 demo businesses with treasure hunts');
  console.log('👥 Created 3 demo users');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fstates.dev' },
    update: {},
    create: {
      name: 'Site Admin',
      email: 'admin@fstates.dev',
      password,
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@fstates.dev' },
    update: {},
    create: {
      name: 'Sample Customer',
      email: 'customer@fstates.dev',
      password,
      role: 'CUSTOMER',
      defaultShipping: {
        fullName: 'Sample Customer',
        address: '123 Market Street',
        city: 'Commerce City',
        postalCode: '12345'
      }
    }
  });

  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { name: 'Audio' },
      update: {},
      create: { name: 'Audio' }
    }),
    prisma.category.upsert({
      where: { name: 'Home Office' },
      update: {},
      create: { name: 'Home Office' }
    }),
    prisma.category.upsert({
      where: { name: 'Fitness' },
      update: {},
      create: { name: 'Fitness' }
    })
  ]);

  const [audio, homeOffice, fitness] = categories;

  const products = [
    {
      name: 'Aurora Wireless Earbuds',
      shortDescription: 'Noise cancelling earbuds with 24-hour battery life.',
      description:
        'Experience immersive audio with adaptive noise cancellation, wireless charging, and IPX5 water resistance.',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1585386959984-a4155229a1c6',
      sku: 'AUR-EB-01',
      brand: 'Aurora Labs',
      tags: ['audio', 'wireless', 'bluetooth'],
      rating: 4.6,
      categoryId: audio.id,
      inventory: { create: { quantity: 42 } }
    },
    {
      name: 'Nimbus Standing Desk',
      shortDescription: 'Electric standing desk with programmable presets.',
      description:
        'Transition smoothly between sitting and standing with whisper-quiet motors, cable management, and integrated charging ports.',
      price: 649.0,
      image: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5',
      sku: 'NIM-DESK-02',
      brand: 'Nimbus Work',
      tags: ['office', 'ergonomics'],
      rating: 4.8,
      categoryId: homeOffice.id,
      inventory: { create: { quantity: 15 } }
    },
    {
      name: 'Pulse Pro Smartwatch',
      shortDescription: 'Advanced fitness tracking with 7-day battery.',
      description:
        'Track workouts, heart rate variability, sleep stages, and recovery insights with seamless phone integration.',
      price: 329.5,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
      sku: 'PUL-WATCH-03',
      brand: 'Pulse Labs',
      tags: ['fitness', 'wearable'],
      rating: 4.4,
      categoryId: fitness.id,
      inventory: { create: { quantity: 60 } }
    },
    {
      name: 'Lumen Desk Lamp',
      shortDescription: 'Adjustable LED lamp with wireless charging base.',
      description:
        'Customize brightness and color temperature with touch controls while powering devices from the built-in Qi charger.',
      price: 129.0,
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      sku: 'LUM-LAMP-04',
      brand: 'Lumen Studio',
      tags: ['lighting', 'office'],
      rating: 4.2,
      categoryId: homeOffice.id,
      inventory: { create: { quantity: 8 } }
    }
  ];

  await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { sku: product.sku },
        update: {
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price,
          image: product.image,
          brand: product.brand,
          tags: product.tags,
          rating: product.rating,
          categoryId: product.categoryId,
          inventory: {
            upsert: {
              create: { quantity: product.inventory.create.quantity },
              update: { quantity: product.inventory.create.quantity }
            }
          }
        },
        create: product
      })
    )
  );

  console.log(`Seeded admin ${admin.email} and customer ${customer.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

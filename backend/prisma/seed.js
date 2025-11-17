import { PrismaClient, Prisma } from '@prisma/client';
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

  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      line1: '123 Market Street',
      city: 'Commerce City',
      postalCode: '12345',
      country: 'United States',
      isDefaultShipping: true
    }
  });

  await prisma.paymentInstrument.create({
    data: {
      userId: customer.id,
      provider: 'stripe',
      brand: 'Visa',
      last4: '4242',
      expiresMonth: 12,
      expiresYear: new Date().getFullYear() + 3,
      providerPaymentMethodId: 'pm_seed_4242',
      isDefault: true
    }
  });

  await prisma.notificationPreference.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      orderUpdatesEmail: true,
      orderUpdatesPush: true,
      promotionsEmail: false,
      promotionsPush: false
    }
  });

  await prisma.profileSetting.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      language: 'en',
      currency: 'USD',
      region: 'United States'
    }
  });

  const categories = await prisma.$transaction([
    prisma.category.upsert({
      where: { name: 'Women' },
      update: {},
      create: { name: 'Women' }
    }),
    prisma.category.upsert({
      where: { name: 'Men' },
      update: {},
      create: { name: 'Men' }
    }),
    prisma.category.upsert({
      where: { name: 'Kids' },
      update: {},
      create: { name: 'Kids' }
    }),
    prisma.category.upsert({
      where: { name: 'Accessories' },
      update: {},
      create: { name: 'Accessories' }
    }),
    prisma.category.upsert({
      where: { name: 'Footwear' },
      update: {},
      create: { name: 'Footwear' }
    })
  ]);

  const [women, men, kids, accessories, footwear] = categories;

  const products = [
    {
      name: 'Celeste Silk Slip Dress',
      shortDescription: 'Bias-cut silk midi with luminous sheen and open back detail.',
      description:
        'The Celeste Slip is cut on the bias for fluid drape and finished with adjustable straps, French seams, and a gentle cowl neckline. Crafted in 22mm silk charmeuse with a sustainable cupro lining, it elevates every evening with understated glamour.',
      price: 389,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      heroImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
      galleryImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
        'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb'
      ],
      sku: 'FS-WDR-001',
      brand: 'Fable Studio',
      tags: ['evening', 'silk', 'minimal'],
      rating: 4.9,
      categoryId: women.id,
      audience: 'WOMEN',
      colorOptions: ['midnight', 'champagne', 'rosewater'],
      sizeOptions: ['xs', 's', 'm', 'l', 'xl'],
      materials: ['silk charmeuse', 'cupro lining'],
      fit: 'Slim bias-cut fit that skims the body',
      care: 'Dry clean only',
      style: 'Evening Capsule',
      badges: ['statement', 'editorial'],
      isFeatured: true,
      isNewArrival: true,
      inventory: { create: { quantity: 18 } }
    },
    {
      name: 'Meridian Italian Wool Blazer',
      shortDescription: 'Double-breasted blazer with sculpted shoulders and horn buttons.',
      description:
        'A softly structured blazer tailored in Vitale Barberis Canonico wool with hand-finished pick stitching, half-canvas construction, and a buttery Bemberg lining. Wear it layered over denim or trousers for effortless polish.',
      price: 428,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixid=blazer',
      heroImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=blazer-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1521334884684-d80222895322',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1'
      ],
      sku: 'FS-MBL-201',
      brand: 'North & Field',
      tags: ['tailoring', 'wool', 'wardrobe'],
      rating: 4.7,
      categoryId: men.id,
      audience: 'MEN',
      colorOptions: ['charcoal', 'navy'],
      sizeOptions: ['36', '38', '40', '42', '44'],
      materials: ['virgin wool', 'bemberg lining', 'horn buttons'],
      fit: 'Tailored fit with soft shoulder structure',
      care: 'Dry clean recommended',
      style: 'City Capsule',
      badges: ['bestseller', 'capsule'],
      isFeatured: true,
      isNewArrival: true,
      inventory: { create: { quantity: 24 } }
    },
    {
      name: 'Atlas Relaxed Cargo Trouser',
      shortDescription: 'Tapered trouser with utility pockets crafted in brushed cotton.',
      description:
        'Atlas is cut from enzyme-washed organic cotton for a lived-in feel, featuring pleated knees, tonal matte hardware, and adjustable cuffs for styling versatility. Pair it with relaxed shirting for a modern utilitarian silhouette.',
      price: 168,
      image: 'https://images.unsplash.com/photo-1521334884684-d80222895322',
      heroImage: 'https://images.unsplash.com/photo-1523380744952-b72d1b2463ab',
      galleryImages: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'
      ],
      sku: 'FS-MTR-208',
      brand: 'North & Field',
      tags: ['utility', 'cotton', 'casual'],
      rating: 4.6,
      categoryId: men.id,
      audience: 'MEN',
      colorOptions: ['stone', 'sage', 'black'],
      sizeOptions: ['28', '30', '32', '34', '36'],
      materials: ['organic cotton', 'recycled trims'],
      fit: 'Relaxed through the hip with a tapered leg',
      care: 'Machine wash cold, tumble dry low',
      style: 'Utility Capsule',
      badges: ['capsule'],
      isFeatured: false,
      isNewArrival: true,
      inventory: { create: { quantity: 40 } }
    },
    {
      name: 'Solstice Wrap Skirt',
      shortDescription: 'Luxe wrap skirt cut from sand-washed cupro with side tie.',
      description:
        'A fluid midi skirt designed with asymmetric panels and French seams, secured by a brushed metal D-ring. The sand-washed cupro drapes effortlessly while offering breathable comfort during warmer evenings.',
      price: 218,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=skirt',
      heroImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=skirt-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=skirt-gallery1',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixid=skirt-gallery2'
      ],
      sku: 'FS-WSK-112',
      brand: 'Fable Studio',
      tags: ['skirts', 'cupro', 'wrap'],
      rating: 4.5,
      categoryId: women.id,
      audience: 'WOMEN',
      colorOptions: ['terracotta', 'sand'],
      sizeOptions: ['xs', 's', 'm', 'l'],
      materials: ['cupro', 'organic cotton tie'],
      fit: 'High-rise wrap silhouette with adjustable waist',
      care: 'Machine wash cold, line dry',
      style: 'Capsule Wardrobe',
      badges: ['capsule'],
      isFeatured: false,
      isNewArrival: true,
      inventory: { create: { quantity: 32 } }
    },
    {
      name: 'Nova Recycled Puffer Vest',
      shortDescription: 'Ultralight puffer vest with recycled fill and water-repellent shell.',
      description:
        'The Nova Vest layers seamlessly over knitwear with its sculpted funnel neck, double-zip closure, and quilted channels. Made with 100% recycled nylon and PrimaLoft insulation, it balances warmth with breathability for transitional forecasts.',
      price: 198,
      image: 'https://images.unsplash.com/photo-1487412720507-7bdc3f976c5b',
      heroImage: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01',
      galleryImages: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d'
      ],
      sku: 'FS-UVS-305',
      brand: 'Arcadia Atelier',
      tags: ['outerwear', 'recycled', 'layering'],
      rating: 4.8,
      categoryId: accessories.id,
      audience: 'UNISEX',
      colorOptions: ['ecru', 'oak moss', 'carbon'],
      sizeOptions: ['xs', 's', 'm', 'l', 'xl'],
      materials: ['recycled nylon', 'primaloft fill'],
      fit: 'Cropped fit designed to layer over knitwear',
      care: 'Spot clean or dry clean',
      style: 'Active Capsule',
      badges: ['sustainable', 'capsule'],
      isFeatured: false,
      isNewArrival: false,
      inventory: { create: { quantity: 28 } }
    },
    {
      name: 'Cascade Linen Resort Shirt',
      shortDescription: 'Breathable camp collar shirt woven from European flax.',
      description:
        'Cascade is woven in Portugal using certified European flax for softness that improves with wear. It features corozo nut buttons, a relaxed camp collar, and side vents that pair effortlessly with tailored or casual bottoms.',
      price: 138,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=shirt',
      heroImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=shirt-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=shirt-gallery1',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixid=shirt-gallery2'
      ],
      sku: 'FS-MSH-214',
      brand: 'North & Field',
      tags: ['linen', 'shirts', 'summer'],
      rating: 4.4,
      categoryId: men.id,
      audience: 'MEN',
      colorOptions: ['sea glass', 'optic white', 'sandstone'],
      sizeOptions: ['s', 'm', 'l', 'xl', 'xxl'],
      materials: ['european flax linen', 'corozo buttons'],
      fit: 'Relaxed fit with draped sleeves',
      care: 'Machine wash cold, hang to dry',
      style: 'Resort Capsule',
      badges: ['resort'],
      isFeatured: false,
      isNewArrival: false,
      inventory: { create: { quantity: 55 } }
    },
    {
      name: 'Aurora Kids Cloud Puffer',
      shortDescription: 'Lightweight kids puffer with detachable hood and reflective piping.',
      description:
        'Designed for little adventurers, the Aurora Puffer features recycled insulation, fleece-lined pockets, and storm cuffs to keep warmth in. Reflective piping ensures visibility on twilight walks.',
      price: 142,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=kidspuffer',
      heroImage: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixid=kidspuffer-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1478476868527-002ae3f3e159',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d'
      ],
      sku: 'FS-KOU-401',
      brand: 'Arcadia Atelier',
      tags: ['kids', 'outerwear', 'winter'],
      rating: 4.9,
      categoryId: kids.id,
      audience: 'KIDS',
      colorOptions: ['sky blue', 'rose dusk'],
      sizeOptions: ['2', '4', '6', '8', '10'],
      materials: ['recycled polyester shell', 'recycled fill'],
      fit: 'Relaxed fit for layering with knitwear',
      care: 'Machine wash cold, tumble dry low',
      style: 'Play Capsule',
      badges: ['sustainable', 'statement'],
      isFeatured: false,
      isNewArrival: true,
      inventory: { create: { quantity: 35 } }
    },
    {
      name: 'Echo Cashmere Crew',
      shortDescription: 'Featherweight Mongolian cashmere sweater with engineered rib cuffs.',
      description:
        'Echo is knit from Grade-A Mongolian cashmere with a featherweight gauge, engineered rib cuffs, and a subtle roll-edge neckline. It layers seamlessly under blazers or over dresses for year-round luxury.',
      price: 248,
      image: 'https://images.unsplash.com/photo-1445633883498-7f9922d37a3f',
      heroImage: 'https://images.unsplash.com/photo-1487412720507-7bdc3f976c5b?ixid=cashmere-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1521334884684-d80222895322?ixid=cashmere-gallery1',
        'https://images.unsplash.com/photo-1445633883498-7f9922d37a3f?ixid=cashmere-gallery2'
      ],
      sku: 'FS-UCS-512',
      brand: 'Fable Studio',
      tags: ['knitwear', 'cashmere', 'essentials'],
      rating: 4.8,
      categoryId: accessories.id,
      audience: 'UNISEX',
      colorOptions: ['oat', 'ink', 'sage'],
      sizeOptions: ['xs', 's', 'm', 'l', 'xl'],
      materials: ['mongolian cashmere'],
      fit: 'Classic fit with gentle drape',
      care: 'Dry clean or hand wash cold and lay flat to dry',
      style: 'Capsule Wardrobe',
      badges: ['capsule', 'bestseller'],
      isFeatured: true,
      isNewArrival: false,
      inventory: { create: { quantity: 22 } }
    },
    {
      name: 'Stratus Leather Chelsea Boot',
      shortDescription: 'Italian leather boot with Vibram lug sole and elastic gore.',
      description:
        'Hand-finished in Tuscany, Stratus features a water-resistant suede upper, elastic gore panels, and a Vibram lug sole for traction. A memory foam insole adds all-day comfort without sacrificing silhouette.',
      price: 298,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixid=boot',
      heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=boot-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772',
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f'
      ],
      sku: 'FS-FTW-602',
      brand: 'Arcadia Atelier',
      tags: ['footwear', 'leather', 'chelsea'],
      rating: 4.6,
      categoryId: footwear.id,
      audience: 'UNISEX',
      colorOptions: ['espresso', 'black'],
      sizeOptions: ['36', '37', '38', '39', '40', '41', '42', '43', '44'],
      materials: ['italian leather', 'vibram sole'],
      fit: 'True to size with room for midweight socks',
      care: 'Spot clean with suede brush, use protector spray',
      style: 'City Capsule',
      badges: ['statement'],
      isFeatured: false,
      isNewArrival: false,
      inventory: { create: { quantity: 27 } }
    },
    {
      name: 'Lumen Alpaca Wrap Coat',
      shortDescription: 'Double-faced alpaca wrap coat with cascading lapel.',
      description:
        'An unstructured double-faced alpaca blend coat finished with hand-bound seams and an exaggerated collar. The self-tie belt allows for sculpting the waist, while deep welt pockets ensure functionality.',
      price: 562,
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=coat',
      heroImage: 'https://images.unsplash.com/photo-1523380744952-b72d1b2463ab?ixid=coat-hero',
      galleryImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixid=coat-gallery1',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixid=coat-gallery2'
      ],
      sku: 'FS-WCT-129',
      brand: 'Fable Studio',
      tags: ['outerwear', 'alpaca', 'wrap coat'],
      rating: 4.9,
      categoryId: women.id,
      audience: 'WOMEN',
      colorOptions: ['camel', 'midnight'],
      sizeOptions: ['xs', 's', 'm', 'l', 'xl'],
      materials: ['alpaca wool', 'virgin wool', 'viscose lining'],
      fit: 'Relaxed fit with removable belt',
      care: 'Dry clean recommended',
      style: 'Runway Capsule',
      badges: ['statement', 'runway'],
      isFeatured: true,
      isNewArrival: true,
      inventory: { create: { quantity: 12 } }
    }
  ];

  const seededProducts = await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { sku: product.sku },
        update: {
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price,
          image: product.image,
          heroImage: product.heroImage,
          galleryImages: product.galleryImages,
          brand: product.brand,
          tags: product.tags,
          rating: product.rating,
          categoryId: product.categoryId,
          audience: product.audience,
          colorOptions: product.colorOptions,
          sizeOptions: product.sizeOptions,
          materials: product.materials,
          fit: product.fit,
          care: product.care,
          style: product.style,
          badges: product.badges,
          isFeatured: product.isFeatured,
          isNewArrival: product.isNewArrival,
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

  if (seededProducts.length > 0) {
    const orderItemsData = seededProducts.slice(0, 2).map((product) => ({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
      selectedSize: product.sizeOptions?.[0] ?? null,
      selectedColor: product.colorOptions?.[0] ?? null
    }));
    const total = orderItemsData.reduce((sum, item) => sum + Number(item.unitPrice), 0);
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        total: new Prisma.Decimal(total.toFixed(2)),
        status: 'PROCESSING',
        paymentMethod: 'CARD',
        shippingAddress: {
          fullName: 'Sample Customer',
          address: '123 Market Street',
          city: 'Commerce City',
          postalCode: '12345'
        },
        items: {
          create: orderItemsData
        }
      },
      include: { items: { include: { product: true } } }
    });

    const primaryProduct = order.items[0]?.product;
    const conversationTitle = primaryProduct
      ? `Order #${order.id.slice(-4).toUpperCase()} · ${primaryProduct.name}`
      : `Order #${order.id.slice(-4).toUpperCase()}`;

    await prisma.conversation.create({
      data: {
        userId: customer.id,
        orderId: order.id,
        title: conversationTitle,
        lastMessagePreview: 'Payment confirmed.',
        lastMessageAt: new Date(),
        unreadForUser: 2,
        messages: {
          create: [
            {
              senderType: 'SYSTEM',
              kind: 'ORDER_STATUS',
              text: "We've received your order.",
              payload: { event: 'ORDER_PLACED', orderId: order.id },
              readByAdmin: new Date()
            },
            {
              senderType: 'SYSTEM',
              kind: 'ORDER_STATUS',
              text: 'Payment confirmed.',
              payload: { event: 'PAYMENT_CONFIRMED', orderId: order.id },
              readByAdmin: new Date()
            }
          ]
        }
      }
    });

    await prisma.conversation.create({
      data: {
        userId: customer.id,
        isSupport: true,
        title: 'Concierge support',
        lastMessagePreview: 'Our atelier is online 24/7.',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        unreadForUser: 0,
        messages: {
          create: [
            {
              senderType: 'ADMIN',
              kind: 'NOTE',
              text: 'Our atelier is online 24/7.',
              readByAdmin: new Date(),
              readByUser: new Date()
            }
          ]
        }
      }
    });
  }

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

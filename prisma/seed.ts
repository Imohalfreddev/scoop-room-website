/**
 * Seeds a real Postgres database (once DATABASE_URL is set and
 * `prisma migrate dev` has been run) using the exact same mock dataset
 * the standalone frontend uses. This gives you a working aggregator
 * database with realistic content on day one.
 *
 * Run with: npx prisma db seed
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { categories } from "../src/lib/mock/categories";
import { authors } from "../src/lib/mock/authors";
import { tags } from "../src/lib/mock/tags";
import { articles } from "../src/lib/mock/articles";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories…");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { slug: c.slug, name: c.name, description: c.description },
    });
  }

  console.log("Seeding tags…");
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: { slug: t.slug, name: t.name },
    });
  }

  console.log("Seeding authors as users…");
  for (const a of authors) {
    await prisma.user.upsert({
      where: { email: `${a.slug}@scoopr.example.com` },
      update: {},
      create: {
        email: `${a.slug}@scoopr.example.com`,
        name: a.name,
        passwordHash: "changeme", // replace with a real hash before enabling auth
        role: "AUTHOR",
        avatarUrl: a.avatarUrl,
        title: a.title,
        bio: a.bio,
        twitter: a.twitter,
      },
    });
  }

  console.log("Seeding articles…");
  for (const article of articles) {
    const author = await prisma.user.findUnique({
      where: { email: `${article.author.slug}@scoopr.example.com` },
    });
    const category = await prisma.category.findUnique({
      where: { slug: article.category.slug },
    });
    if (!author || !category) continue;

    const coverImage = await prisma.mediaAsset.create({
      data: {
        type: "IMAGE",
        url: article.coverImage,
        alt: article.title,
      },
    });

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        title: article.title,
        dek: article.dek,
        excerpt: article.excerpt,
        content: article.content,
        coverImageId: coverImage.id,
        categoryId: category.id,
        authorId: author.id,
        status: "PUBLISHED",
        featured: article.featured,
        trending: article.trending,
        publishedAt: new Date(article.publishedAt),
        readTimeMinutes: article.readTimeMinutes,
        views: article.views,
        tags: {
          connect: article.tags.map((t) => ({ slug: t.slug })),
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

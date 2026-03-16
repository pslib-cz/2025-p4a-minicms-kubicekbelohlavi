import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hash } from "bcryptjs";
import { ArticleStatus, PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await hash("DemoPassword123!", 10);

  await prisma.article.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: "Alice Editor",
      email: "alice@example.com",
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&q=80",
    },
  });

  const pavel = await prisma.user.create({
    data: {
      name: "Pavel Curator",
      email: "pavel@example.com",
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=512&q=80",
    },
  });

  const [guides, reviews, photography, workflows] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Guides",
        slug: "guides",
        ownerId: alice.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Reviews",
        slug: "reviews",
        ownerId: alice.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Photography",
        slug: "photography",
        ownerId: pavel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Workflows",
        slug: "workflows",
        ownerId: pavel.id,
      },
    }),
  ]);

  const [nextjs, prismaTag, ux, performance, storytelling] = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Next.js",
        slug: "nextjs",
        ownerId: alice.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Prisma",
        slug: "prisma",
        ownerId: alice.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "UX",
        slug: "ux",
        ownerId: alice.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Performance",
        slug: "performance",
        ownerId: pavel.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Storytelling",
        slug: "storytelling",
        ownerId: pavel.id,
      },
    }),
  ]);

  const articles = [
    {
      authorId: alice.id,
      categoryId: guides.id,
      tagIds: [nextjs.id, prismaTag.id],
      title: "Building a calmer editorial workflow with Next.js App Router",
      slug: "building-a-calmer-editorial-workflow-with-nextjs-app-router",
      excerpt:
        "How a server-driven public site and a client-driven dashboard can coexist in a content platform without drifting apart.",
      content: `
        <h2>Server-first public publishing</h2>
        <p>The public side of a publishing platform benefits from predictable rendering, stable metadata and resilient caching. App Router gives you those pieces without forcing you into an all-client architecture.</p>
        <p>In this project, the article list, dynamic detail routes, metadata, robots and sitemap are all delivered from the server. That keeps the public site fast and indexable.</p>
        <h2>Client-first dashboard interactions</h2>
        <p>The dashboard stays fully interactive and talks to Route Handlers instead of mutating the database directly from the browser. This keeps ownership checks and validation on the server where they belong.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-02T08:30:00.000Z"),
    },
    {
      authorId: alice.id,
      categoryId: reviews.id,
      tagIds: [ux.id, nextjs.id],
      title: "Why small editorial dashboards feel faster than giant control panels",
      slug: "why-small-editorial-dashboards-feel-faster-than-giant-control-panels",
      excerpt:
        "A focused dashboard with strong ownership boundaries usually beats feature sprawl when content teams work alone.",
      content: `
        <p>Dashboards become stressful when every screen tries to solve every problem. A smaller control surface gives editors less room to get lost and more room to publish.</p>
        <blockquote>Speed in CMS work is rarely about milliseconds only. It is also about cognitive load.</blockquote>
        <p>This build keeps the article workflow to the essential actions: create, edit, publish, filter and delete.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-01-25T10:00:00.000Z"),
    },
    {
      authorId: pavel.id,
      categoryId: photography.id,
      tagIds: [storytelling.id, performance.id],
      title: "Sequencing images so a gallery reads like a story",
      slug: "sequencing-images-so-a-gallery-reads-like-a-story",
      excerpt:
        "Ordering visuals is editorial work. A good gallery leads the eye the same way a strong article leads the reader.",
      content: `
        <p>Galleries fail when they feel like unordered storage. They succeed when each image answers or complicates the one before it.</p>
        <ul>
          <li>Start with the strongest establishing frame.</li>
          <li>Alternate wide and close details to keep rhythm.</li>
          <li>Finish on an image that leaves a useful aftertaste.</li>
        </ul>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-14T07:45:00.000Z"),
    },
    {
      authorId: pavel.id,
      categoryId: workflows.id,
      tagIds: [performance.id],
      title: "Three bottlenecks that slow a content team before deploy time does",
      slug: "three-bottlenecks-that-slow-a-content-team-before-deploy-time-does",
      excerpt:
        "Review loops, vague ownership and weak metadata discipline waste more time than build minutes in most small CMS teams.",
      content: `
        <p>Most publishing friction shows up long before the build pipeline. Teams lose time when nobody knows who owns drafts, who can publish and which metadata is still missing.</p>
        <p>A route-based dashboard with explicit user ownership can remove a surprising amount of that ambiguity.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-19T12:10:00.000Z"),
    },
    {
      authorId: alice.id,
      categoryId: guides.id,
      tagIds: [prismaTag.id, nextjs.id],
      title: "Drafts, publication dates and why scheduling should stay boring",
      slug: "drafts-publication-dates-and-why-scheduling-should-stay-boring",
      excerpt:
        "Publishing state should be explicit, predictable and impossible to misunderstand from the UI or the API.",
      content: `
        <p>Publication workflows become fragile when state is implied. The safer model is to keep an explicit draft or published status and pair it with a clear publication date.</p>
        <p>That is exactly what the article API enforces here.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-03-01T09:15:00.000Z"),
    },
    {
      authorId: pavel.id,
      categoryId: workflows.id,
      tagIds: [performance.id, storytelling.id],
      title: "Designing a homepage that feels curated instead of merely sorted",
      slug: "designing-a-homepage-that-feels-curated-instead-of-merely-sorted",
      excerpt:
        "Editorial front pages need hierarchy, contrast and pacing. Reverse chronological order is only the start.",
      content: `
        <p>Readers notice intention. They can also spot when a homepage is just a dump of the latest posts.</p>
        <p>A stronger front page uses featured hierarchy, tactile cards, deliberate spacing and tags that act as thematic signposts.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-03-10T06:50:00.000Z"),
    },
    {
      authorId: alice.id,
      categoryId: reviews.id,
      tagIds: [ux.id],
      title: "Pending piece: comparing editor experiences in modern CMS tools",
      slug: "pending-piece-comparing-editor-experiences-in-modern-cms-tools",
      excerpt: "An unpublished draft used to demonstrate ownership and status transitions.",
      content: `
        <p>This is a draft article. It is intentionally not visible on the public site until its status changes.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.DRAFT,
      publishDate: new Date("2026-04-01T08:00:00.000Z"),
    },
  ];

  for (const article of articles) {
    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        coverImage: article.coverImage,
        status: article.status,
        publishDate: article.publishDate,
        authorId: article.authorId,
        categoryId: article.categoryId,
        tags: {
          connect: article.tagIds.map((id) => ({ id })),
        },
      },
    });
  }

  console.log("Seeded demo content.");
  console.log("Users:");
  console.log("  alice@example.com / DemoPassword123!");
  console.log("  pavel@example.com / DemoPassword123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

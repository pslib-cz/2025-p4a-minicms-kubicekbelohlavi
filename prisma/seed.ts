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
      name: "Alice Editorka",
      email: "alice@example.com",
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&q=80",
    },
  });

  const pavel = await prisma.user.create({
    data: {
      name: "Pavel Kurátor",
      email: "pavel@example.com",
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=512&q=80",
    },
  });

  const [coverLine, lab, cityRhythm, panelStudio] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Titulní linka",
        slug: "titulni-linka",
        ownerId: alice.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Redakční laboratoř",
        slug: "redakcni-laborator",
        ownerId: alice.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Městský rytmus",
        slug: "mestsky-rytmus",
        ownerId: pavel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Ateliér panelů",
        slug: "atelier-panelu",
        ownerId: pavel.id,
      },
    }),
  ]);

  const [nextjs, raster, ux, diagonals, storytelling] = await Promise.all([
    prisma.tag.create({
      data: {
        name: "Next.js",
        slug: "nextjs",
        ownerId: alice.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Rastr",
        slug: "rastr",
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
        name: "Diagonály",
        slug: "diagonaly",
        ownerId: pavel.id,
      },
    }),
    prisma.tag.create({
      data: {
        name: "Vyprávění",
        slug: "vypraveni",
        ownerId: pavel.id,
      },
    }),
  ]);

  const articles = [
    {
      authorId: alice.id,
      categoryId: coverLine.id,
      tagIds: [nextjs.id, raster.id],
      title: "Jak postavit titulku, která funguje jako splash page pro celé číslo",
      slug: "jak-postavit-titulku-ktera-funguje-jako-splash-page-pro-cele-cislo",
      excerpt:
        "Serverová homepage a klientské studio mohou držet jeden rytmus, když je hierarchie pevná, kontrast čistý a cover story má jasnou prioritu.",
      content: `
        <h2>Veřejná část musí mít tah</h2>
        <p>Když má magazín působit jako hotové číslo, nesmí titulka vypadat jako náhodný seznam článků. Serverové vykreslení drží pořadí, metadata i sitemapu pevně v rukou.</p>
        <p>App Router tu nechává veřejnou část rychlou a indexovatelnou, aniž by dashboard musel obětovat interaktivitu.</p>
        <h2>Studio zůstává živé</h2>
        <p>Editor studio běží klientsky, ale mluví jen s Route Handlery. Vlastnictví obsahu a validace tak zůstávají na serveru, kde opravdu patří.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-02T08:30:00.000Z"),
    },
    {
      authorId: alice.id,
      categoryId: lab.id,
      tagIds: [ux.id, nextjs.id],
      title: "Proč malé redakční studio poráží přebujelé kontrolní panely",
      slug: "proc-male-redakcni-studio-porazi-prebujene-kontrolni-panely",
      excerpt:
        "Když editor pracuje sám, jasné hranice vlastnictví a krátká cesta k publikaci vítězí nad funkcemi, které jen hlučí kolem.",
      content: `
        <p>Dashboard začne dusit ve chvíli, kdy chce řešit všechno najednou. Menší kontrolní plocha nechá editorovi víc prostoru pro rytmus práce a méně prostoru pro bloudění.</p>
        <blockquote>Rychlost CMS práce není jen o milisekundách. Je to i o tom, kolik hluku musí hlava odfiltrovat.</blockquote>
        <p>Tahle sestava drží workflow na základních akcích: vytvořit, upravit, publikovat, filtrovat a smazat.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-01-25T10:00:00.000Z"),
    },
    {
      authorId: pavel.id,
      categoryId: cityRhythm.id,
      tagIds: [storytelling.id, diagonals.id],
      title: "Jak řadit fotky, aby galerie měla tah komiksového stripu",
      slug: "jak-radit-fotky-aby-galerie-mela-tah-komiksoveho-stripu",
      excerpt:
        "Řazení vizuálů je redakční disciplína. Dobrá galerie vede oko stejně jistě, jako silný článek vede čtenáře přes stránku.",
      content: `
        <p>Galerie selže ve chvíli, kdy působí jako neuspořádané skladiště. Funguje až tehdy, kdy každý obraz odpovídá tomu předchozímu nebo ho záměrně komplikuje.</p>
        <ul>
          <li>Začněte nejsilnějším establishing záběrem.</li>
          <li>Střídejte široké panely s detailem, aby nevypadl rytmus.</li>
          <li>Končete obrazem, který po sobě nechá doznívat napětí.</li>
        </ul>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-14T07:45:00.000Z"),
    },
    {
      authorId: pavel.id,
      categoryId: panelStudio.id,
      tagIds: [diagonals.id],
      title: "Tři brzdy, které redakci zlomí dřív než samotný deploy",
      slug: "tri-brzdy-ktere-redakci-zlomi-driv-nez-samotny-deploy",
      excerpt:
        "Většinu času nežerou buildy. Čas mizí ve smyčkách schvalování, mlhavém vlastnictví a slabé disciplíně kolem metadat.",
      content: `
        <p>Největší tření nepřichází až v pipeline. Přichází tehdy, když nikdo přesně neví, kdo drží draft, kdo smí publikovat a která metadata ještě chybí.</p>
        <p>Dashboard s explicitním vlastnictvím a jasným statusem umí tuhle mlhu odstranit překvapivě rychle.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-19T12:10:00.000Z"),
    },
    {
      authorId: alice.id,
      categoryId: coverLine.id,
      tagIds: [raster.id, nextjs.id],
      title: "Draft, datum vydání a proč musí být publikace naprosto čitelná",
      slug: "draft-datum-vydani-a-proc-musi-byt-publikace-naprosto-citelna",
      excerpt:
        "Publikační stav musí být explicitní, čitelný a z UI i API naprosto jednoznačný. Bez toho se magazín rozsype do šumu.",
      content: `
        <p>Publikační workflow začne praskat ve chvíli, kdy je stav jen naznačený. Bezpečnější je držet jasný draft nebo publikováno a doplnit ho konkrétním datem vydání.</p>
        <p>Přesně tohle v tomhle magazínu hlídá člankové API i editor modal.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-03-01T09:15:00.000Z"),
    },
    {
      authorId: pavel.id,
      categoryId: panelStudio.id,
      tagIds: [diagonals.id, storytelling.id],
      title: "Homepage, která působí jako číslo magazínu, ne jako odkladiště článků",
      slug: "homepage-ktera-pusobi-jako-cislo-magazinu-ne-jako-odkladiste-clanku",
      excerpt:
        "Titulka potřebuje hierarchii, kontrast a tempo. Reverzní chronologie je jen technický základ, ne redakční řešení.",
      content: `
        <p>Čtenář pozná záměr během pár sekund. Stejně rychle pozná i to, když homepage jen vysype poslední články bez rytmu.</p>
        <p>Silná titulka používá cover story, hmatatelné karty, záměrné mezery a štítky jako tematické signposty.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-03-10T06:50:00.000Z"),
    },
    {
      authorId: alice.id,
      categoryId: lab.id,
      tagIds: [ux.id],
      title: "Rozpracováno: jak porovnat editor zkušenost bez ztráty tempa",
      slug: "rozpracovano-jak-porovnat-editor-zkusenost-bez-ztraty-tempa",
      excerpt: "Nepublikovaný draft určený pro ukázku ownership kontrol a změn publikačního stavu.",
      content: `
        <p>Tohle je draft článek. Na veřejné části schválně není vidět, dokud se nezmění jeho stav publikace.</p>
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

  console.log("Demo obsah byl naplněn.");
  console.log("Uživatelé:");
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

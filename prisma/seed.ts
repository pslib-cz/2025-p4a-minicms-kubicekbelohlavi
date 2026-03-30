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

  const miles = await prisma.user.create({
    data: {
      name: "Miles Morales",
      email: "alice@example.com",
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=512&q=80",
    },
  });

  const gwen = await prisma.user.create({
    data: {
      name: "Gwen Stacy",
      email: "pavel@example.com",
      passwordHash,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=512&q=80",
    },
  });

  const [multiverse, brooklyn, villains, spiderTech] = await Promise.all([
    prisma.category.create({
      data: {
        name: "Film a animace",
        slug: "film-a-animace",
        ownerId: miles.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Kultura a styl",
        slug: "kultura-a-styl",
        ownerId: miles.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Postavy a příběhy",
        slug: "postavy-a-pribehy",
        ownerId: gwen.id,
      },
    }),
    prisma.category.create({
      data: {
        name: "Technologie",
        slug: "technologie",
        ownerId: gwen.id,
      },
    }),
  ]);

  const [tagSpiderVerse, tagAnimace, tagMiles, tagKingpin, tagPavucina, tagGraffiti] =
    await Promise.all([
      prisma.tag.create({
        data: {
          name: "Recenze",
          slug: "recenze",
          ownerId: miles.id,
        },
      }),
      prisma.tag.create({
        data: {
          name: "Vizuální efekty",
          slug: "vizualni-efekty",
          ownerId: miles.id,
        },
      }),
      prisma.tag.create({
        data: {
          name: "Hlavní hrdinové",
          slug: "hlavni-hrdinove",
          ownerId: miles.id,
        },
      }),
      prisma.tag.create({
        data: {
          name: "Záporáci",
          slug: "zaporaci",
          ownerId: gwen.id,
        },
      }),
      prisma.tag.create({
        data: {
          name: "Akční scény",
          slug: "akcni-sceny",
          ownerId: gwen.id,
        },
      }),
      prisma.tag.create({
        data: {
          name: "Street art",
          slug: "street-art",
          ownerId: miles.id,
        },
      }),
    ]);

  const articles = [
    {
      authorId: miles.id,
      categoryId: multiverse.id,
      tagIds: [tagSpiderVerse.id, tagMiles.id, tagAnimace.id],
      title: "Spider-Man: Paralelní světy — jak Miles Morales změnil pravidla multiverzálního vyprávění",
      slug: "spider-man-paralelni-svety-jak-miles-morales-zmenil-pravidla",
      excerpt:
        "V roce 2018 přišel film, který rozbil všechna pravidla animace. Spider-Man: Paralelní světy ukázal, že každý může nosit masku — a každý vesmír má svůj vlastní vizuální jazyk.",
      content: `
        <h2>Každý může být Spider-Man</h2>
        <p>Miles Morales není jen další Spider-Man. Je důkazem, že hrdina nepotřebuje být kopií originálu. Když ho pavouk kousne v brooklynském metru, jeho svět se otočí vzhůru nohama — a s ním i celý multiverzum.</p>
        <p>Film Spider-Man: Paralelní světy (2018) od režisérů Boba Persicchettiho, Petera Ramseyho a Rodneye Rothmana přinesl revoluci nejen v animaci, ale i ve způsobu, jakým vyprávíme příběhy o hrdinech.</p>
        <blockquote>Kazdy muze nosit masku. Ty, ja, kdokoliv. Maska nerozhoduje o tom, kdo jsi — ale o tom, co udelas. — Miles Morales</blockquote>
        <h2>Vizuální revoluce</h2>
        <p>Halftone tečky, rozmazané okraje, chromatic aberration, graffiti textury — film vypadá jako živý komiks. Každý frame je jako vytržená stránka z komiksového sešitu, kde se potkávají různé styly kreslení.</p>
        <p>Peter B. Parker přichází z vesmíru, který vypadá jako klasický Marvel komiks. Spider-Gwen přináší pastelovou paletu s punkovými akcenty. Peni Parker a SP//dr jsou čistá manga. Noir Spider-Man je černobílý film noir. A Spider-Ham? Ten je looney cartoon.</p>
        <h2>Brooklyn jako hrdina</h2>
        <p>Miles pochází z Brooklynu a jeho svět je prodchnutý street artem, hip-hopem a kulturou New Yorku. Jeho graffiti "No Expectations" se stalo ikonickým symbolem celého filmu.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-01T08:00:00.000Z"),
    },
    {
      authorId: gwen.id,
      categoryId: multiverse.id,
      tagIds: [tagSpiderVerse.id, tagAnimace.id, tagPavucina.id],
      title: "Vizuální DNA Spider-Verse: halftone, glitch a komiksové panely v pohybu",
      slug: "vizualni-dna-spider-verse-halftone-glitch-komiks",
      excerpt:
        "Každý vesmír ve Spider-Verse má svůj vlastní vizuální jazyk. Od Ben-Day teček přes chromatic aberration až po manga panely — podíváme se na techniky, které z filmu udělaly revoluci.",
      content: `
        <h2>Ben-Day tečky a halftone</h2>
        <p>Klasické komiksové tečky (halftone pattern) jsou všude. Ve stínech postav, v pozadích, v explozích. Nejsou to jen dekorace — jsou to plnohodnotné stínovací techniky, které dávají filmu autentický komiksový charakter.</p>
        <h2>Chromatic aberration</h2>
        <p>Když se Miles poprvé "glitchne", vidíme červený a modrý offset jeho siluety. Tento efekt chromatic aberration se stal vizuální signaturou celého filmu a znamená nestabilitu mezi dimenzemi.</p>
        <blockquote>"Glitch efekt není chyba — je to vizuální jazyk multiverzálního chaosu." — animační tým Sony Pictures</blockquote>
        <h2>Komiksové panely v pohybu</h2>
        <p>Film používá split-screen a komiksové panely jako narativní nástroj. Akční scény se rozkládají do více panelů současně, přesně jako na stránce komiksu. Onomatopoeia (THWIP!, POW!, BAM!) se objevují jako fyzické objekty ve scéně.</p>
        <h2>Snížená snímková frekvence</h2>
        <p>Miles se na začátku animuje na 12 snímcích za sekundu (na "dvojkách"), zatímco zkušení Spider-People se pohybují na plynulých 24 fps. Jak Miles získává sebedůvěru, jeho animace se plynule zrychluje — geniální vizuální vyprávění charakterového vývoje.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-10T10:00:00.000Z"),
    },
    {
      authorId: miles.id,
      categoryId: brooklyn.id,
      tagIds: [tagMiles.id, tagGraffiti.id],
      title: "Miles a Brooklyn: graffiti, street art a identita Spider-Mana z ulice",
      slug: "miles-a-brooklyn-graffiti-street-art-identita",
      excerpt:
        "Miles Morales není jen Spider-Man — je brooklynský teenager s náplní ve spreji a sluchátky na uších. Jeho umělecký talent definuje jeho cestu ke Spider-maskě.",
      content: `
        <h2>Graffiti jako superschopnost</h2>
        <p>Milesův vztah k street artu není jen pozadí — je to klíčový prvek jeho identity. Když maluje "No Expectations" na zeď metra, vyjadřuje svůj boj s očekáváními rodiny, školy a nového života na Visions Academy.</p>
        <p>Jeho styl kreslení — bold linky, živé barvy, mix typografie a obrazu — se přímo promítá do vizuálního jazyka celého filmu.</p>
        <h2>Brooklyn jako další postava</h2>
        <p>Brooklyn v Paralelních světech není jen kulisa. Je to živý organismus — s bodegami, metrem, graffiti zdmi a zvuky ulice. Hudba od Daniela Pembertona a Post Malone s "Sunflower" dokonale zachycují energii městského života.</p>
        <blockquote>"What's up danger?" — Miles Morales, ve chvíli kdy poprvé skočí z mrakodrapu</blockquote>
        <h2>Leap of Faith</h2>
        <p>Ikonická scéna "leap of faith" — Miles padá z budovy střemhlav, kamera je otočená, takže to vypadá, že stoupá — je jedním z nejslavnějších záběrů v historii animace. Je to okamžik, kdy Miles přijme svou identitu Spider-Mana.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-18T07:30:00.000Z"),
    },
    {
      authorId: gwen.id,
      categoryId: villains.id,
      tagIds: [tagKingpin.id, tagSpiderVerse.id],
      title: "Kingpin a supercollider: když záporák rozbije hranice reality",
      slug: "kingpin-a-supercollider-kdyz-zaporak-rozbije-hranice-reality",
      excerpt:
        "Wilson Fisk je jedním z nejzajímavějších záporáků v animované historii. Jeho motivace — vrátit mrtvou rodinu — pohání stroj, který trhá multiverzum na kusy.",
      content: `
        <h2>Tragický záporák</h2>
        <p>Kingpin ve Spider-Verse není typický zloduch. Je to muž zničený ztrátou — jeho žena Vanessa a syn Richard ho opustili, když zjistili, kým doopravdy je. Supercollider je jeho zoufalý pokus přitáhnout verzi rodiny z jiného vesmíru.</p>
        <h2>Vizuální design Kingpina</h2>
        <p>Kingpinův design je geniální. Jeho tělo je obrovský černý obdélník, hlava je malá, a když se pohybuje, celý záběr se pod ním prohýbá. Je to vizuální metafora neúměrné moci.</p>
        <blockquote>"You're not Spider-Man. You're just a kid." — Kingpin Milesovi</blockquote>
        <h2>Supercollider a multiverzální chaos</h2>
        <p>Supercollider pod Brooklynem otevírá portály do paralelních dimenzí. Každé zapnutí přitahuje Spider-lidi z jiných vesmírů a zároveň destabilizuje celou realitu. Vizuálně se to projevuje glitchováním — barvy se rozpadají, kontury se zdvojují, prostor se láme.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-02-25T12:00:00.000Z"),
    },
    {
      authorId: miles.id,
      categoryId: multiverse.id,
      tagIds: [tagSpiderVerse.id, tagPavucina.id, tagAnimace.id],
      title: "Každý Spider-Man, každý styl: průvodce postavami z Paralelních světů",
      slug: "kazdy-spider-man-kazdy-styl-pruvodce-postavami",
      excerpt:
        "Peter B. Parker, Spider-Gwen, Noir, Peni Parker, Spider-Ham — každá postava přináší svůj vlastní vizuální vesmír a životní příběh.",
      content: `
        <h2>Peter B. Parker (Země-616B)</h2>
        <p>Unavený, rozvedený, trochu při těle — Peter B. Parker je Spider-Man, který to vzdal. Jeho animace je záměrně "rozbitá" — pohybuje se líně, jí pizza ve špatných momentech a zároveň je tím nejzkušenějším členem týmu.</p>
        <h2>Spider-Gwen (Země-65)</h2>
        <p>Gwen Stacy z vesmíru, kde ona je Spider-Woman. Její svět je pastelově růžový a modrý, s výraznou punkovou estetikou. Její taneční pohyby v akci jsou inspirované baletem.</p>
        <h2>Spider-Man Noir (Země-90214)</h2>
        <p>Černobílý Spider-Man z éry prohibice. Mluví jako detektiv z filmů noir, nikdy neviděl barvy a nese s sebou Rubikovu kostku. Nicolas Cage mu propůjčil hlas s dokonalým noir monologem.</p>
        <h2>Peni Parker & SP//dr (Země-14512)</h2>
        <p>Manga-stylová hrdinka s psychickým propojením na pavoučího robota. Její animační styl je čistě japonský — velké oči, expresivní reakce a mecha akční sekvence.</p>
        <h2>Spider-Ham (Země-8311)</h2>
        <p>Peter Porker — prase, které je Spider-Man. Animovaný ve stylu Looney Tunes, tahá kladiva z ničeho a ignoruje fyziku. "Do animals talk in this dimension? Because I don't wanna freak him out."</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-03-05T09:00:00.000Z"),
    },
    {
      authorId: gwen.id,
      categoryId: spiderTech.id,
      tagIds: [tagPavucina.id, tagAnimace.id],
      title: "Spider-Sense a pavučinová technologie: jak fungují schopnosti napříč vesmíry",
      slug: "spider-sense-a-pavucinova-technologie-schopnosti-napruc-vesmiry",
      excerpt:
        "Od Milesova bio-elektrického venom stingu po Gweniny pavučinové baletky — každý Spider-hrdina má unikátní sadu schopností odvozených z jeho vesmíru.",
      content: `
        <h2>Spider-Sense</h2>
        <p>Spider-Sense ve filmu vypadá jinak než v jakémkoliv předchozím zpracování. Vlnky kolem hlavy, zkreslení času, vizuální šum — Miles ho zpočátku nechápe a neumí ovládat, což vede k mnoha komickým i dramatickým momentům.</p>
        <h2>Milesovy unikátní schopnosti</h2>
        <p>Miles má dvě schopnosti, které žádný jiný Spider-Man nemá:</p>
        <ul>
          <li><strong>Neviditelnost</strong> — dokáže se zneviditelnit, včetně oblečení. Aktivuje se instinktivně, když má strach.</li>
          <li><strong>Venom Strike</strong> — bio-elektrický výboj z prstů, který omráčí protivníky a zkratuje elektroniku.</li>
        </ul>
        <h2>Web-Shootery vs. organické pavučiny</h2>
        <p>Různí Spider-People používají různé typy pavučin. Peter B. Parker má mechanické web-shootery. Miles zdědil Peterovy shootery po jeho smrti. Gwen má vlastní verzi s baletním stylem houpání.</p>
        <blockquote>"Pavučina není jen nástroj — je to prodloužení Spider-Smanovy identity." — vizuální koncept Sony Pictures</blockquote>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      status: ArticleStatus.PUBLISHED,
      publishDate: new Date("2026-03-12T06:30:00.000Z"),
    },
    {
      authorId: miles.id,
      categoryId: brooklyn.id,
      tagIds: [tagMiles.id, tagGraffiti.id],
      title: "Rozpracováno: soundtrack Spider-Verse a jeho vliv na vizuální rytmus",
      slug: "rozpracovano-soundtrack-spider-verse-vizualni-rytmus",
      excerpt: "Nepublikovaný draft o tom, jak hudba od Post Malone, Juice WRLD a Daniela Pembertona formuje tempo animace.",
      content: `
        <p>Tohle je rozpracovaný draft. Soundtrack Spider-Verse — od "Sunflower" po "What's Up Danger" — není jen doprovodná hudba. Je to páteř vizuálního rytmu celého filmu.</p>
        <p>Každá akční scéna je choreografovaná na beat. "What's Up Danger" od Blackway & Black Caviar doprovází ikonický leap of faith — a tempo hudby přesně kopíruje Milesův pád a vzestup.</p>
      `,
      coverImage:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
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

  console.log("Spider-Verse demo obsah byl naplněn.");
  console.log("Uživatelé:");
  console.log("  alice@example.com (Miles Morales) / DemoPassword123!");
  console.log("  pavel@example.com (Gwen Stacy) / DemoPassword123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

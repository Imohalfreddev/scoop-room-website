import type { Article, CategorySlug } from "@/types";
import { categories, categoryBySlug } from "./categories";
import { authors } from "./authors";
import { pickTags } from "./tags";

interface Seed {
  title: string;
  dek: string;
}

const seeds: Record<CategorySlug, Seed[]> = {
  nigeria: [
    {
      title: "Federal Government Unveils New Rail Line Linking Lagos to Ibadan Suburbs",
      dek: "The expansion adds four stations and is expected to cut commute times by up to 40 minutes.",
    },
    {
      title: "Abuja Announces Nationwide Rollout of Digital National ID Verification",
      dek: "Banks and telecoms will require the new verification layer for account openings from next quarter.",
    },
    {
      title: "Lagos State Begins Flood Defence Works Ahead of Rainy Season",
      dek: "Engineers are reinforcing drainage channels across six flood-prone local government areas.",
    },
    {
      title: "National Assembly Passes Amended Electoral Finance Bill",
      dek: "The bill introduces stricter caps on campaign spending and new disclosure requirements.",
    },
    {
      title: "Power Grid Stability Improves as Two New Substations Go Live",
      dek: "Distribution companies report fewer outages across the north-central corridor this month.",
    },
    {
      title: "Kano Tech Hub Graduates First Cohort of 200 Software Engineers",
      dek: "The state-backed program pairs training with guaranteed placements at local employers.",
    },
    {
      title: "Naira Firms Slightly Against Dollar on Improved Reserves",
      dek: "Analysts point to increased remittance inflows and a modest bump in oil receipts.",
    },
    {
      title: "Port Harcourt Refinery Reports Full Operational Capacity",
      dek: "Officials say the plant is now processing at design capacity for the first time in years.",
    },
  ],
  africa: [
    {
      title: "African Union Summit Opens With Focus on Continental Trade Corridors",
      dek: "Leaders are expected to sign fresh commitments to the AfCFTA implementation timeline.",
    },
    {
      title: "East African Community Fast-Tracks Single Tourist Visa Scheme",
      dek: "The scheme lets travelers move between five member states on one entry permit.",
    },
    {
      title: "Ghana and Ivory Coast Coordinate on Cocoa Price Floor",
      dek: "The two producers account for roughly 60% of global cocoa supply.",
    },
    {
      title: "Kenya's Renewable Energy Share Passes 90% of Grid Capacity",
      dek: "Geothermal and wind projects continue to displace diesel generation.",
    },
    {
      title: "Southern African Bloc Deploys Joint Force to Secure Trade Routes",
      dek: "The mission focuses on protecting cross-border logistics corridors from disruption.",
    },
    {
      title: "Rwanda Opens New Innovation Campus in Kigali",
      dek: "The campus will host startups working across agritech, health, and logistics.",
    },
    {
      title: "Continental Free Trade Volumes Rise for a Third Consecutive Quarter",
      dek: "Intra-African exports are climbing as customs digitization reduces border delays.",
    },
  ],
  world: [
    {
      title: "G7 Finance Ministers Meet to Discuss Global Debt Relief Framework",
      dek: "Talks center on restructuring options for low-income economies facing repayment pressure.",
    },
    {
      title: "European Parliament Advances New Cross-Border Data Rules",
      dek: "The framework aims to harmonize privacy standards across member states by next year.",
    },
    {
      title: "Southeast Asian Nations Sign Expanded Maritime Cooperation Pact",
      dek: "The agreement covers joint patrols and shared satellite monitoring of shipping lanes.",
    },
    {
      title: "United Nations Convenes Emergency Session on Regional Ceasefire Talks",
      dek: "Delegates are pushing for a humanitarian corridor ahead of further negotiations.",
    },
    {
      title: "Latin American Central Banks Coordinate Rate Policy Amid Inflation Cooling",
      dek: "Regional inflation has eased for four straight months, giving policymakers more room.",
    },
    {
      title: "Arctic Research Station Reports Record Summer Ice Melt Data",
      dek: "Scientists say the findings will sharpen forecasting models for shipping routes.",
    },
  ],
  politics: [
    {
      title: "Opposition Coalition Unveils Joint Policy Platform Ahead of Elections",
      dek: "The alliance is betting on a unified economic plan to consolidate its voter base.",
    },
    {
      title: "Senate Committee Grills Cabinet Nominees Over Budget Priorities",
      dek: "Lawmakers pressed nominees on plans to close a widening fiscal deficit.",
    },
    {
      title: "State Governors Meet to Coordinate Minimum Wage Implementation",
      dek: "Several states say they need federal support to meet the new wage floor.",
    },
    {
      title: "Judiciary Reform Bill Clears Second Reading After Months of Debate",
      dek: "The bill proposes faster case resolution timelines and expanded digital filing.",
    },
    {
      title: "Local Government Elections Set for Later This Year, Commission Confirms",
      dek: "The electoral body says new biometric verification will be used nationwide.",
    },
    {
      title: "Cabinet Reshuffle Brings Fresh Faces to Economic Ministries",
      dek: "The changes are seen as a signal of the administration's shifting priorities.",
    },
  ],
  business: [
    {
      title: "Leading Bank Reports Record Quarterly Profit on Trade Finance Growth",
      dek: "Non-interest income drove much of the gain as loan books stayed conservative.",
    },
    {
      title: "Telecom Operator Announces Nationwide 5G Expansion Timeline",
      dek: "The rollout targets 25 additional cities by the end of next year.",
    },
    {
      title: "Stock Exchange Index Hits Fresh 12-Month High",
      dek: "Banking and consumer goods stocks led the rally in a broad-based session.",
    },
    {
      title: "Oil Marketers Warn of Supply Adjustments Amid Global Price Swings",
      dek: "Industry groups are asking regulators for clarity on pricing bands.",
    },
    {
      title: "Retail Conglomerate to Open 40 New Stores This Fiscal Year",
      dek: "The expansion focuses on secondary cities with rising middle-class spending.",
    },
    {
      title: "Central Bank Holds Benchmark Rate Steady, Cites Inflation Outlook",
      dek: "Policymakers say they want more data before adjusting the current stance.",
    },
    {
      title: "Logistics Startup Raises Fresh Round to Scale Cross-Border Freight",
      dek: "The round will fund a new fleet and expanded warehousing capacity.",
    },
  ],
  technology: [
    {
      title: "Homegrown Payments Platform Crosses 10 Million Active Users",
      dek: "The company credits merchant partnerships and offline agent networks for the growth.",
    },
    {
      title: "Government Launches Digital Skills Fund for University Graduates",
      dek: "The fund covers stipends for a six-month intensive software training track.",
    },
    {
      title: "Cloud Provider Opens First Regional Data Center",
      dek: "The facility is expected to cut latency for local enterprise customers significantly.",
    },
    {
      title: "Ride-Hailing App Adds Offline Mode for Low-Connectivity Areas",
      dek: "The update lets drivers accept and complete trips without a stable data connection.",
    },
    {
      title: "Cybersecurity Agency Flags Rise in Targeted Phishing Campaigns",
      dek: "Officials are urging banks and fintechs to tighten multi-factor authentication.",
    },
    {
      title: "Local Chip Design Startup Secures Manufacturing Partnership",
      dek: "The deal is the first of its kind for a homegrown semiconductor design team.",
    },
  ],
  entertainment: [
    {
      title: "Nollywood Feature Sets Opening Weekend Box Office Record",
      dek: "The film's distributor says overseas screenings will be added within the month.",
    },
    {
      title: "Afrobeats Star Announces Ten-City World Tour",
      dek: "Tickets for the first four dates sold out within an hour of release.",
    },
    {
      title: "Streaming Platform Greenlights Second Season of Hit Drama Series",
      dek: "Production is set to begin later this year with most of the original cast returning.",
    },
    {
      title: "Lagos Fashion Week Opens With Focus on Sustainable Textiles",
      dek: "Designers showcased collections built around recycled and locally sourced fabric.",
    },
    {
      title: "Award-Winning Director Announces New Documentary Project",
      dek: "The project will follow three families across a decade of urban migration.",
    },
  ],
  sports: [
    {
      title: "Super Eagles Name Provisional Squad for Upcoming Qualifiers",
      dek: "The coach has included three uncapped players in a 28-man provisional list.",
    },
    {
      title: "Domestic League Title Race Tightens With Three Games Remaining",
      dek: "Just four points separate the top three clubs heading into the final stretch.",
    },
    {
      title: "Sprinter Breaks National 200m Record at Continental Championships",
      dek: "The time now ranks among the fastest recorded worldwide this season.",
    },
    {
      title: "Basketball Federation Announces Expanded Youth Development League",
      dek: "The league will add six new regional conferences starting next season.",
    },
    {
      title: "Star Midfielder Completes Transfer to European Club",
      dek: "The move is reported to be one of the largest fees paid for a player from the league this year.",
    },
    {
      title: "National Boxing Team Books Slot at Continental Games",
      dek: "Three fighters secured qualification after a strong showing at the trials.",
    },
  ],
  lifestyle: [
    {
      title: "Health Ministry Launches Campaign on Preventive Screening",
      dek: "The initiative offers free screenings at primary health centers this quarter.",
    },
    {
      title: "Domestic Tourism Numbers Rise as More Travelers Explore Local Destinations",
      dek: "Operators point to improved road access and new mid-range accommodation options.",
    },
    {
      title: "City Chefs Spotlight Regional Cuisine in New Culinary Trail",
      dek: "The trail connects twelve restaurants known for reviving traditional recipes.",
    },
    {
      title: "Wellness Apps See Surge in Adoption Among Young Professionals",
      dek: "Sleep tracking and guided breathing features top the list of most-used tools.",
    },
    {
      title: "Urban Gardening Movement Gains Ground in Major Cities",
      dek: "Community plots are turning unused lots into shared vegetable gardens.",
    },
  ],
  ai: [
    {
      title: "Regional AI Lab Releases Open Model Tuned for Local Languages",
      dek: "The model supports eleven languages spoken across West Africa at launch.",
    },
    {
      title: "Regulators Propose Draft Framework for AI Risk Disclosure",
      dek: "The draft would require impact assessments for high-risk automated systems.",
    },
    {
      title: "University Partners With Industry on Applied AI Research Center",
      dek: "The center will focus on agriculture, health diagnostics, and public infrastructure.",
    },
    {
      title: "Newsroom Study Finds AI Tools Speeding Up Fact-Checking Workflows",
      dek: "Editors report faster turnaround on verifying claims from public statements.",
    },
    {
      title: "Startup Raises Seed Round for AI-Powered Crop Disease Detection",
      dek: "The tool uses a smartphone camera to flag disease risk in under a minute.",
    },
    {
      title: "Global AI Safety Coalition Adds Three New Member Nations",
      dek: "The coalition coordinates shared testing standards for frontier model releases.",
    },
  ],
};

const contentBlocks = [
  (dek: string) =>
    `${dek} Officials briefed reporters on the details Tuesday, framing the development as part of a broader push to modernize systems that residents rely on daily.`,
  () =>
    `Analysts say the timing matters: implementation will be watched closely by stakeholders who have pressed for faster progress over the past year. Early reactions from industry groups have been cautiously positive, though several noted that execution — not announcements — will determine the real-world impact.`,
  () =>
    `Scoop Room spoke with three people familiar with the planning process, who described a rollout designed in phases to reduce disruption. "The goal is to get the fundamentals right before scaling," one official said, adding that a review would follow the initial phase.`,
  () =>
    `Local reaction has been mixed but largely optimistic. Community leaders welcomed the announcement while urging authorities to maintain transparent reporting on progress and to keep the public informed as milestones are reached.`,
  () =>
    `The development follows months of consultation with technical advisors, civil society groups, and private-sector partners, according to documents reviewed by Scoop Room. Further details, including funding breakdowns, are expected to be published in the coming weeks.`,
  () =>
    `This is a developing story. Scoop Room will continue to update this report as more information becomes available from official sources.`,
];

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildArticle(
  categorySlug: CategorySlug,
  seed: Seed,
  index: number,
  globalIndex: number
): Article {
  const category = categoryBySlug(categorySlug)!;
  const slug = slugify(seed.title);
  const h = hashCode(slug);
  const author = authors[h % authors.length];
  const daysAgo = globalIndex % 21;
  const hoursAgo = h % 24;
  const publishedAt = new Date(
    Date.now() - daysAgo * 86400000 - hoursAgo * 3600000
  ).toISOString();
  const readTimeMinutes = 3 + (h % 6);
  const views = 800 + (h % 42000);
  const coverImage = `/api/placeholder/${slug}?w=1600&h=1000&label=${encodeURIComponent(category.name)}`;

  const content = [
    `<p>${contentBlocks[0](seed.dek)}</p>`,
    `<p>${contentBlocks[1 + (h % (contentBlocks.length - 1))]("")}</p>`,
    `<h2>What happens next</h2>`,
    `<p>${contentBlocks[2 + (h % (contentBlocks.length - 2))]("")}</p>`,
    `<p>${contentBlocks[contentBlocks.length - 1]("")}</p>`,
  ].join("\n");

  return {
    id: `art_${slug}`,
    slug,
    title: seed.title,
    dek: seed.dek,
    excerpt: seed.dek,
    content,
    coverImage,
    gallery:
      h % 4 === 0
        ? [0, 1, 2].map((g) => ({
            id: `${slug}-gallery-${g}`,
            type: "image" as const,
            url: `/api/placeholder/${slug}-${g}?w=1200&h=800`,
            alt: `${seed.title} — photo ${g + 1}`,
            width: 1200,
            height: 800,
            createdAt: publishedAt,
          }))
        : undefined,
    videoUrl: h % 7 === 0 ? "https://www.w3schools.com/html/mov_bbb.mp4" : undefined,
    category,
    tags: pickTags(h, 2 + (h % 3)),
    author,
    status: "published",
    featured: index === 0,
    trending: h % 5 === 0,
    sponsored: h % 11 === 0,
    publishedAt,
    updatedAt: publishedAt,
    readTimeMinutes,
    views,
    seo: {
      metaTitle: seed.title,
      metaDescription: seed.dek,
      ogImage: coverImage,
    },
  };
}

function generateArticles(): Article[] {
  const all: Article[] = [];
  let globalIndex = 0;
  for (const category of categories) {
    const catSeeds = seeds[category.slug];
    catSeeds.forEach((seed, index) => {
      all.push(buildArticle(category.slug, seed, index, globalIndex));
      globalIndex++;
    });
  }
  // Sort newest first
  return all.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export const articles: Article[] = generateArticles();

export const featuredArticles = articles.filter((a) => a.featured).slice(0, 6);

export const trendingArticles = articles.filter((a) => a.trending);

export const articleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const articlesByCategory = (slug: CategorySlug) =>
  articles.filter((a) => a.category.slug === slug);

export const relatedArticles = (article: Article, limit = 4) =>
  articles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category.id === article.category.id ||
          a.tags.some((t) => article.tags.some((at) => at.id === t.id)))
    )
    .slice(0, limit);

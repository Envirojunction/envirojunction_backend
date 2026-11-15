import axios from 'axios';
import * as cheerio from 'cheerio';
import { connect, Model } from 'mongoose';
import { News, NewsSchema } from '../src/news/schemas/news.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enviro_prod';
const SGS_NEWS_URL = 'https://www.sgs.com/en-gb/news';

interface NewsData {
  title: string;
  description: string;
  category: string;
  image: string;
}

// Sample real-world tech and business news for scraping
const SAMPLE_TECH_NEWS = [
  {
    title: 'Lean Food: Operational Excellence and Food Safety Under Maximum Pressure',
    description: 'The food and beverage industry is facing extreme cost and margin pressure, with rising food safety and traceability requirements and stricter environmental, social and governance (ESG) expectations. Alongside these challenges, management of raw materials, finished goods and labor availability is becoming increasingly complex.',
    category: 'Technology',
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/health-and-nutrition/healthy-food-concept.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.1&fp-y=0.45&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-04-01T10:00:00Z"),
  },
  {
    title: 'Advancing Sustainable Practices in Pharmaceutical Laboratories',
    description: 'Growing industry initiatives and certification programs are helping pharmaceutical laboratories reduce environmental impact while maintaining scientific quality and regulatory compliance.',
    category: 'Technology',
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/health-and-nutrition/scientist-examining-petri-dish.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.5&fp-y=0.5&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
  {
    title: 'Why Molecular Weight Analysis is Critical for Ensuring Pharmaceutical Quality',
    description: 'Polymer‑based excipients and active pharmaceutical ingredients such as dextran and polyethylene glycol (PEG) are widely used in modern pharmaceuticals and biologics. For these materials, molecular weight and molecular weight distribution directly influence product efficacy, formulation stability, biocompatibility and clinical performance. As highlighted in industry discussions, even small shifts in molecular weight can alter safety and therapeutic outcomes, underscoring the need for precise analytical control',
    category: 'News & Updates',
    author: "Safeguards",
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/health-and-nutrition/dna-helix-enlarged-model.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.2&fp-y=0.5&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
  {
    title: 'Ukraine Regulates Certain Epoxy Derivatives in Food Contact Materials',
    description: 'Ukraine notifies the World Trade Organization (WTO) of its new law on epoxy derivatives in food contact materials (FCM).',
    category: 'News & Updates',
    author: "Safeguards",
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/connectivity-and-products/banquet-table-in-the-style-of-the-sea.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.1&fp-y=0.45&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
  {
    title: 'UK Consults Over Revised POP Chemical Legislation for Great Britain',
    description: 'The United Kingdom (UK) plans update to persistent organic pollutants (POPs) regulations for Great Britain (GB).',
    category: 'Hardgoods, Automotive, Cosmetics & Personal Care, Electrical & Electronics, Personal and Protective Equipment, Softlines, Toys and Juvenile Products',
    author: "Safeguards",
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/connectivity-and-products/chlorpyrifos.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.1&fp-y=0.6&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
  {
    title: 'New Zealand Proposes Restriction on Three POP Chemicals',
    description: 'New Zealand holds consultation on proposed restriction of three persistent organic pollutants (POPs).',
    category: 'Hardgoods, Automotive, Cosmetics & Personal Care, Electrical & Electronics, Personal and Protective Equipment, Softlines, Toys and Juvenile Products',
    author: "Safeguards",
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/connectivity-and-products/hands-pouring-an-orange-chemical-solution-into-a-beaker.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.1&fp-y=0.45&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
  {
    title: 'Washington, USA, Updates Law on Lead in Cookware',
    description: 'Washington State amends requirements and clarifies exemptions for lead in cookware law.',
    category: 'Hardgoods',
    author: "Safeguards",
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/connectivity-and-products/cast-aluminium-pot.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.1&fp-y=0.55&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
  {
    title: 'Australia Consults On Proposed Listing of Several Chemicals to the IChEMS Register',
    description: 'Australia opens consultation on its proposed listing of 14 industrial chemicals to the IChEMS Register.',
    category: 'Hardgoods, Automotive, Cosmetics & Personal Care, Electrical & Electronics, Personal and Protective Equipment, Softlines, Toys and Juvenile Products',
    author: "Safeguards",
    image: 'https://imgix-prod.sgs.com/-/jssmedia/sgscorp/images/connectivity-and-products/various-colored-liquids-visible-inside-tubes.cdn.en-GB.1.jpg?fit=crop&auto=format&crop=focalpoint&fp-x=0.1&fp-y=0.4&fp-z=1&w=480&h=320',
    createdAt: new Date("2026-03-31T10:00:00Z"),
  },
];

async function scrapeNewsFromSGS(): Promise<NewsData[]> {
  try {
    console.log('🔍 Fetching news from SGS website...');
    const response = await axios.get(SGS_NEWS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const newsArray: NewsData[] = [];

    // SGS website structure - adjust selectors based on actual HTML
    // This is a generic scraper that looks for common news item patterns
    const newsItems = $('article, .news-item, [class*="news"], [class*="article"]');

    console.log(`📰 Found ${newsItems.length} potential news items`);

    newsItems.each((index: number, element: any) => {
      if (newsArray.length >= 15) return; // Stop at 15 items

      try {
        // Try to extract title
        const title = $(element)
          .find('h2, h3, [class*="m-result-item-filtered-list__headline"], [class*="heading"]')
          .first()
          .text()
          .trim();

        // Try to extract description
        const description = $(element)
          .find('p, [class*="m-result-item-filtered-list__description"], [class*="excerpt"], [class*="content"]')
          .first()
          .text()
          .trim();

        // Try to extract image
        let image = $(element)
          .find('img')
          .first()
          .attr('src') || '';

        // Try to extract category from class or data attribute
        const category = $(element).attr('data-category') || 'Environmental Monitoring & Testing';

        // Make sure required fields exist
        if (title && description && image) {
          // Make image URL absolute if it's relative
          if (image && !image.startsWith('http')) {
            image = new URL(image, SGS_NEWS_URL).href;
          }

          newsArray.push({
            title: title.substring(0, 200), // Limit title length
            description: description.substring(0, 500), // Limit description length
            category: category.substring(0, 50),
            image,
          });

          console.log(`✅ Scraped: ${title.substring(0, 60)}...`);
        }
      } catch (error) {
        console.log(`⚠️  Error processing news item: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    console.log(`\n📊 Successfully scraped ${newsArray.length} news items`);
    
    // If no items found, use sample data
    if (newsArray.length === 0) {
      console.log('📦 No items scraped from website. Using high-quality sample data with real image URLs...');
      return SAMPLE_TECH_NEWS;
    }
    
    return newsArray;
  } catch (error) {
    console.log(`⚠️  Error scraping SGS news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log('📦 Falling back to sample data with real image URLs...');
    return SAMPLE_TECH_NEWS;
  }
}

async function seedDatabase(newsData: NewsData[]) {
  try {
    console.log(`\n💾 Connecting to MongoDB at ${MONGODB_URI}...`);
    const mongoose = await connect(MONGODB_URI);

    const newsModel: Model<News> = mongoose.model('News', NewsSchema);

    // Clear existing news
    console.log('🗑️  Clearing existing news from database...');
    await newsModel.deleteMany({});

    // Insert new news
    console.log(`📥 Inserting ${newsData.length} news items into database...`);
    const insertedNews = await newsModel.insertMany(newsData);

    console.log(`\n✅ Successfully inserted ${insertedNews.length} news items`);
    console.log('\n📰 Sample News Items:');
    insertedNews.slice(0, 3).forEach((item, index) => {
      console.log(`\n${index + 1}. Title: ${item.title}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Description: ${item.description.substring(0, 80)}...`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

async function runSeed() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║          📰 NEWS DATABASE SEEDER - SGS NEWS 📰             ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');

  const newsData = await scrapeNewsFromSGS();

  if (newsData.length > 0) {
    await seedDatabase(newsData);
  } else {
    console.log('⚠️  No news data scraped. Database seeding skipped.');
  }
}

runSeed().catch(console.error);

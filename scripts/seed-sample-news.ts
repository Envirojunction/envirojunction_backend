import { connect, Model } from 'mongoose';
import { News, NewsSchema } from '../src/news/schemas/news.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/enviro_prod';

const SAMPLE_NEWS_DATA = [
  {
    title: 'Sustainability and Corporate Social Responsibility in Modern Business',
    description: 'Discover how leading companies are integrating sustainability practices into their core business strategies. This comprehensive guide explores CSR initiatives, environmental impact reduction, and social responsibility programs that are shaping the future of businesses worldwide.',
    category: 'Sustainability',
    image: 'https://via.placeholder.com/400x300?text=Sustainability+News',
  },
  {
    title: 'Digital Transformation: The Future of Business Operations',
    description: 'Learn about the latest trends in digital transformation and how organizations are leveraging AI, machine learning, and cloud technologies to streamline operations and improve efficiency. Explore case studies of successful digital implementations.',
    category: 'Technology',
    image: 'https://via.placeholder.com/400x300?text=Digital+Transformation',
  },
  {
    title: 'Global Supply Chain Challenges and Solutions',
    description: 'An in-depth analysis of current supply chain disruptions and innovative solutions being implemented by global companies. Understand the impact of geopolitical tensions, climate change, and technological innovations on supply chain management.',
    category: 'Business',
    image: 'https://via.placeholder.com/400x300?text=Supply+Chain',
  },
  {
    title: 'Quality Assurance Standards for Manufacturing Industries',
    description: 'Explore the importance of QA standards in manufacturing and how companies are adopting ISO certifications and best practices. This article discusses latest quality management systems and compliance requirements.',
    category: 'Manufacturing',
    image: 'https://via.placeholder.com/400x300?text=Quality+Assurance',
  },
  {
    title: 'Workplace Safety and Risk Management Best Practices',
    description: 'Essential guidelines for creating a safe working environment and managing occupational hazards. Learn about OSHA regulations, safety protocols, and how companies are reducing workplace accidents through proactive risk management.',
    category: 'Safety',
    image: 'https://via.placeholder.com/400x300?text=Workplace+Safety',
  },
  {
    title: 'The Role of Certification in Professional Development',
    description: 'Certifications play a crucial role in career advancement and professional credibility. This article explores various industry certifications, their relevance, and how professionals can leverage them for career growth.',
    category: 'Professional Development',
    image: 'https://via.placeholder.com/400x300?text=Certification',
  },
  {
    title: 'Risk Management in a Post-Pandemic World',
    description: 'Organizations are reimagining their risk management strategies considering the lessons learned from recent global challenges. Discover new frameworks and approaches to mitigate operational, financial, and reputational risks.',
    category: 'Risk Management',
    image: 'https://via.placeholder.com/400x300?text=Risk+Management',
  },
  {
    title: 'Environmental Compliance and Regulatory Updates 2024',
    description: 'Stay updated with the latest environmental regulations and compliance requirements. This comprehensive guide covers new standards, reporting obligations, and best practices for environmental management.',
    category: 'Compliance',
    image: 'https://via.placeholder.com/400x300?text=Environmental+Compliance',
  },
  {
    title: 'Innovation in Testing and Inspection Technologies',
    description: 'Cutting-edge technologies are revolutionizing testing and inspection processes across industries. Explore AI-powered quality control, automated inspection systems, and real-time monitoring solutions.',
    category: 'Technology',
    image: 'https://via.placeholder.com/400x300?text=Testing+Technology',
  },
  {
    title: 'Consumer Trust and Transparency in Supply Chains',
    description: 'Consumers increasingly demand transparency in where products come from and how they are made. Learn how companies are using blockchain and traceability solutions to build consumer trust.',
    category: 'Consumer Affairs',
    image: 'https://via.placeholder.com/400x300?text=Consumer+Trust',
  },
  {
    title: 'Data Security and Privacy Regulations Worldwide',
    description: 'GDPR, CCPA, and other privacy regulations are reshaping how companies handle customer data. This guide covers compliance strategies, data protection best practices, and the business impact of privacy regulations.',
    category: 'Security',
    image: 'https://via.placeholder.com/400x300?text=Data+Security',
  },
  {
    title: 'Circular Economy: Moving Towards Sustainable Practices',
    description: 'The circular economy model is gaining momentum as companies seek to minimize waste and maximize resource efficiency. Discover how organizations are redesigning products and processes for sustainability.',
    category: 'Sustainability',
    image: 'https://via.placeholder.com/400x300?text=Circular+Economy',
  },
  {
    title: 'Industry 4.0: Smart Manufacturing Solutions',
    description: 'The fourth industrial revolution is transforming manufacturing with IoT, automation, and data analytics. Explore how smart factories are improving productivity, reducing costs, and enhancing quality.',
    category: 'Manufacturing',
    image: 'https://via.placeholder.com/400x300?text=Industry+4.0',
  },
  {
    title: 'Global Standards and Harmonization Initiatives',
    description: 'International standardization efforts are facilitating global trade and cooperation. This article discusses ISO standards, regional harmonization initiatives, and their impact on businesses.',
    category: 'Standards',
    image: 'https://via.placeholder.com/400x300?text=Global+Standards',
  },
  {
    title: 'Career Opportunities in Quality and Compliance Fields',
    description: 'The demand for quality and compliance professionals continues to grow. Explore emerging career paths, required skills, and salary expectations in these rapidly evolving fields.',
    category: 'Career',
    image: 'https://via.placeholder.com/400x300?text=Career+Opportunities',
  },
];

async function seedDatabase() {
  try {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     📰 NEWS DATABASE SEEDER - SAMPLE DATA 📰              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('');

    console.log(`💾 Connecting to MongoDB at ${MONGODB_URI}...`);
    const mongoose = await connect(MONGODB_URI);

    const newsModel: Model<News> = mongoose.model('News', NewsSchema);

    // Clear existing news
    console.log('🗑️  Clearing existing news from database...');
    await newsModel.deleteMany({});

    // Insert sample news
    console.log(`📥 Inserting ${SAMPLE_NEWS_DATA.length} sample news items into database...`);
    const insertedNews = await newsModel.insertMany(SAMPLE_NEWS_DATA);

    console.log(`\n✅ Successfully inserted ${insertedNews.length} sample news items`);
    console.log('\n📰 Inserted News Items:');
    insertedNews.forEach((item, index) => {
      console.log(`\n${index + 1}. Title: ${item.title}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Description: ${item.description.substring(0, 60)}...`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nYou can now test the news API:');
    console.log('  GET http://localhost:3000/news');
    console.log('  GET http://localhost:3000/news?page=1&limit=5');
    console.log('  GET http://localhost:3000/news?category=Technology');
    console.log('  GET http://localhost:3000/news?search=sustainability');
    console.log('');
  } catch (error) {
    console.error('❌ Error seeding database:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

seedDatabase().catch(console.error);

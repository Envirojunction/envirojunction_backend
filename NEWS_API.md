# News Module - API Documentation

The News Module provides a complete solution for managing and retrieving news articles with pagination, filtering, and search capabilities.

## Features

- ✅ Create news articles
- ✅ Retrieve all news with pagination
- ✅ Filter news by category
- ✅ Search news by title or description
- ✅ Sort by creation date (newest first)
- ✅ Public API (no authentication required)

## Database Schema

### News Collection

```javascript
{
  "_id": ObjectId,           // MongoDB unique identifier
  "title": String,           // News article title (required, max 200 chars)
  "description": String,     // News article description (required, max 500 chars)
  "category": String,        // Article category (required, max 50 chars)
  "image": String,           // URL to article image (required)
  "createdAt": Date,         // Creation timestamp (auto-generated)
  "updatedAt": Date,         // Last update timestamp (auto-generated)
  "__v": Number              // Version field (Mongoose internal)
}
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

The following dependencies have been added:
- `axios` - HTTP client for web scraping
- `cheerio` - jQuery-like syntax for HTML parsing
- `@nestjs/mongoose` - MongoDB integration (already installed)

### 2. Seed the Database

Choose one of the two methods below:

#### Option A: Seed with Sample Data (Recommended for testing)

```bash
npm run seed:news:sample
```

This will:
- ✅ Clear existing news from the database
- ✅ Insert 15 sample news articles across various categories
- ✅ Display confirmation with sample data
- ✅ Provide API endpoints to test

Output:
```
╔═══════════════════════════════════════════════════════════╗
║     📰 NEWS DATABASE SEEDER - SAMPLE DATA 📰              ║
╚═══════════════════════════════════════════════════════════╝

💾 Connecting to MongoDB...
🗑️  Clearing existing news...
📥 Inserting 15 sample news items...

✅ Successfully inserted 15 sample news items

You can now test the news API:
  GET http://localhost:3000/news
  GET http://localhost:3000/news?page=1&limit=5
  GET http://localhost:3000/news?category=Technology
  GET http://localhost:3000/news?search=sustainability
```

#### Option B: Scrape News from SGS Website

```bash
npm run seed:news:scrape
```

This will:
- 🔍 Fetch news from https://www.sgs.com/en-gb/news
- 📰 Parse and extract 10-15 news articles
- 💾 Save all articles to MongoDB
- ✅ Display scraped data summary

---

## API Endpoints

### 1. GET /news - Get All News with Pagination

**Description:** Retrieve all news articles with pagination, filtering, and search.

**Request:**
```bash
curl http://localhost:3000/news
```

**Query Parameters:**

| Parameter | Type   | Default | Description                            |
|-----------|--------|---------|----------------------------------------|
| page      | number | 1       | Page number for pagination             |
| limit     | number | 10      | Items per page                         |
| category  | string | -       | Filter by category (case-insensitive)  |
| search    | string | -       | Search in title and description        |

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Sustainability and Corporate Social Responsibility",
      "description": "Discover how leading companies are integrating...",
      "category": "Sustainability",
      "image": "https://via.placeholder.com/400x300?text=Sustainability+News",
      "createdAt": "2026-04-02T10:30:00.000Z",
      "updatedAt": "2026-04-02T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Digital Transformation: The Future of Business",
      "description": "Learn about the latest trends in digital...",
      "category": "Technology",
      "image": "https://via.placeholder.com/400x300?text=Digital+Transformation",
      "createdAt": "2026-04-02T10:25:00.000Z",
      "updatedAt": "2026-04-02T10:25:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Usage Examples

### Example 1: Get First Page of News (Default)

```bash
curl http://localhost:3000/news
```

Returns first 10 news items with pagination info.

---

### Example 2: Get Specific Page with Custom Limit

```bash
curl http://localhost:3000/news?page=2&limit=5
```

Returns:
- News items 6-10 (2nd page, 5 items per page)
- Total count and pagination details

Response:
```json
{
  "data": [...],
  "pagination": {
    "total": 15,
    "page": 2,
    "limit": 5,
    "pages": 3,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

### Example 3: Filter News by Category

```bash
curl http://localhost:3000/news?category=Technology
```

Returns only news articles in the "Technology" category:
```json
{
  "data": [
    {
      "title": "Digital Transformation: The Future of Business Operations",
      "category": "Technology",
      ...
    },
    {
      "title": "Innovation in Testing and Inspection Technologies",
      "category": "Technology",
      ...
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### Example 4: Search News by Keyword

```bash
curl http://localhost:3000/news?search=sustainability
```

Searches for "sustainability" in title and description fields:
```json
{
  "data": [
    {
      "title": "Sustainability and Corporate Social Responsibility",
      "description": "Discover how leading companies are integrating sustainability...",
      ...
    },
    {
      "title": "Circular Economy: Moving Towards Sustainable Practices",
      "description": "The circular economy model is gaining momentum as companies...",
      ...
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### Example 5: Combine Multiple Filters

```bash
curl http://localhost:3000/news?category=Technology&page=1&limit=5
```

Get 5 Technology news items on the first page.

---

### Example 6: Search with Pagination

```bash
curl http://localhost:3000/news?search=business&page=1&limit=3
```

Search for "business" and paginate results (3 items per page).

---

## Sample Categories in Database

The sample data includes news articles in these categories:

- **Sustainability** - Environmental and CSR initiatives
- **Technology** - Digital transformation and innovation
- **Business** - General business news and trends
- **Manufacturing** - Quality assurance and industry standards
- **Safety** - Workplace safety and risk management
- **Professional Development** - Career advancement and certifications
- **Risk Management** - Risk mitigation strategies
- **Compliance** - Regulatory updates and requirements
- **Security** - Data protection and privacy
- **Career** - Job opportunities and career paths
- **Standards** - International standards and harmonization
- **Consumer Affairs** - Consumer trust and transparency

---

## Module Structure

```
src/news/
├── schemas/
│   └── news.schema.ts          # MongoDB schema definition
├── dto/
│   └── create-news.dto.ts      # Data transfer objects
├── news.controller.ts           # API endpoints
├── news.service.ts             # Business logic
└── news.module.ts              # Module definition

scripts/
├── seed-news.ts                # Web scraper script
└── seed-sample-news.ts         # Sample data seeder
```

---

## Pagination Logic

The API implements cursor-less pagination with the following features:

```typescript
interface PaginationResponse {
  total: number;        // Total number of matching documents
  page: number;         // Current page (1-indexed)
  limit: number;        // Items per page
  pages: number;        // Total number of pages
  hasNext: boolean;     // Is there a next page?
  hasPrev: boolean;     // Is there a previous page?
}
```

**How it works:**
1. User requests page=2, limit=10
2. API skips (2-1) × 10 = 10 documents
3. Returns next 10 documents
4. Calculates total pages = Math.ceil(total / limit)
5. Returns pagination metadata

---

## Error Handling

### Invalid Query Parameters

```bash
curl http://localhost:3000/news?page=abc&limit=xyz
```

Parameters are parsed as integers. Invalid values default to page=1, limit=10.

### No Results

```bash
curl http://localhost:3000/news?category=NonExistent
```

Response:
```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

## Performance Considerations

- **Indexing:** MongoDB indexes `createdAt` field for efficient sorting
- **Search:** Uses regex matching for case-insensitive search
- **Pagination:** Uses skip/limit for efficient page retrieval
- **Category Filtering:** Case-insensitive matching

For optimal performance with large datasets:
```javascript
db.news.createIndex({ "createdAt": -1 })
db.news.createIndex({ "category": 1 })
db.news.createIndex({ "title": "text", "description": "text" })
```

---

## Extending the Module

### Add New Fields to News Schema

1. Update `news.schema.ts`:
```typescript
@Prop({ required: true })
author!: string;

@Prop()
tags!: string[];
```

2. Update `create-news.dto.ts` with new fields

3. Reseed the database

---

### Add Authentication to Create/Update

Update `news.controller.ts`:
```typescript
@Post()
@UseGuards(JwtAuthGuard)
async createNews(@Body() createNewsDto: CreateNewsDto) {
  return await this.newsService.create(createNewsDto);
}
```

---

## Troubleshooting

### Issue: "Cannot find module 'cheerio'"

**Solution:** Install dependencies
```bash
npm install
```

### Issue: MongoDB connection error

**Solution:** Ensure MongoDB is running
```bash
# macOS with Homebrew
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 mongo
```

### Issue: No data returned from scraper

**Solution:** Use sample data instead
```bash
npm run seed:news:sample
```

---

## Testing the API

Use these commands to test all features:

```bash
# Get all news (default: page 1, limit 10)
curl http://localhost:3000/news

# Pagination - specific page and limit
curl http://localhost:3000/news?page=2&limit=5

# Filter by category
curl http://localhost:3000/news?category=Technology

# Search in all fields
curl http://localhost:3000/news?search=innovation

# Combine filters
curl http://localhost:3000/news?page=1&limit=5&category=Technology&search=digital
```

---

## Next Steps

1. ✅ Run `npm run seed:news:sample` to populate the database
2. ✅ Start the server: `npm run start:dev`
3. ✅ Test the API using curl commands above
4. ✅ Integrate with frontend application
5. ✅ Scale pagination as needed

---

## API Reference Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| /news | GET | Get all news with pagination | No |

**Query Parameters for GET /news:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `category` (string, optional)
- `search` (string, optional)

---

Happy coding! 🚀

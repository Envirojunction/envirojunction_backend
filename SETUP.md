# Setup Instructions for Running Seed Scripts

Before running the seed scripts, you need to install all project dependencies.

## Installation Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- `axios` - HTTP client for web scraping
- `cheerio` - HTML parsing library
- All other development and production dependencies

### Step 2: Verify Installation

Check that dependencies are installed:

```bash
ls node_modules | grep axios
ls node_modules | grep cheerio
```

You should see both packages listed.

### Step 3: Run Seed Scripts

After installation, you can run either seed script:

#### Option A: Seed with Sample Data (Recommended)
```bash
npm run seed:news:sample
```

#### Option B: Scrape News from SGS
```bash
npm run seed:news:scrape
```

## Troubleshooting

### Error: "Cannot find module 'axios'" or "Cannot find module 'cheerio'"

**Solution:** Run `npm install` (see Step 1 above)

The seed scripts require external packages that must be installed before execution.

### Error: "ts-node not found"

**Solution:** Install ts-node globally or use npx:

```bash
npx ts-node scripts/seed-sample-news.ts
```

Or install it locally:

```bash
npm install ts-node --save-dev
```

### Error: "ECONNREFUSED" when connecting to MongoDB

**Solution:** Ensure MongoDB is running:

```bash
# macOS with Homebrew
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 mongo
```

### Error: "Connection refused" on port 27017

Check that MongoDB is running on the configured port (default: 27017)

```bash
mongosh  # Test connection to MongoDB
```

## Project Structure

```
Enviro/
├── src/                          # Application source code
│   ├── news/                    # News module
│   │   ├── schemas/             # MongoDB schemas
│   │   ├── dto/                 # Data transfer objects
│   │   ├── news.controller.ts   # API endpoints
│   │   ├── news.service.ts      # Business logic
│   │   └── news.module.ts       # Module definition
│   ├── auth/                    # Authentication module
│   ├── users/                   # Users module
│   └── app.module.ts            # Root module
├── scripts/                      # Utility scripts
│   ├── seed-news.ts             # Web scraper for SGS news
│   └── seed-sample-news.ts      # Sample data seeder
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables
└── .eslintrc.json              # ESLint configuration
```

## Environment Variables

Make sure your `.env` file has:

```dotenv
MONGODB_URI=mongodb://localhost:27017/enviro_prod
JWT_SECRET=envirojunction_sk_live_5xK9mL2@qP7$vN3wR8_yJ4&tG6%sZ1!bC9^hF5*dE2-uO4x
PORT=3000
NODE_ENV=development
```

## Running the Application

1. Install dependencies: `npm install`
2. Start MongoDB: `brew services start mongodb-community`
3. Seed the database: `npm run seed:news:sample`
4. Start the server: `npm run start:dev`
5. Server will run on http://localhost:3000

## Testing the News API

Once the server is running:

```bash
# Get all news with pagination
curl http://localhost:3000/news

# Get specific page (5 items per page)
curl http://localhost:3000/news?page=1&limit=5

# Filter by category
curl http://localhost:3000/news?category=Technology

# Search for keywords
curl http://localhost:3000/news?search=sustainability
```

For more details, see [NEWS_API.md](NEWS_API.md)

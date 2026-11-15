import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // Enable CORS with specific configuration
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  const port = process.env.PORT || 3000;
  const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enviro_prod';
  const nodeEnv = process.env.NODE_ENV || 'development';

  await app.listen(port);

  // Display startup information
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║          🌍 ENVIRO JUNCTION - Backend Server 🌍           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Application is running on: http://localhost:${port}`);
  console.log(`📦 Environment: ${nodeEnv}`);
  console.log(`🗄️  Database: ${mongodbUri}`);
  console.log(`🔐 CORS enabled for origins:`);
  allowedOrigins.forEach(origin => console.log(`   - ${origin}`));
  console.log('');
  console.log('Available Endpoints:');
  console.log('  POST   /auth/signup        - Register new user');
  console.log('  POST   /auth/login         - Login user');
  console.log('  GET    /users/profile      - Get current user profile (requires JWT)');
  console.log('  GET    /users              - Get all users (requires JWT)');
  console.log('  GET    /news               - Get all news with pagination');
  console.log('  GET    /news?page=1&limit=5         - Paginated news (page 1, 5 items per page)');
  console.log('  GET    /news?category=Technology    - Filter news by category');
  console.log('  GET    /news?search=sustainable    - Search news by title or description');
  console.log('');
  console.log('ℹ️  Make sure MongoDB is running on the configured URI');
  console.log('   Connection String: ' + mongodbUri);
  console.log('');
  console.log(
  'JWT_SECRET configured:',
  !!process.env.JWT_SECRET,
);
}

bootstrap();

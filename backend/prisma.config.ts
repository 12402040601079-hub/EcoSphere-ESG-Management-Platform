import 'dotenv/config';
import { PrismaConfig, env } from '@prisma/config';

export default {
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig;

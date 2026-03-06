import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CalculationHistory } from '@/entities/CalculationHistory';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

export async function getDatabase(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH || './data/preme-cal.db';
  const absoluteDbPath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath);

  const dir = path.dirname(absoluteDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: absoluteDbPath,
    entities: [CalculationHistory],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}

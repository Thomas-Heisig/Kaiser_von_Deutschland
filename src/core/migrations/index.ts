/**
 * Database Migrations Index
 * 
 * All migrations must be registered here in order
 */

import { Migration } from '../DatabaseAdapter';
import { migration_001_initial_schema } from './001_initial_schema';

/**
 * All migrations in chronological order
 */
export const allMigrations: Migration[] = [
  migration_001_initial_schema,
  // Add new migrations here
];

/**
 * Get migrations up to a specific version
 */
export function getMigrationsUpTo(version: number): Migration[] {
  return allMigrations.filter(m => m.version <= version);
}

/**
 * Get latest migration version
 */
export function getLatestVersion(): number {
  return Math.max(...allMigrations.map(m => m.version), 0);
}

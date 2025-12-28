// src/core/database/repositories/PlayerRepository.ts

import { DatabaseAdapter } from '../DatabaseAdapter';
import { Player } from '../../Player';

/**
 * Repository for Player data persistence
 * Implements the Repository Pattern for clean separation of concerns
 */
export class PlayerRepository {
  constructor(private db: DatabaseAdapter) {}

  /**
   * Save a player to the database
   */
  async save(player: Player): Promise<void> {
    const data = player.serialize();
    
    const sql = `
      INSERT OR REPLACE INTO players (
        id, name, role_id, kingdom_name, color, treasury, prestige,
        current_year, current_month, is_ai, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;

    await this.db.execute(sql, [
      player.id,
      data.name,
      data.roleId,
      data.kingdomName || null,
      data.color,
      data.resources?.treasury || 0,
      data.prestige || 0,
      data.currentYear || 0,
      data.currentMonth || 1,
      data.isAI ? 1 : 0
    ]);
  }

  /**
   * Find a player by ID
   */
  async findById(id: string): Promise<Player | null> {
    const results = await this.db.query<any>(
      'SELECT * FROM players WHERE id = ?',
      [id]
    );

    if (results.length === 0) {
      return null;
    }

    return this.deserializePlayer(results[0]);
  }

  /**
   * Find all players
   */
  async findAll(): Promise<Player[]> {
    const results = await this.db.query<any>('SELECT * FROM players');
    return results.map(row => this.deserializePlayer(row));
  }

  /**
   * Delete a player
   */
  async delete(id: string): Promise<void> {
    await this.db.execute('DELETE FROM players WHERE id = ?', [id]);
  }

  /**
   * Count total players
   */
  async count(): Promise<number> {
    const results = await this.db.query<{ count: number }>(
      'SELECT COUNT(*) as count FROM players'
    );
    return results[0]?.count || 0;
  }

  /**
   * Find players by criteria
   */
  async findWhere(criteria: {
    isAI?: boolean;
    currentYear?: number;
  }): Promise<Player[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (criteria.isAI !== undefined) {
      conditions.push('is_ai = ?');
      params.push(criteria.isAI ? 1 : 0);
    }

    if (criteria.currentYear !== undefined) {
      conditions.push('current_year = ?');
      params.push(criteria.currentYear);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM players ${whereClause}`;

    const results = await this.db.query<any>(sql, params);
    return results.map(row => this.deserializePlayer(row));
  }

  /**
   * Helper method to deserialize database row to Player object
   */
  private deserializePlayer(row: any): Player {
    // Reconstruct the player data format expected by Player.deserialize()
    const playerData = {
      id: row.id,
      name: row.name,
      roleId: row.role_id,
      kingdomName: row.kingdom_name,
      color: row.color,
      resources: {
        treasury: row.treasury,
        // Add other resources as needed
      },
      prestige: row.prestige,
      currentYear: row.current_year,
      currentMonth: row.current_month,
      isAI: Boolean(row.is_ai),
      // Add other fields as needed
    };

    return Player.deserialize(playerData);
  }
}

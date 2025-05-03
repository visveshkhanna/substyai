/**
 * In-memory database singleton
 */
class InMemoryDB {
  private static instance: InMemoryDB;
  private store: Map<string, unknown>;

  private constructor() {
    this.store = new Map();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): InMemoryDB {
    if (!InMemoryDB.instance) {
      InMemoryDB.instance = new InMemoryDB();
    }
    return InMemoryDB.instance;
  }

  /**
   * Set a value in the database
   */
  public set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  /**
   * Get a value from the database
   */
  public get<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  /**
   * Check if a key exists in the database
   */
  public has(key: string): boolean {
    return this.store.has(key);
  }

  /**
   * Delete a key from the database
   */
  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all data from the database
   */
  public clear(): void {
    this.store.clear();
  }

  /**
   * Get all keys in the database
   */
  public keys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Get the size of the database
   */
  public size(): number {
    return this.store.size;
  }
}

// Export the singleton instance
const db = InMemoryDB.getInstance();
export default db;

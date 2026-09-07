import { mapRedditPostToSchema } from './mapper';
import { mockRedditPost } from './mock-data';

describe('Reddit Connector Validation', () => {
  test('maps Reddit posts to CivicEntity objects correctly', () => {
    const entity = mapRedditPostToSchema(mockRedditPost);
    expect(entity.id).toBe(mockRedditPost.id);
    expect(entity.source).toBe('reddit-cookeville');
    expect(entity.type).toBe('post');
    expect(entity.content).toContain('park');
  });

  test('includes all required CivicEntity fields', () => {
    const entity = mapRedditPostToSchema(mockRedditPost);
    
    // Check required fields exist
    expect(entity).toHaveProperty('id');
    expect(entity).toHaveProperty('timestamp');
    expect(entity).toHaveProperty('reliability');
    expect(entity).toHaveProperty('engagementScore');
    expect(entity).toHaveProperty('numComments');
    expect(entity).toHaveProperty('outcomes');
    expect(entity).toHaveProperty('voteResult');
  });

  test('maintains proper property values', () => {
    const entity = mapRedditPostToSchema(mockRedditPost);
    
    // Check that required properties have expected values or types
    expect(typeof entity.engagementScore).toBe('number');
    expect(typeof entity.numComments).toBe('number');
    expect(entity.engagementScore).toBeGreaterThan(0);
    expect(entity.numComments).toBeGreaterThan(0);
    expect(entity.voteResult).toBe('approved'); // Based on our mock data ups > downs
  });
});
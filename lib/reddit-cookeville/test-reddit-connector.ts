// lib/connectors/reddit-cookeville/test-reddit-connector.ts
/**
 * Test script for Reddit r/cookeville connector.
 * Run with: npx ts-node --esm lib/connectors/reddit-cookeville/test-reddit-connector.ts
 */
import { redditScraper } from "./scraper";
import { mapRedditPostToSchema } from "./mapper";

async function runTests() {
  console.log("🧪 Testing Reddit r/cookeville Connector...\n");

  // Check if credentials are set
  const hasClientId = !!process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_ID !== "YOUR_REDDIT_CLIENT_ID";
  const hasRefreshToken = !!process.env.REDDIT_REFRESH_TOKEN && process.env.REDDIT_REFRESH_TOKEN !== "YOUR_REDDIT_REFRESH_TOKEN";

  if (!hasClientId || !hasRefreshToken) {
    console.warn("⚠️  Reddit credentials not fully set. Using mock data for test.");
    console.log("   Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_REFRESH_TOKEN environment variables for live test.\n");
    
    // Mock test with sample data
    const mockPost = {
      id: "abc123",
      title: "Community meeting about new park",
      selftext: "The town hall is discussing the new park project next Tuesday...",
      author: "u/cookeville_resident",
      created_utc: Math.floor(Date.now() / 1000),
      ups: 42,
      downs: 2,
      num_comments: 15,
      permalink: "/r/cookeville/comments/abc123/community_meeting_about_new_park/",
      url: "https://reddit.com/r/cookeville/comments/abc123/community_meeting_about_new_park/"
    };

    console.log("✅ Mock post mapping test:");
    const mapped = mapRedditPostToSchema(mockPost);
    console.log(`   ID: ${mapped.id}`);
    console.log(`   Source: ${mapped.source}`);
    console.log(`   Title: ${mapped.title}`);
    console.log(`   Content length: ${mapped.content.length} chars`);
    console.log(`   Reliability: ${mapped.reliability}`);
    return;
  }

  try {
    // Test 1: Fetch posts
    console.log("📥 Fetching subreddit posts...");
    const posts = await redditScraper.fetchNewPosts();
    console.log(`✅ Fetched ${posts.length} posts`);
    
    if (posts.length > 0) {
      console.log("\n📄 Sample post:");
      const sample = posts[0];
      console.log(`   ID: ${sample.id}`);
      console.log(`   Title: ${sample.title?.substring(0, 80)}...`);
      console.log(`   Author: ${sample.author}`);
      console.log(`   Created: ${new Date(sample.created_utc * 1000).toISOString()}`);
      console.log(`   Score: ${sample.ups - sample.downs}`);
      console.log(`   Comments: ${sample.num_comments}`);

      // Test 2: Fetch comments for first post
      console.log("\n💬 Fetching comments for first post...");
      const comments = await redditScraper.fetchPostComments(sample.id);
      console.log(`✅ Fetched ${comments.length} comments`);
      
      if (comments.length > 0) {
        console.log("\n💬 Sample comment:");
        const commentSample = comments[0];
        console.log(`   ID: ${commentSample.id}`);
        console.log(`   Body: ${commentSample.body?.substring(0, 80)}...`);
        console.log(`   Author: ${commentSample.author}`);
        console.log(`   Score: ${commentSample.ups - commentSample.downs}`);
      }
    }
    
    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error("Test runner crashed:", e);
  process.exit(1);
});
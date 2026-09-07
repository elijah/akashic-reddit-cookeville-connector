import { CivicEntity } from './types';


export function mapRedditPostToSchema(post: {
  id: string;
  title: string;
  selftext?: string;
  author: string;
  created_utc: number;
  ups: number;
  downs: number;
  num_comments: number;
  permalink: string;
  url: string;
}): CivicEntity {
  return {
    id: post.id,
    source: "reddit-cookeville",
    timestamp: new Date(post.created_utc * 1000).toISOString(),
    reliability: "medium",
    title: post.title,
    date: new Date(post.created_utc * 1000).toISOString().split('T')[0],
    content: post.title + (post.selftext || ""),
    engagementScore: post.ups + post.downs,
    numComments: post.num_comments,
    type: 'post',
    outcomes: [],
    voteResult: post.ups > post.downs ? 'approved' : 'rejected'
  };
}
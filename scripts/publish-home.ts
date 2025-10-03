/* eslint-disable no-console */
import { createClient } from 'next-sanity';

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '4ot323fc';
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  console.error('Missing SANITY_AUTH_TOKEN/SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: process.env.SANITY_API_VERSION || '2025-01-01', token, useCdn: false, perspective: 'previewDrafts' as any });

async function run() {
  const home = await client.fetch<any>();
  if (!home?._id) {
    console.error('Homepage not found');
    process.exit(1);
  }
  const draftId: string | null = home._id.startsWith('drafts.') ? home._id : null;
  const publishedId = draftId ? home._id.replace('drafts.', '') : home._id;

  // Always publish by replacing the published doc with latest draft (or itself if already published)
  const doc = { ...home, _id: publishedId };
  // Remove system fields that cannot be set
  delete doc._rev;
  delete doc._createdAt;
  delete doc._updatedAt;

  await client.createOrReplace(doc);
  console.log('Published homepage:', publishedId);
}

run().catch((e) => { console.error(e); process.exit(1); });


#!/usr/bin/env node
// Interactive script to scaffold a new story folder.
// Usage: npm run add-story
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORIES_DIR = path.resolve(__dirname, '..', 'stories');

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function nextFolderName() {
  let max = 0;
  if (fs.existsSync(STORIES_DIR)) {
    for (const entry of fs.readdirSync(STORIES_DIR)) {
      const m = entry.match(/^story-(\d+)$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return `story-${String(max + 1).padStart(3, '0')}`;
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, (a) => resolve(a.trim())));
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const title = await ask(rl, 'Story title: ');
  if (!title) {
    console.error('Title is required. Aborting.');
    rl.close();
    process.exit(1);
  }
  const author = (await ask(rl, 'Author [Admin]: ')) || 'Admin';
  const category = (await ask(rl, 'Category [Adventure]: ')) || 'Adventure';
  const description = await ask(rl, 'Short description: ');
  rl.close();

  const folderName = nextFolderName();
  const slug = slugify(title) || folderName;
  const folderPath = path.join(STORIES_DIR, folderName);

  fs.mkdirSync(folderPath, { recursive: true });

  const metadata = {
    title,
    slug,
    description,
    author,
    category,
    featuredImage: 'image1.jpg',
    uploadDate: new Date().toISOString(),
  };
  fs.writeFileSync(
    path.join(folderPath, 'metadata.json'),
    JSON.stringify(metadata, null, 2) + '\n'
  );

  const storyTemplate = `# ${title}\n\nWrite the first section of your story here.\n\nWrite the second section here. Each blank-line-separated block becomes a section, and one image is shown after each section on the reading page.\n\nContinue your story across as many sections as you like.\n`;
  fs.writeFileSync(path.join(folderPath, 'story.md'), storyTemplate);

  // Create a README inside the folder reminding the author to add 10 images.
  const imgNote = `Add 10 images named image1.jpg .. image10.jpg in this folder.\nSupported: .jpg .jpeg .png .webp .gif .svg\n`;
  fs.writeFileSync(path.join(folderPath, 'IMAGES_README.txt'), imgNote);

  console.log(`\nCreated ${path.relative(process.cwd(), folderPath)}`);
  console.log('Next steps:');
  console.log('  1. Edit metadata.json if needed');
  console.log('  2. Write your story in story.md (blank lines separate sections)');
  console.log('  3. Add image1.jpg .. image10.jpg to the folder');
  console.log('  4. The story publishes automatically. No code changes needed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getStory, getAbsoluteImageUrl } from '../../../lib/api';
import { AdInline, AdSidebar } from '../../../components/Ads';
import { canonical, formatDate, SITE_NAME } from '../../../lib/site';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  try {
    const { data: story } = await getStory(params.slug);
    const url = canonical(`/story/${story.slug}`);
    const featuredImageUrl = getAbsoluteImageUrl(story.featuredImage);
    return {
      title: story.title,
      description: story.description,
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        title: story.title,
        description: story.description,
        url,
        siteName: SITE_NAME,
        images: featuredImageUrl ? [{ url: featuredImageUrl }] : [],
        publishedTime: story.uploadDate,
        authors: [story.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: story.title,
        description: story.description,
        images: featuredImageUrl ? [featuredImageUrl] : [],
      },
    };
  } catch {
    return { title: 'Story' };
  }
}

export default async function StoryPage({ params }) {
  let story;
  try {
    const res = await getStory(params.slug);
    story = res.data;
  } catch {
    notFound();
  }
  if (!story) notFound();

  const sections = story.sections || [];
  const images = story.images?.map(getAbsoluteImageUrl) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.description,
    author: { '@type': 'Person', name: story.author },
    datePublished: story.uploadDate,
    image: images,
    articleSection: story.category,
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <article className="min-w-0 flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="mb-6">
          <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
            {story.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{story.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            By {story.author} · {formatDate(story.uploadDate)}
          </p>
          <p className="mt-3 text-lg text-gray-700">{story.description}</p>
        </header>

        <div className="prose-story max-w-none">
          {sections.map((section, i) => (
            <div key={i}>
              <div dangerouslySetInnerHTML={{ __html: section.html }} />
              {images[i] && (
                <figure className="my-6 overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={images[i]}
                    alt={`${story.title} – illustration ${i + 1}`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="h-auto w-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    priority={i === 0}
                  />
                </figure>
              )}
              {/* Ads after image 3 and image 7 */}
              {i === 2 && <AdInline label="story-after-image-3" />}
              {i === 6 && <AdInline label="story-after-image-7" />}
            </div>
          ))}

          {/* Any remaining images beyond the number of sections */}
          {images.slice(sections.length).map((src, idx) => (
            <figure key={`extra-${idx}`} className="my-6 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={src}
                alt={`${story.title} – illustration ${sections.length + idx + 1}`}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 800px"
                className="h-auto w-full object-cover"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </article>

      <div className="w-full lg:w-56 lg:flex-shrink-0">
        <AdSidebar />
      </div>
    </div>
  );
}

import { MetadataRoute } from 'next';
import { PROJECTS } from './data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const projectUrls = PROJECTS.map((project) => ({
    url: `https://rjindustries.dev/project/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    {
      url: 'https://rjindustries.dev',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://rjindustries.dev/product',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://rjindustries.dev/academy',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: 'https://rjindustries.dev/team',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...projectUrls,
  ];
}

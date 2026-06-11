import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/constants';

export default function robots(): MetadataRoute.Robots {
    const isProduction =
        process.env.VERCEL_ENV === 'production' ||
        (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV);

    if (!isProduction) {
        return {
            rules: { userAgent: '*', disallow: '/' },
        };
    }

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/_next/', '/static/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}

import type { Event, Post, SiteSettings } from '@/lib/database.types';
import { CHURCH_NAME, SITE_URL } from './constants';

const DAY_TO_SCHEMA: Record<string, string> = {
    'segunda-feira': 'Monday',
    'terça-feira': 'Tuesday',
    'terca-feira': 'Tuesday',
    'quarta-feira': 'Wednesday',
    'quinta-feira': 'Thursday',
    'sexta-feira': 'Friday',
    'sábado': 'Saturday',
    'sabado': 'Saturday',
    'domingo': 'Sunday',
};

function toSchemaDay(dayOfWeek: string): string | undefined {
    const normalized = dayOfWeek.trim().toLowerCase();
    const key = Object.keys(DAY_TO_SCHEMA).find((day) => normalized.includes(day));
    return key ? DAY_TO_SCHEMA[key] : undefined;
}

function normalizeTime(time: string): string {
    return time.length === 5 ? time : time.slice(0, 5);
}

export function generateChurchSchema(settings: SiteSettings | null): object {
    const sameAs = settings?.instagram_url
        ? [settings.instagram_url]
        : ['https://www.instagram.com/assembleiasacramento/'];

    return {
        '@context': 'https://schema.org',
        '@type': 'Church',
        name: settings?.church_name || CHURCH_NAME,
        description:
            'Uma comunidade de fé dedicada a adorar a Deus e servir ao próximo.',
        address: {
            '@type': 'PostalAddress',
            streetAddress: settings?.church_address || 'Rua Carlos R da Cunha n° 90',
            addressLocality: settings?.church_city?.split('/')[0]?.trim() || 'Sacramento',
            addressRegion: settings?.church_city?.includes('/')
                ? settings.church_city.split('/')[1]?.trim()
                : 'MG',
            postalCode: settings?.church_cep || '38190-000',
            addressCountry: 'BR',
        },
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-igreja.png`,
        sameAs,
        telephone: settings?.phone ? `+55-${settings.phone.replace(/\D/g, '')}` : '+55-34-98432-7019',
        email: settings?.email || undefined,
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Tuesday',
                opens: '19:30',
                closes: '21:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Thursday',
                opens: '19:30',
                closes: '21:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '09:00',
                closes: '10:30',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '19:00',
                closes: '21:00',
            },
        ],
    };
}

export function generateEventsSchema(
    events: Event[],
    settings: SiteSettings | null
): object[] {
    const location = {
        '@type': 'Place',
        name: settings?.church_name || CHURCH_NAME,
        address: {
            '@type': 'PostalAddress',
            streetAddress: settings?.church_address || 'Rua Carlos R da Cunha n° 90',
            addressLocality: settings?.church_city?.split('/')[0]?.trim() || 'Sacramento',
            addressRegion: 'MG',
            postalCode: settings?.church_cep || '38190-000',
            addressCountry: 'BR',
        },
    };

    return events
        .filter((event) => event.active)
        .map((event) => {
            const schemaDay = toSchemaDay(event.day_of_week);
            const eventSchema: Record<string, unknown> = {
                '@context': 'https://schema.org',
                '@type': 'Event',
                name: event.title,
                description: event.description || event.title,
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                eventStatus: 'https://schema.org/EventScheduled',
                location,
                organizer: {
                    '@type': 'Organization',
                    name: settings?.church_name || CHURCH_NAME,
                    url: SITE_URL,
                },
            };

            if (schemaDay) {
                eventSchema.eventSchedule = {
                    '@type': 'Schedule',
                    byDay: `https://schema.org/${schemaDay}`,
                    startTime: normalizeTime(event.time_start),
                    endTime: event.time_end ? normalizeTime(event.time_end) : undefined,
                    scheduleTimezone: 'America/Sao_Paulo',
                    repeatFrequency: 'P1W',
                };
            }

            return eventSchema;
        });
}

export function generateBreadcrumbSchema(
    items: { label: string; href: string }[]
): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`,
        })),
    };
}

/**
 * Generates Schema.org structured data for an article
 */
export function generateArticleSchema(post: Post): object {
    const schemaType = post.schema_type || 'Article';
    const url = `${SITE_URL}/${post.type === 'study' ? 'estudos' : 'blog'}/${post.slug || post.id}`;
    const image = post.og_image || post.cover_image || `${SITE_URL}/images/og-image.jpg`;

    const baseSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: post.title,
        description: post.excerpt || post.description,
        image: image,
        datePublished: post.created_at,
        dateModified: post.updated_at,
        author: post.author
            ? {
                  '@type': 'Person',
                  name: post.author,
              }
            : {
                  '@type': 'Organization',
                  name: CHURCH_NAME,
              },
        publisher: {
            '@type': 'Organization',
            name: CHURCH_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/images/logo-igreja.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
        url: url,
    };

    if (post.keywords && post.keywords.length > 0) {
        baseSchema.keywords = post.keywords.join(', ');
    } else if (post.tags && post.tags.length > 0) {
        baseSchema.keywords = post.tags.join(', ');
    }

    if (schemaType === 'BlogPosting' && post.content) {
        const textContent = post.content.replace(/<[^>]*>/g, '').substring(0, 5000);
        baseSchema.articleBody = textContent;
    }

    if (post.content) {
        const textContent = post.content.replace(/<[^>]*>/g, '');
        const wordCount = textContent.split(/\s+/).filter((w) => w.length > 0).length;
        if (wordCount > 0) {
            baseSchema.wordCount = wordCount;
        }
    }

    baseSchema.inLanguage = 'pt-BR';

    return baseSchema;
}

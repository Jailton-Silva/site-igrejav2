import { Header, Footer } from '@/components';
import PostsPageContent from '@/components/posts/PostsPageContent';
import { serverApi } from '@/services/server';
import { generatePageMetadata } from '@/lib/seo/pageMetadata';
import type { Post, PageBanner } from '@/lib/database.types';

export const metadata = generatePageMetadata({
    title: 'Estudos e Reflexões',
    description:
        'Estudos bíblicos e reflexões para fortalecer sua fé na Assembleia de Deus Missão de Sacramento/MG.',
    path: '/estudos',
    keywords: ['estudos bíblicos', 'reflexões cristãs', 'Sacramento MG', 'Palavra de Deus'],
});

export default async function EstudosPage() {
    let posts: Post[] = [];
    let banner: PageBanner | null = null;
    let topPosts: Post[] = [];

    try {
        const results = await Promise.allSettled([
            serverApi.getAllPostsByType('study'),
            serverApi.getPageBanner('estudos'),
            serverApi.getTopPostsThisMonth('study', 8),
        ]);

        posts = results[0].status === 'fulfilled' ? results[0].value : [];
        banner = results[1].status === 'fulfilled' ? results[1].value : null;
        topPosts = results[2].status === 'fulfilled' ? results[2].value : [];
    } catch (error) {
        console.error('Erro ao carregar dados da página de estudos:', error);
    }

    return (
        <>
            <Header settings={null} />
            <main>
                <PostsPageContent
                    initialPosts={posts}
                    pageType="study"
                    banner={banner}
                    topPosts={topPosts}
                />
            </main>
            <Footer settings={null} />
        </>
    );
}

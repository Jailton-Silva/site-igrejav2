import { renderContent } from '@/lib/content/renderer';

interface ServerContentProps {
    content: string;
    className?: string;
}

export default async function ServerContent({ content, className = '' }: ServerContentProps) {
    const html = await renderContent(content);

    return (
        <div
            className={`text-[var(--color-text-secondary)] leading-relaxed ${className}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

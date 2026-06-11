import { serverApi } from '@/services/server';
import { generateChurchSchema } from '@/lib/seo/schema';
import JsonLd from './JsonLd';

export default async function ChurchStructuredData() {
    let settings = null;

    try {
        settings = await serverApi.getSettings();
    } catch {
        // Usa valores padrão do schema
    }

    return <JsonLd data={generateChurchSchema(settings)} />;
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Loader2, MapPin, Mail, Phone, Instagram, Calendar } from 'lucide-react';
import { AdminPageHeader, AdminPanel } from '@/components/admin';
import { api } from '@/services/api';
import { SiteSettings } from '@/lib/database.types';
import toast from 'react-hot-toast';
import { triggerContentRevalidation } from '@/lib/admin/triggerRevalidation';

export default function AdminConfiguracoesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        church_name: '',
        church_address: '',
        church_city: '',
        church_cep: '',
        phone: '',
        email: '',
        instagram_url: '',
        instagram_handle: '',
        google_maps_embed: '',
        google_calendar_embed: '',
    });

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const data = await api.getAdminSettings() as SiteSettings | null;
            if (data) {
                setFormData({
                    church_name: data.church_name || '',
                    church_address: data.church_address || '',
                    church_city: data.church_city || '',
                    church_cep: data.church_cep || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    instagram_url: data.instagram_url || '',
                    instagram_handle: data.instagram_handle || '',
                    google_maps_embed: data.google_maps_embed || '',
                    google_calendar_embed: data.google_calendar_embed || '',
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await api.updateSettings({
                church_name: formData.church_name,
                church_address: formData.church_address,
                church_city: formData.church_city,
                church_cep: formData.church_cep,
                phone: formData.phone,
                email: formData.email,
                instagram_url: formData.instagram_url,
                instagram_handle: formData.instagram_handle,
                google_maps_embed: formData.google_maps_embed || undefined,
                google_calendar_embed: formData.google_calendar_embed || undefined,
            });
            toast.success('Configurações salvas com sucesso!');
            await triggerContentRevalidation();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Erro ao salvar configurações. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Configurações"
                description="Configure as informações gerais do site"
            />

            <AdminPanel isLoading={isLoading} loadingMessage="Carregando configurações...">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Church Info */}
                    <div>
                        <h2 className="admin-section-title mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> Informações da Igreja</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="admin-label mb-1">Nome da Igreja</label><input type="text" value={formData.church_name} onChange={(e) => setFormData((p) => ({ ...p, church_name: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="admin-label mb-1">Endereço</label><input type="text" value={formData.church_address} onChange={(e) => setFormData((p) => ({ ...p, church_address: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="admin-label mb-1">Cidade/Estado</label><input type="text" value={formData.church_city} onChange={(e) => setFormData((p) => ({ ...p, church_city: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="admin-label mb-1">CEP</label><input type="text" value={formData.church_cep} onChange={(e) => setFormData((p) => ({ ...p, church_cep: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="admin-section-title mb-4 flex items-center gap-2"><Mail className="w-5 h-5" /> Contato</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="admin-label mb-1">Telefone/WhatsApp</label><input type="text" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="admin-label mb-1">E-mail</label><input type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h2 className="admin-section-title mb-4 flex items-center gap-2"><Instagram className="w-5 h-5" /> Redes Sociais</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label className="admin-label mb-1">URL do Instagram</label><input type="url" value={formData.instagram_url} onChange={(e) => setFormData((p) => ({ ...p, instagram_url: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                            <div><label className="admin-label mb-1">Handle do Instagram</label><input type="text" value={formData.instagram_handle} onChange={(e) => setFormData((p) => ({ ...p, instagram_handle: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" /></div>
                        </div>
                    </div>

                    {/* Embed */}
                    <div>
                        <h2 className="admin-section-title mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Integrações</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="admin-label mb-1">URL do Google Maps Embed</label>
                                <input type="url" value={formData.google_maps_embed} onChange={(e) => setFormData((p) => ({ ...p, google_maps_embed: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://www.google.com/maps/embed?..." />
                                <p className="admin-help mt-1">Exibido na seção de contato da página inicial.</p>
                            </div>
                            <div>
                                <label className="admin-label mb-1">URL do Google Calendar Embed</label>
                                <input type="url" value={formData.google_calendar_embed} onChange={(e) => setFormData((p) => ({ ...p, google_calendar_embed: e.target.value }))} className="w-full px-4 py-2 rounded-[10px] border focus:border-[var(--color-accent)] outline-none" placeholder="https://calendar.google.com/calendar/embed?..." />
                                <p className="admin-help mt-1">Exibido na seção de agenda da página inicial.</p>
                            </div>
                        </div>
                    </div>

                        <button type="submit" disabled={isSaving} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-accent)] text-white rounded-[30px] hover:bg-[var(--color-accent-light)] disabled:opacity-70">{isSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Salvando...</> : <><Save className="w-5 h-5" />Salvar Configurações</>}</button>
                    </form>
                </motion.div>
            </AdminPanel>
        </div>
    );
}

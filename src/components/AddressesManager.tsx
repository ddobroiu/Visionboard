"use client";

import { useEffect, useState } from "react";
import JudetSelector from "./JudetSelector";
import LocalitateSelector from "./LocalitateSelector";
import { DPD_COUNTRIES } from "@/lib/shippingUtils";
import { COUNTRY_REGIONS } from "@/lib/regionsData";

type Address = {
    id?: string;
    type?: "shipping" | "billing" | null;
    label?: string | null;
    nume?: string | null;
    telefon?: string | null;
    email?: string | null;
    company?: string | null;
    cui?: string | null;
    regCom?: string | null;
    country: string;
    judet: string;
    localitate: string;
    strada_nr: string;
    postCode?: string | null;
    bloc?: string | null;
    scara?: string | null;
    etaj?: string | null;
    ap?: string | null;
    interfon?: string | null;
    isDefault?: boolean;
};

export default function AddressesManager() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<Address>({ type: "shipping", country: "RO", judet: "", localitate: "", strada_nr: "" });
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/account/addresses", { cache: "no-store" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Eroare la încărcarea adreselor");
            setAddresses(data.addresses || []);
        } catch (e: any) {
            setError(e?.message || "Eroare");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function onForm<K extends keyof Address>(k: K, v: Address[K]) {
        setForm((prev) => ({ ...prev, [k]: v }));
    }

    async function saveNew() {
        setSaving(true);
        try {
            const res = await fetch("/api/account/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data?.error || "Nu s-a putut salva adresa");
            setForm({ type: "shipping", country: "RO", judet: "", localitate: "", strada_nr: "" });
            await load();
        } catch (e: any) {
            alert(e?.message || "Eroare la salvare");
        } finally {
            setSaving(false);
        }
    }

    async function update(id: string, patch: Partial<Address>) {
        try {
            const res = await fetch(`/api/account/addresses/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data?.error || "Nu s-a putut actualiza adresa");
            setEditingId(null);
            await load();
        } catch (e: any) {
            alert(e?.message || "Eroare la actualizare");
        }
    }

    async function remove(id: string) {
        if (!confirm("Ștergi această adresa?")) return;
        try {
            const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) throw new Error(data?.error || "Nu s-a putut șterge");
            await load();
        } catch (e: any) {
            alert(e?.message || "Eroare la ștergere");
        }
    }

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center text-sm font-black">+</span>
                    Adaugă o adresă nouă
                </h2>

                <div className="flex w-full overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl mb-6 p-1 bg-slate-50 dark:bg-slate-950 max-w-sm">
                    <button type="button" onClick={() => onForm("type", "shipping")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 ${form.type === "shipping" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-500"}`}>Livrare</button>
                    <button type="button" onClick={() => onForm("type", "billing")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-200 ${form.type === "billing" ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm" : "text-slate-500"}`}>Facturare</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <Field id="form.country" label="Țară">
                            <select className={inputCls()} value={form.country} onChange={(e) => { const c = e.target.value; setForm(p => ({ ...p, country: c, judet: '', localitate: '' })); }}>
                                {DPD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                            </select>
                        </Field>
                    </div>

                    <div className="md:col-span-2">
                        <Field id="form.label" label="Etichetă adresă">
                            <input className={inputCls()} placeholder="Acasa, Birou, etc." value={form.label || ""} onChange={(e) => onForm("label", e.target.value)} />
                        </Field>
                    </div>

                    {form.type === "billing" && (
                        <>
                            <div className="md:col-span-2">
                                <Field id="form.company" label="Denumire Companie">
                                    <input className={inputCls()} placeholder="SC Exemplu SRL" value={form.company || ""} onChange={(e) => onForm("company", e.target.value)} />
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field id="form.cui" label="CUI / CIF">
                                    <input className={inputCls()} placeholder="RO12345678" value={form.cui || ""} onChange={(e) => onForm("cui", e.target.value)} />
                                </Field>
                            </div>
                            <div className="md:col-span-1">
                                <Field id="form.regCom" label="Nr. Reg. Com.">
                                    <input className={inputCls()} placeholder="J40/123/2023" value={form.regCom || ""} onChange={(e) => onForm("regCom", e.target.value)} />
                                </Field>
                            </div>
                        </>
                    )}

                    <div className="md:col-span-2">
                        <Field id="form.nume" label="Nume și Prenume">
                            <input className={inputCls()} placeholder="Popescu Ion" value={form.nume || ""} onChange={(e) => onForm("nume", e.target.value)} />
                        </Field>
                    </div>

                    <div className="md:col-span-2">
                        <Field id="form.telefon" label="Număr de telefon">
                            <input className={inputCls()} placeholder="07xxxxxxx" value={form.telefon || ""} onChange={(e) => onForm("telefon", e.target.value)} />
                        </Field>
                    </div>

                    {form.country === 'RO' ? (
                        <>
                            <div className="md:col-span-2">
                                <JudetSelector label="Județ" value={form.judet} onChange={v => onForm("judet", v)} disabled={saving} />
                            </div>
                            <div className="md:col-span-2">
                                <LocalitateSelector label="Localitate" judet={form.judet} value={form.localitate} onChange={v => onForm("localitate", v)} onPostCodeChange={v => onForm("postCode", v)} disabled={saving || !form.judet} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="md:col-span-2">
                                {COUNTRY_REGIONS[form.country] ? (
                                    <Field id="form.judet" label="Regiune / Stat">
                                        <select className={inputCls()} value={form.judet} onChange={(e) => onForm("judet", e.target.value)}>
                                            <option value="">Selectează regiunea</option>
                                            {COUNTRY_REGIONS[form.country].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </Field>
                                ) : (
                                    <Field id="form.judet" label="Regiune / Stat">
                                        <input className={inputCls()} placeholder="Regiune internațională" value={form.judet} onChange={(e) => onForm("judet", e.target.value)} />
                                    </Field>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <Field id="form.localitate" label="Oraș / Localitate">
                                    <input className={inputCls()} placeholder="Oraș" value={form.localitate} onChange={(e) => onForm("localitate", e.target.value)} />
                                </Field>
                            </div>
                        </>
                    )}

                    <div className="md:col-span-3">
                        <Field id="form.strada_nr" label="Adresă (Stradă, număr, bloc, sc., etaj, ap.)">
                            <input className={inputCls()} placeholder="Str. Exemplului nr. 10, Bl. 1, Sc. A, tralala" value={form.strada_nr} onChange={(e) => onForm("strada_nr", e.target.value)} />
                        </Field>
                    </div>

                    <div className="md:col-span-1">
                        <Field id="form.postCode" label="Cod poștal">
                            <input className={inputCls()} placeholder="000000" value={form.postCode || ""} onChange={(e) => onForm("postCode", e.target.value)} />
                        </Field>
                    </div>


                    <div className="md:col-span-4 flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input type="checkbox" checked={!!form.isDefault} onChange={(e) => onForm("isDefault", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-slate-600 dark:text-slate-400 font-medium">Setează ca implicită</span>
                        </label>
                        <button onClick={saveNew} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50">
                            {saving ? 'Se salvează...' : 'Adaugă adresa'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-slate-900 dark:text-white">
                <div className="p-6 font-bold text-lg border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    Adresele tale salvate
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold rounded-full">{addresses.length}</span>
                </div>

                {loading ? <div className="p-12 text-center text-sm text-slate-500 animate-pulse">Se încarcă...</div> : addresses.length === 0 ? <div className="p-20 text-center text-slate-500 italic">Nu ai nicio adresă salvată încă.</div> : (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {addresses.map((a) => (
                            <div key={a.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                {editingId === a.id ? <EditRow a={a} onCancel={() => setEditingId(null)} onSave={(patch) => update(a.id!, patch)} /> : (
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-black uppercase tracking-tight">{a.label || (a.type === 'billing' ? 'Facturare' : 'Livrare')}</h3>
                                                {a.isDefault && <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md border border-emerald-500/20">Implicit</span>}
                                                <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${a.type === 'billing' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'}`}>
                                                    {a.type === 'billing' ? 'Factură' : 'Livrare'}
                                                </span>
                                            </div>
                                            {a.company && <div className="text-sm font-black text-slate-900 dark:text-white mb-1">{a.company} {a.cui ? `(CUI: ${a.cui})` : ''}</div>}
                                            <div className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">{a.nume || ''}{a.telefon ? ` • ${a.telefon}` : ''}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                {a.strada_nr}, {a.localitate}, {a.judet}, {a.country === 'RO' ? 'România' : a.country}{a.postCode ? ` (${a.postCode})` : ''}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 self-start">
                                            {a.type === 'shipping' && !a.isDefault && <button className="px-3 py-1.5 text-xs font-black uppercase text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg border border-indigo-600/20 transition-all" onClick={() => update(a.id!, { isDefault: true })}>Setează Implicit</button>}
                                            <button className="px-3 py-1.5 text-xs font-black uppercase text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all" onClick={() => setEditingId(a.id!)}>Editează</button>
                                            <button className="px-3 py-1.5 text-xs font-black uppercase text-red-600 hover:bg-red-500 hover:text-white rounded-lg border border-red-200 transition-all" onClick={() => remove(a.id!)}>Șterge</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function EditRow({ a, onCancel, onSave }: { a: Address; onCancel: () => void; onSave: (patch: Partial<Address>) => void }) {
    const [f, setF] = useState<Address>({ ...a });
    const [saving, setSaving] = useState(false);
    const on = <K extends keyof Address>(k: K, v: Address[K]) => setF((p) => ({ ...p, [k]: v }));
    async function submit() { setSaving(true); try { await onSave({ ...f }); } finally { setSaving(false); } }

    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
                <Field id="edit.country" label="Țară">
                    <select className={inputCls()} value={f.country} onChange={(e) => { const c = e.target.value; setF(p => ({ ...p, country: c, judet: '', localitate: '' })); }}>
                        {DPD_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                </Field>
            </div>
            <div className="md:col-span-2">
                <Field id="edit.label" label="Etichetă">
                    <input className={inputCls()} value={f.label || ''} onChange={(e) => on('label', e.target.value)} />
                </Field>
            </div>
            {f.type === 'billing' && (
                <>
                    <div className="md:col-span-2">
                        <Field id="edit.company" label="Companie">
                            <input className={inputCls()} value={f.company || ''} onChange={(e) => on('company', e.target.value)} />
                        </Field>
                    </div>
                    <div className="md:col-span-1">
                        <Field id="edit.cui" label="CUI">
                            <input className={inputCls()} value={f.cui || ''} onChange={(e) => on('cui', e.target.value)} />
                        </Field>
                    </div>
                    <div className="md:col-span-1">
                        <Field id="edit.regCom" label="Reg. Com.">
                            <input className={inputCls()} value={f.regCom || ''} onChange={(e) => on('regCom', e.target.value)} />
                        </Field>
                    </div>
                </>
            )}
            <div className="md:col-span-2">
                <Field id="edit.nume" label="Nume">
                    <input className={inputCls()} value={f.nume || ''} onChange={(e) => on('nume', e.target.value)} />
                </Field>
            </div>
            <div className="md:col-span-2">
                <Field id="edit.telefon" label="Telefon">
                    <input className={inputCls()} value={f.telefon || ''} onChange={(e) => on('telefon', e.target.value)} />
                </Field>
            </div>
            {f.country === 'RO' ? (
                <>
                    <div className="md:col-span-2">
                        <JudetSelector label="Județ" value={f.judet} onChange={v => on('judet', v)} />
                    </div>
                    <div className="md:col-span-2">
                        <LocalitateSelector label="Localitate" judet={f.judet} value={f.localitate} onChange={v => on('localitate', v)} onPostCodeChange={pc => on('postCode', pc)} />
                    </div>
                </>
            ) : (
                <>
                    <div className="md:col-span-2">
                        {COUNTRY_REGIONS[f.country] ? (
                            <Field id="edit.judet" label="Regiune">
                                <select className={inputCls()} value={f.judet} onChange={e => on('judet', e.target.value)}>
                                    <option value="">Selectează regiunea</option>
                                    {COUNTRY_REGIONS[f.country].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </Field>
                        ) : (
                            <Field id="edit.judet" label="Regiune">
                                <input className={inputCls()} value={f.judet} onChange={(e) => on('judet', e.target.value)} />
                            </Field>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <Field id="edit.localitate" label="Oraș">
                            <input className={inputCls()} value={f.localitate} onChange={(e) => on('localitate', e.target.value)} />
                        </Field>
                    </div>
                </>
            )}
            <div className="md:col-span-3">
                <Field id="edit.strada_nr" label="Adresă (Stradă, număr, bloc, sc., etaj, ap.)">
                    <input className={inputCls()} value={f.strada_nr} onChange={(e) => on('strada_nr', e.target.value)} />
                </Field>
            </div>
            <div className="md:col-span-1">
                <Field id="edit.postCode" label="Cod poștal">
                    <input className={inputCls()} value={f.postCode || ''} onChange={(e) => on('postCode', e.target.value)} />
                </Field>
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl font-bold" onClick={onCancel}>Anulează</button>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg" onClick={submit} disabled={saving}>{saving ? '...' : 'Salvează'}</button>
            </div>
        </div>
    );
}

function Field({ id, label, children, error, disabled }: { id: string; label: string; children: React.ReactNode; error?: string; disabled?: boolean }) {
    return (
        <div className={`text-sm block ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
            <span className="mb-1.5 block font-bold text-slate-700 dark:text-slate-200">{label}</span>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function inputCls(hasError?: string, disabled?: boolean) {
    return `w-full rounded-xl border px-4 py-2.5 focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 focus:ring-indigo-500 placeholder-slate-400 font-medium transition-all ${hasError ? "border-red-500 ring-1 ring-red-500/20" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
}

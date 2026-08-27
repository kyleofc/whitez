import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { WzButton } from "@/components/ui/wz-button";
import { Field, WzInput, WzSelect, WzTextarea } from "@/components/ui/wz-field";
import { createApp, updateApp } from "@/features/catalog/api";
import { announceOnDiscord } from "@/features/admin/discordWebhook";
import type { DownloadLink, GameApp, Genre } from "@/features/catalog/types";

const ARCHS = ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"];

interface AppFormProps {
  genres: Genre[];
  editing: GameApp | null;
  onDone: () => void;
}

const emptyLink: DownloadLink = { name: "", url: "" };

export function AppForm({ genres, editing, onDone }: AppFormProps) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [banner, setBanner] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("");
  const [size, setSize] = useState("");
  const [architecture, setArchitecture] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<DownloadLink[]>([{ ...emptyLink }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(editing?.title || "");
    setIcon(editing?.icon || "");
    setBanner(editing?.banner || "");
    setCategory(editing?.category || "");
    setVersion(editing?.version || "");
    setSize(editing?.size || "");
    setArchitecture(editing?.architecture || []);
    setDescription(editing?.description || "");
    setLinks(editing?.links?.length ? editing.links : [{ ...emptyLink }]);
  }, [editing]);

  const toggleArch = (arch: string) =>
    setArchitecture((prev) =>
      prev.includes(arch) ? prev.filter((a) => a !== arch) : [...prev, arch],
    );

  const updateLink = (index: number, patch: Partial<DownloadLink>) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: title.trim(),
      icon: icon.trim(),
      banner: banner.trim(),
      category,
      version: version.trim(),
      size: size.trim(),
      architecture,
      description: description.trim(),
      links: links.filter((l) => l.url.trim()),
    };
    try {
      if (editing) {
        await updateApp(editing.id, payload);
        toast.success("Jogo atualizado!");
      } else {
        const ref = await createApp(payload);
        toast.success("Jogo publicado!");
        void announceOnDiscord({ id: ref.id, ...payload } as GameApp).then((r) => {
          if (!r.ok) toast.error(r.error || "Falha ao avisar o Discord.");
        });
      }
      onDone();
    } catch {
      toast.error("Não foi possível salvar o jogo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <FormSection title="Informações principais" icon="info">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" htmlFor="f-title">
            <WzInput id="f-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <Field label="Gênero" htmlFor="f-category">
            <WzSelect
              id="f-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Selecione…</option>
              {genres.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </WzSelect>
          </Field>
          <Field label="Versão" htmlFor="f-version">
            <WzInput id="f-version" value={version} onChange={(e) => setVersion(e.target.value)} />
          </Field>
          <Field label="Tamanho" htmlFor="f-size">
            <WzInput
              id="f-size"
              placeholder="Ex.: 1.2 GB"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Mídia" icon="image">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL do ícone" htmlFor="f-icon">
            <WzInput id="f-icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
          </Field>
          <Field label="URL do banner (16:9)" htmlFor="f-banner">
            <WzInput id="f-banner" value={banner} onChange={(e) => setBanner(e.target.value)} />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Compatibilidade" icon="memory">
        <div className="flex flex-wrap gap-2">
          {ARCHS.map((arch) => {
            const active = architecture.includes(arch);
            return (
              <button
                type="button"
                key={arch}
                aria-pressed={active}
                onClick={() => toggleArch(arch)}
                className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary/12 text-primary"
                    : "border-border bg-surface-2 text-muted-foreground hover:text-foreground"
                }`}
              >
                {arch}
              </button>
            );
          })}
        </div>
      </FormSection>

      <FormSection title="Descrição" icon="notes">
        <WzTextarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Descrição do jogo"
        />
      </FormSection>

      <FormSection title="Links de download" icon="download">
        <div className="space-y-3">
          {links.map((link, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
              <WzInput
                placeholder="Nome (ex.: Mediafire)"
                value={link.name}
                onChange={(e) => updateLink(i, { name: e.target.value })}
                aria-label={`Nome do link ${i + 1}`}
              />
              <WzInput
                placeholder="https://…"
                value={link.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                aria-label={`URL do link ${i + 1}`}
              />
              <button
                type="button"
                aria-label={`Remover link ${i + 1}`}
                onClick={() => setLinks((prev) => prev.filter((_, idx) => idx !== i))}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-muted-foreground transition-colors hover:text-destructive"
              >
                <Icon name="delete" size={18} />
              </button>
            </div>
          ))}
          <WzButton
            type="button"
            variant="ghost"
            onClick={() => setLinks((prev) => [...prev, { ...emptyLink }])}
          >
            <Icon name="add" size={18} />
            Adicionar link
          </WzButton>
        </div>
      </FormSection>

      <div className="flex flex-wrap gap-2">
        <WzButton type="submit" size="lg" disabled={saving}>
          {saving ? "Salvando…" : editing ? "Salvar alterações" : "Publicar jogo"}
        </WzButton>
        {editing ? (
          <WzButton type="button" variant="ghost" size="lg" onClick={onDone}>
            Cancelar edição
          </WzButton>
        ) : null}
      </div>
    </form>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
        <Icon name={icon} size={18} className="text-primary" />
        {title}
      </h3>
      {children}
    </section>
  );
}

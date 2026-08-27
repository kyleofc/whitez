import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { WzButton } from "@/components/ui/wz-button";
import { WzInput } from "@/components/ui/wz-field";
import { createGenre, deleteGenre } from "@/features/catalog/api";
import type { Genre } from "@/features/catalog/types";

export function GenreManager({ genres }: { genres: Genre[] }) {
  const [name, setName] = useState("");

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createGenre(name.trim());
      setName("");
      toast.success("Gênero adicionado.");
    } catch {
      toast.error("Não foi possível adicionar o gênero.");
    }
  };

  const remove = async (genre: Genre) => {
    if (!confirm(`Excluir o gênero "${genre.name}"?`)) return;
    try {
      await deleteGenre(genre.id);
      toast.success("Gênero removido.");
    } catch {
      toast.error("Não foi possível remover o gênero.");
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
        <Icon name="category" size={18} className="text-primary" />
        Gêneros
      </h3>

      <form onSubmit={add} className="flex gap-2">
        <WzInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Novo gênero"
          aria-label="Nome do novo gênero"
        />
        <WzButton type="submit" className="shrink-0">
          <Icon name="add" size={18} />
        </WzButton>
      </form>

      <ul className="mt-4 flex flex-wrap gap-2">
        {genres.length === 0 ? (
          <li className="text-sm text-muted-foreground">Nenhum gênero cadastrado.</li>
        ) : (
          genres.map((g) => (
            <li
              key={g.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1.5 pr-1.5 pl-3 text-sm"
            >
              <span className="truncate">{g.name}</span>
              <button
                type="button"
                onClick={() => void remove(g)}
                aria-label={`Excluir gênero ${g.name}`}
                className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
              >
                <Icon name="close" size={14} />
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

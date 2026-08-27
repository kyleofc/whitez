import { useState } from "react";
import { toast } from "sonner";
import { WzButton } from "@/components/ui/wz-button";
import { Field, WzInput } from "@/components/ui/wz-field";
import { loginAdmin } from "@/features/catalog/api";
import { Icon } from "@/components/ui/icon";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(email, password);
      toast.success("Bem-vindo de volta!");
    } catch {
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-surface p-6 shadow-lift sm:p-8">
      <div className="mb-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-border bg-surface-2 text-primary">
          <Icon name="shield_person" size={26} filled />
        </span>
        <h2 className="mt-3 text-xl font-extrabold">Acesso administrativo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Entre para gerenciar o catálogo WhiteZ.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field label="E-mail" htmlFor="adminEmail">
          <WzInput
            id="adminEmail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="Senha" htmlFor="adminPassword">
          <WzInput
            id="adminPassword"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <WzButton type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </WzButton>
      </form>
    </div>
  );
}

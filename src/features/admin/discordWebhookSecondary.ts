import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { GameApp } from "@/features/catalog/types";

/**
 * Segundo webhook do Discord — mesmo formato de aviso do webhook público,
 * mas apontando pra outro servidor. A URL fica em /config/discordSecondary,
 * só o admin consegue ler (ver firestore.rules). Configure lá um campo
 * "webhookUrl" com a URL do webhook do segundo servidor.
 */
async function getWebhookUrl(): Promise<string | null> {
  const snap = await getDoc(doc(getDb(), "config", "discordSecondary"));
  if (!snap.exists()) return null;
  const url = snap.data().webhookUrl;
  return typeof url === "string" && url.startsWith("https://discord.com/api/webhooks/")
    ? url
    : null;
}

function buildEmbed(app: GameApp) {
  const siteUrl = `${window.location.origin}${window.location.pathname}#/app/${app.id}`;
  return {
    embeds: [
      {
        title: app.title,
        url: siteUrl,
        description: (app.description || "").slice(0, 300),
        color: 0xdc263c,
        thumbnail: app.icon ? { url: app.icon } : undefined,
        image: app.banner ? { url: app.banner } : undefined,
        fields: [
          app.category ? { name: "Gênero", value: app.category, inline: true } : null,
          app.version ? { name: "Versão", value: app.version, inline: true } : null,
          app.size ? { name: "Tamanho", value: app.size, inline: true } : null,
          app.architecture?.length
            ? {
                name: "Arquitetura",
                value: app.architecture.map((a) => `${a} BITS`).join(", "),
                inline: true,
              }
            : null,
        ].filter(Boolean),
        footer: { text: "WhiteZ Android" },
      },
    ],
  };
}

/** Dispara o aviso no segundo servidor do Discord. Retorna { ok, error } — nunca lança exceção. */
export async function announceOnDiscordSecondary(
  app: GameApp,
): Promise<{ ok: boolean; error?: string }> {
  let webhookUrl: string | null;
  try {
    webhookUrl = await getWebhookUrl();
  } catch (err) {
    return { ok: false, error: `Erro ao ler /config/discordSecondary: ${(err as Error).message}` };
  }
  if (!webhookUrl) {
    return { ok: false, error: "Campo webhookUrl ausente/ inválido em /config/discordSecondary." };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildEmbed(app)),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Discord respondeu ${res.status}: ${body.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: `Falha de rede: ${(err as Error).message}` };
  }
}

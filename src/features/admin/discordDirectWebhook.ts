import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { GameApp } from "@/features/catalog/types";

/**
 * Webhook separado do de anúncio geral — canal específico, mensagem aponta
 * direto pro link privado em vez da página do site. Configure em
 * /config/discordDirect com um campo "webhookUrl" (nunca no código).
 */
async function getWebhookUrl(): Promise<string | null> {
  const snap = await getDoc(doc(getDb(), "config", "discordDirect"));
  if (!snap.exists()) return null;
  const url = snap.data().webhookUrl;
  return typeof url === "string" && url.startsWith("https://discord.com/api/webhooks/")
    ? url
    : null;
}

function buildEmbed(app: GameApp) {
  const links = (app.directLinks || []).filter((l) => l?.url);
  const primary = links[0]?.url || "";

  const linksText = links
    .map((l, i) => `[${l.name || `Link ${i + 1}`}](${l.url})`)
    .join("\n");

  return {
    embeds: [
      {
        title: app.title,
        url: primary || undefined,
        description: linksText || "Nenhum link direto cadastrado.",
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
        footer: { text: "WhiteZ Android · link direto" },
      },
    ],
  };
}

/** Dispara o aviso com link direto. Retorna { ok, error } — nunca lança exceção. */
export async function announceDirectOnDiscord(
  app: GameApp,
): Promise<{ ok: boolean; error?: string }> {
  if (!app.directLinks?.length) {
    return { ok: false, error: "Este jogo não tem links diretos cadastrados." };
  }

  let webhookUrl: string | null;
  try {
    webhookUrl = await getWebhookUrl();
  } catch (err) {
    return { ok: false, error: `Erro ao ler /config/discordDirect: ${(err as Error).message}` };
  }
  if (!webhookUrl) {
    return { ok: false, error: "Campo webhookUrl ausente/inválido em /config/discordDirect." };
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

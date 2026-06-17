import "server-only";
import { prisma } from "@/lib/prisma";
import { getTemplate, themeToTemplate, type Template } from "@/lib/templates";

/**
 * Resolve a store's template reference into a Template object.
 * - "theme:<id>"  => a designer-created theme from the marketplace
 * - otherwise      => a built-in template id
 */
export async function resolveTemplate(ref: string | null | undefined): Promise<Template> {
  if (ref && ref.startsWith("theme:")) {
    const id = ref.slice("theme:".length);
    const theme = await prisma.theme.findUnique({ where: { id } });
    if (theme) return themeToTemplate(theme);
  }
  return getTemplate(ref);
}

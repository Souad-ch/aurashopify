import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDesignerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ThemeForm } from "@/components/designer/ThemeForm";

export const dynamic = "force-dynamic";

export default async function EditThemePage({ params }: { params: { id: string } }) {
  const designer = await getDesignerSession();
  if (!designer) redirect("/login");

  const theme = await prisma.theme.findFirst({
    where: { id: params.id, designerId: designer.userId },
  });
  if (!theme) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/designer/themes" className="text-sm text-ink-soft hover:text-ink">← العودة إلى قوالبي</Link>
        <h1 className="mt-2 text-2xl font-bold text-ink">تعديل القالب</h1>
      </div>
      <ThemeForm theme={theme} />
    </div>
  );
}

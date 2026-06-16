import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DiscountsManager } from "@/components/dashboard/DiscountsManager";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const user = await getCurrentUser();
  if (!user?.store) redirect("/login");

  const discounts = await prisma.discount.findMany({
    where: { storeId: user.store.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">الخصومات والعروض</h1>
        <p className="text-sm text-ink-soft">
          أنشئ أكواد خصم يستخدمها الزبائن عند الدفع
        </p>
      </div>
      <DiscountsManager discounts={discounts} />
    </div>
  );
}

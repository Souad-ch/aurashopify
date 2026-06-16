import { logoutAction } from "@/app/actions/auth";

export function Topbar({
  userName,
  storeName,
  planName,
}: {
  userName: string;
  storeName: string;
  planName?: string;
}) {
  const initials = userName.trim().charAt(0).toUpperCase();
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-sm font-semibold text-ink">{storeName}</h1>
        <p className="text-xs text-ink-soft">
          {planName ? `خطة ${planName}` : "بدون اشتراك"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-sm font-medium text-ink sm:block">
            {userName}
          </span>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-ghost text-sm">
            خروج
          </button>
        </form>
      </div>
    </header>
  );
}

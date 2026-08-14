import { Clock } from "./Clock";

export function Header() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 safe-pad">
      <div className="mx-auto flex max-w-7xl items-center">
        <div className="pointer-events-auto glass-soft rounded-full px-4 py-2.5">
          <Clock />
        </div>
      </div>
    </header>
  );
}

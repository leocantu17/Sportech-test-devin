export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
      <div className="h-4 w-32 rounded bg-zinc-200" />
      <div className="mt-6 h-9 w-72 rounded bg-zinc-200" />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-xl bg-zinc-200" />
        <div className="h-96 rounded-xl bg-zinc-200" />
      </div>
    </div>
  );
}

export default function BoardPage() {
  return (
    <main className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-xl font-bold text-white">My Board</h1>
      <div className="flex flex-1 gap-3 overflow-x-auto">
        {/* Lists will be rendered here */}
      </div>
    </main>
  );
}

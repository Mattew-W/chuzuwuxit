export function Toast({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
        {msg}
      </div>
    </div>
  )
}

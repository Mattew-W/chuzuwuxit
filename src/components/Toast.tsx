export function Toast({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 anim-in">
      <div className="bg-[#1b1b1b]/90 backdrop-blur text-white px-5 py-2.5 rounded-full text-[13px] font-medium shadow-lg">
        {msg}
      </div>
    </div>
  )
}

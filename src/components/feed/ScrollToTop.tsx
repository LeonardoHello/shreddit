"use client";

export default function ScrollToTop() {
  const handleClick = () => {
    document
      .getElementsByTagName("main")
      .item(0)
      ?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <button
      className="fixed bottom-2 self-center rounded-full bg-zinc-300 px-4 py-1.5 font-bold capitalize text-zinc-900 transition-colors hover:bg-zinc-400"
      onClick={handleClick}
    >
      back to top
    </button>
  );
}

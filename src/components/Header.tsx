function Header() {
  return (
    <header className="border-b border-[#E4DFD3] bg-[#F3F1EC] px-6 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2B2A28]">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="#F3F1EC"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-lg font-semibold tracking-tight text-[#2B2A28]">
          StudyFlow
        </h1>
      </div>
    </header>
  );
}

export default Header;

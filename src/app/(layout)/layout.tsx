export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full justify-center">
      <div className="flex flex-col h-dvh w-[700px] p-4">{children}</div>
    </div>
  );
}

export default function VAApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        .navbar    { display: none !important; }
        .footer    { display: none !important; }
        .cerena-fab, .cerena-window { display: none !important; }
        main { padding: 0 !important; margin: 0 !important; }
      `}</style>
      {children}
    </>
  );
}

export default function PageWrapper({ children }) {
  return (
    <div
      style={{
        paddingTop: "var(--space-10)",
        paddingBottom: "var(--space-10)",
      }}
    >
      {children}
    </div>
  );
}
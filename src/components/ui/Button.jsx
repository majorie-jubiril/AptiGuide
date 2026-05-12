export default function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: {
      background: "linear-gradient(135deg, #6366f1, #4f46e5)",
      color: "#fff",
      boxShadow: "0 12px 24px rgba(79, 70, 229, 0.35)",
    },
    secondary: {
      background: "transparent",
      border: "1px solid var(--color-border)",
      color: "var(--color-text-primary)",
    },
  };

  return (
    <button
      style={{
      padding: "16px 36px",   // bigger
      borderRadius: "999px",
      fontWeight: 700,
      fontSize: "16px",
      letterSpacing: "0.2px",
      cursor: "pointer",
      ...styles[variant],
    }}
      {...props}
    >
      {children}
    </button>
  );
}
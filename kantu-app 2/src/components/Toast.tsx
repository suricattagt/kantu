export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="kw-toast">{message}</div>;
}

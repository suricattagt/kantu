/** A soft, wordless "hello" — concentric rings opening once on mount, deliberately
 * abstract rather than a literal flower (the brand avoids floral/fertility imagery). */
export function BloomGesture() {
  return (
    <div style={{ position: 'relative', width: '110px', height: '110px' }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="kw-bloom-ring" style={{ animationDelay: `${i * 0.18}s` }} />
      ))}
      <div className="kw-bloom-core" />
    </div>
  );
}

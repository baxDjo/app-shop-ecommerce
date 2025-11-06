type Props = { value: number; onChange: (v: number) => void; min?: number; max?: number; };
export default function QuantityInput({ value, onChange, min=1, max=99 }: Props) {
  return (
    <div className="qty">
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="Décrémenter">−</button>
      <input type="number" value={value} min={min} max={max}
             onChange={(e) => onChange(Number(e.target.value))} />
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Incrémenter">+</button>
    </div>
  );
}

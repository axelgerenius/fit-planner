"use client";

import { Checkbox } from "@/components/ui/checkbox";

type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
};

export default function ShoppingItemRow({
  item,
  checked,
  onToggle,
}: {
  item: Item;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <Checkbox checked={checked} onCheckedChange={() => onToggle(item.id)} id={item.id} />
      <label
        htmlFor={item.id}
        className={`flex-1 flex justify-between text-sm cursor-pointer ${
          checked ? "line-through text-muted-foreground" : ""
        }`}
      >
        <span>{item.name}</span>
        <span className="text-muted-foreground">
          {item.quantity} {item.unit}
        </span>
      </label>
    </div>
  );
}

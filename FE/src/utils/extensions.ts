import { DropdownOption } from "@/types/general";

export function toDateString(date?: Date, locale: string = "vi-VN"): string {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString(locale);
}

export function toDateTimeString(
  date?: Date,
  locale: string = "vi-VN"
): string {
  if (!date) {
    return "";
  }

  const d = new Date(date);

  // Format: dd/MM/yyyy HH:mm
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getDropdownOptionSelected(
  dropdowns?: DropdownOption[]
): string {
  if (!dropdowns || !Array.isArray(dropdowns) || dropdowns.length === 0) {
    return "";
  }

  return dropdowns.find((item) => item.selected)?.value || "";
}

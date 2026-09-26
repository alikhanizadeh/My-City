import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "jalaliDate",
  standalone: true,
})
export class JalaliDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, withTime = false): string {
    if (!value) return "";
    const date = typeof value === "string" ? new Date(value) : value;
    const formatter = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
    return formatter.format(date);
  }
}

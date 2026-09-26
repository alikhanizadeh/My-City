import { Injectable, signal } from "@angular/core";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: "root" })
export class ToastService {
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();
  private nextId = 1;

  success(text: string): void {
    this.push("success", text);
  }

  error(text: string): void {
    this.push("error", text);
  }

  info(text: string): void {
    this.push("info", text);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((list) => list.filter((t) => t.id !== id));
  }

  private push(type: ToastType, text: string): void {
    const id = this.nextId++;
    this.toastsSignal.update((list) => [...list, { id, type, text }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}

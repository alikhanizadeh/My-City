import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LucideAngularModule, Send } from "lucide-angular";
import { Comment } from "@core/models/report.model";
import { JalaliDatePipe } from "@shared/pipes/jalali-date.pipe";
import { AuthService } from "@core/services/auth.service";

@Component({
  selector: "app-comments-section",
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, JalaliDatePipe],
  template: `
    <div class="flex flex-col gap-4">
      <div *ngIf="!comments.length" class="text-sm text-ink-secondary text-center py-6">
        هنوز نظری ثبت نشده است.
      </div>

      <div *ngFor="let c of comments" class="flex gap-3 stagger-item">
        <div class="w-9 h-9 rounded-full bg-gradient-primary/15 text-primary-from flex items-center justify-center text-xs font-bold shrink-0">
          {{ (c.user.first_name || c.user.username).charAt(0) }}
        </div>
        <div class="flex-1 bg-slate-50 rounded-xl p-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-ink-primary">{{ c.user.first_name || c.user.username }}</span>
            <span class="text-xs text-ink-secondary">{{ c.created_at | jalaliDate }}</span>
          </div>
          <p class="text-sm text-ink-secondary">{{ c.text }}</p>
        </div>
      </div>

      <div *ngIf="auth.isAuthenticated()" class="flex items-center gap-2 mt-2">
        <input
          class="input-field flex-1"
          placeholder="نظر خود را بنویسید..."
          [(ngModel)]="draft"
          (keyup.enter)="send()"
        />
        <button (click)="send()" [disabled]="!draft.trim()" class="w-11 h-11 shrink-0 rounded-xl bg-gradient-primary text-white flex items-center justify-center disabled:opacity-50">
          <lucide-icon [img]="SendIcon" [size]="18"></lucide-icon>
        </button>
      </div>
    </div>
  `,
})
export class CommentsSectionComponent {
  @Input() comments: Comment[] = [];
  @Output() addComment = new EventEmitter<string>();

  draft = "";
  readonly SendIcon = Send;

  constructor(public auth: AuthService) {}

  send(): void {
    if (!this.draft.trim()) return;
    this.addComment.emit(this.draft.trim());
    this.draft = "";
  }
}

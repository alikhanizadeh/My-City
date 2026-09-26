import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LucideAngularModule, ChevronRight } from "lucide-angular";
import { CategoryService } from "@core/services/category.service";
import { ReportService } from "@core/services/report.service";
import { ToastService } from "@core/services/toast.service";
import { Category } from "@core/models/category.model";
import { ReportPriority } from "@core/models/report.model";
import { StepCategoryComponent } from "./steps/step-category/step-category.component";
import { StepLocationComponent } from "./steps/step-location/step-location.component";
import { StepDetailsComponent } from "./steps/step-details/step-details.component";
import { StepReviewComponent } from "./steps/step-review/step-review.component";

interface WizardState {
  categoryId: number | null;
  lat: number | null;
  lng: number | null;
  address: string;
  title: string;
  description: string;
  priority: ReportPriority;
  image: File | null;
  previewUrl: string | null;
}

@Component({
  selector: "app-report-wizard",
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    StepCategoryComponent,
    StepLocationComponent,
    StepDetailsComponent,
    StepReviewComponent,
  ],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- نوار پیشرفت -->
      <div class="flex items-center gap-2 mb-8">
        <div
          *ngFor="let step of [0, 1, 2, 3]; let i = index"
          class="flex-1 h-1.5 rounded-full transition-all duration-300"
          [ngClass]="i <= currentStep ? 'bg-gradient-primary' : 'bg-slate-200'"
        ></div>
      </div>
      <p class="text-xs text-ink-secondary mb-6">مرحله {{ currentStep + 1 }} از ۴</p>

      <div class="stagger-item" [attr.key]="currentStep">
        <app-step-category
          *ngIf="currentStep === 0"
          [categories]="categories"
          [selectedId]="state.categoryId"
          (select)="selectCategory($event)"
        ></app-step-category>

        <app-step-location
          *ngIf="currentStep === 1"
          [lat]="state.lat"
          [lng]="state.lng"
          [address]="state.address"
          (locationChange)="onLocationChange($event)"
          (addressChange)="state.address = $event"
        ></app-step-location>

        <app-step-details
          *ngIf="currentStep === 2"
          [title]="state.title"
          [description]="state.description"
          [priority]="state.priority"
          [previewUrl]="state.previewUrl"
          (titleChange)="state.title = $event"
          (descriptionChange)="state.description = $event"
          (priorityChange)="state.priority = $event"
          (imageSelected)="onImageSelected($event)"
        ></app-step-details>

        <app-step-review
          *ngIf="currentStep === 3"
          [category]="selectedCategory"
          [title]="state.title"
          [description]="state.description"
          [priority]="state.priority"
          [address]="state.address"
          [lat]="state.lat"
          [lng]="state.lng"
          [previewUrl]="state.previewUrl"
          [submitting]="submitting"
          (submit)="submitReport()"
        ></app-step-review>
      </div>

      <div class="flex items-center justify-between mt-8">
        <button
          *ngIf="currentStep > 0"
          (click)="prevStep()"
          class="btn-outline flex items-center gap-1"
        >
          <lucide-icon [img]="ChevronRightIcon" [size]="16"></lucide-icon>
          مرحله قبل
        </button>
        <div *ngIf="currentStep === 0"></div>

        <button
          *ngIf="currentStep < 3"
          (click)="nextStep()"
          [disabled]="!canGoNext()"
          class="btn-gradient"
        >
          مرحله بعد
        </button>
      </div>
    </div>
  `,
})
export class ReportWizardComponent implements OnInit {
  currentStep = 0;
  categories: Category[] = [];
  submitting = false;
  readonly ChevronRightIcon = ChevronRight;

  state: WizardState = {
    categoryId: null,
    lat: null,
    lng: null,
    address: "",
    title: "",
    description: "",
    priority: "medium",
    image: null,
    previewUrl: null,
  };

  constructor(
    private categoryService: CategoryService,
    private reportService: ReportService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.list().subscribe((cats) => (this.categories = cats));
  }

  get selectedCategory(): Category | null {
    return this.categories.find((c) => c.id === this.state.categoryId) ?? null;
  }

  selectCategory(id: number): void {
    this.state.categoryId = id;
    this.nextStep();
  }

  onLocationChange(loc: { lat: number; lng: number }): void {
    this.state.lat = loc.lat;
    this.state.lng = loc.lng;
  }

  onImageSelected(file: File | null): void {
    this.state.image = file;
    if (this.state.previewUrl) {
      URL.revokeObjectURL(this.state.previewUrl);
    }
    this.state.previewUrl = file ? URL.createObjectURL(file) : null;
  }

  canGoNext(): boolean {
    if (this.currentStep === 0) return !!this.state.categoryId;
    if (this.currentStep === 1) return !!this.state.lat && !!this.state.lng;
    if (this.currentStep === 2) return !!this.state.title.trim();
    return true;
  }

  nextStep(): void {
    if (this.canGoNext() && this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitReport(): void {
    if (!this.state.categoryId || !this.state.lat || !this.state.lng) return;

    this.submitting = true;
    this.reportService
      .create({
        title: this.state.title,
        description: this.state.description,
        category: this.state.categoryId,
        priority: this.state.priority,
        address: this.state.address,
        lat: this.state.lat,
        lng: this.state.lng,
        image: this.state.image,
      })
      .subscribe({
        next: (report) => {
          this.toast.success("گزارش شما با موفقیت ثبت شد.");
          this.router.navigate(["/report", report.id]);
        },
        error: () => (this.submitting = false),
        complete: () => (this.submitting = false),
      });
  }
}

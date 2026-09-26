from django.conf import settings
from django.contrib.gis.db import models as gis_models
from django.db import models

from apps.categories.models import Category
from core.validators import validate_image_file


class Report(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "جدید"
        IN_PROGRESS = "in_progress", "در حال بررسی"
        DONE = "done", "انجام‌شده"
        REJECTED = "rejected", "رد‌شده"

    class Priority(models.TextChoices):
        LOW = "low", "کم"
        MEDIUM = "medium", "متوسط"
        HIGH = "high", "زیاد"

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, related_name="reports"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW
    )
    priority = models.CharField(
        max_length=10, choices=Priority.choices, default=Priority.MEDIUM
    )
    location = gis_models.PointField(srid=4326, geography=True)
    address = models.CharField(max_length=300, blank=True)
    image = models.ImageField(
        upload_to="reports/%Y/%m/",
        validators=[validate_image_file],
        blank=True,
        null=True,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "گزارش"
        verbose_name_plural = "گزارش‌ها"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["category"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"


class ReportStatusHistory(models.Model):
    report = models.ForeignKey(
        Report, on_delete=models.CASCADE, related_name="status_history"
    )
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    note = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "تاریخچه وضعیت"
        verbose_name_plural = "تاریخچه وضعیت‌ها"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.report_id}: {self.old_status} → {self.new_status}"


class Comment(models.Model):
    report = models.ForeignKey(
        Report, on_delete=models.CASCADE, related_name="comments"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "نظر"
        verbose_name_plural = "نظرات"
        ordering = ["created_at"]

    def __str__(self):
        return f"نظر {self.user} روی گزارش {self.report_id}"

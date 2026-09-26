from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Report, ReportStatusHistory


@receiver(post_save, sender=Report)
def create_initial_status_history(sender, instance, created, **kwargs):
    """هنگام ایجاد یک گزارش جدید، اولین رکورد تاریخچه وضعیت را ثبت می‌کند"""
    if created:
        ReportStatusHistory.objects.create(
            report=instance,
            old_status="",
            new_status=instance.status,
            changed_by=instance.user,
            note="ثبت گزارش",
        )

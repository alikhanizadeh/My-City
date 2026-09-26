from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.categories.models import Category
from apps.reports.models import Report


class OverviewStatsView(APIView):
    """
    KPIها: تعداد کل، تفکیک وضعیت، تفکیک دسته،
    روند ۶ ماه اخیر، ۵ ناحیه پرترافیک (بر اساس آدرس متنی)
    """

    permission_classes = [AllowAny]

    def get(self, request):
        total = Report.objects.count()

        by_status = list(
            Report.objects.values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        )

        by_category = list(
            Report.objects.values(
                "category__id", "category__name", "category__color"
            )
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        six_months_ago = timezone.now() - timedelta(days=180)
        monthly_trend_qs = (
            Report.objects.filter(created_at__gte=six_months_ago)
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
        monthly_trend = [
            {"month": item["month"].strftime("%Y-%m"), "count": item["count"]}
            for item in monthly_trend_qs
        ]

        top_areas = list(
            Report.objects.exclude(address="")
            .values("address")
            .annotate(count=Count("id"))
            .order_by("-count")[:5]
        )

        return Response(
            {
                "total": total,
                "by_status": by_status,
                "by_category": by_category,
                "monthly_trend": monthly_trend,
                "top_areas": top_areas,
                "total_categories": Category.objects.count(),
            }
        )

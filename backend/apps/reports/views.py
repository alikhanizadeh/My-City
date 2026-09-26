from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.permissions import IsOperatorOrAdmin, IsOwnerOrOperatorReadOnly
from core.utils import make_point

from .filters import ReportFilter
from .models import Comment, Report, ReportStatusHistory
from .serializers import (
    CommentSerializer,
    ReportCreateSerializer,
    ReportDetailSerializer,
    ReportListSerializer,
    StatusUpdateSerializer,
)


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.select_related("category", "user").all()
    filterset_class = ReportFilter
    search_fields = ["title", "description", "address"]
    ordering_fields = ["created_at", "priority", "status"]
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrOperatorReadOnly,
    ]

    def get_serializer_class(self):
        if self.action == "list":
            return ReportListSerializer
        if self.action == "create":
            return ReportCreateSerializer
        return ReportDetailSerializer

    def get_throttles(self):
        if self.action == "create":
            self.throttle_scope = "report-create"
        return super().get_throttles()

    @action(
        detail=True,
        methods=["patch"],
        url_path="status",
        permission_classes=[permissions.IsAuthenticated, IsOperatorOrAdmin],
    )
    def update_status(self, request, pk=None):
        report = self.get_object()
        serializer = StatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_status = report.status
        new_status = serializer.validated_data["status"]
        note = serializer.validated_data.get("note", "")

        report.status = new_status
        report.save(update_fields=["status", "updated_at"])

        ReportStatusHistory.objects.create(
            report=report,
            old_status=old_status,
            new_status=new_status,
            changed_by=request.user,
            note=note,
        )
        return Response(ReportDetailSerializer(report).data)

    @action(detail=True, methods=["post"], url_path="comments")
    def add_comment(self, request, pk=None):
        report = self.get_object()
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(report=report, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="nearby")
    def nearby(self, request):
        """گزارش‌های نزدیک یک نقطه در شعاع مشخص (متر) با کوئری PostGIS dwithin"""
        lat = request.query_params.get("lat")
        lng = request.query_params.get("lng")
        radius = request.query_params.get("radius", 500)

        if not lat or not lng:
            return Response(
                {"detail": "پارامترهای lat و lng الزامی هستند."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        point = make_point(lng, lat)
        qs = (
            Report.objects.filter(
                location__dwithin=(point, D(m=float(radius)))
            )
            .annotate(distance=Distance("location", point))
            .order_by("distance")
        )
        serializer = ReportListSerializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="heatmap")
    def heatmap(self, request):
        """خروجی [lat, lng, weight] برای لایه Heatmap لیفلت"""
        qs = Report.objects.exclude(location__isnull=True)
        data = [
            [report.location.y, report.location.x, 1]
            for report in qs.only("location")
        ]
        return Response(data)

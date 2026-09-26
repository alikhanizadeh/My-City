import django_filters
from django.contrib.gis.geos import Polygon

from .models import Report


class ReportFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status")
    category = django_filters.NumberFilter(field_name="category_id")
    bbox = django_filters.CharFilter(method="filter_bbox")
    mine = django_filters.BooleanFilter(method="filter_mine")

    class Meta:
        model = Report
        fields = ["status", "category"]

    def filter_mine(self, queryset, name, value):
        """فقط گزارش‌های کاربر لاگین‌شده را برمی‌گرداند"""
        request = self.request
        if value and request and request.user.is_authenticated:
            return queryset.filter(user=request.user)
        return queryset

    def filter_bbox(self, queryset, name, value):
        """
        bbox=minLng,minLat,maxLng,maxLat
        فیلتر گزارش‌ها بر اساس محدوده نمایی نقشه
        """
        try:
            min_lng, min_lat, max_lng, max_lat = map(float, value.split(","))
        except (ValueError, AttributeError):
            return queryset

        bbox_polygon = Polygon.from_bbox((min_lng, min_lat, max_lng, max_lat))
        bbox_polygon.srid = 4326
        return queryset.filter(location__within=bbox_polygon)

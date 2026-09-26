from rest_framework import serializers

from apps.categories.serializers import CategorySerializer
from apps.users.serializers import UserSerializer
from core.utils import make_point

from .models import Comment, Report, ReportStatusHistory


class LocationField(serializers.Serializer):
    lat = serializers.FloatField()
    lng = serializers.FloatField()


class ReportStatusHistorySerializer(serializers.ModelSerializer):
    changed_by = UserSerializer(read_only=True)
    old_status_display = serializers.CharField(
        source="get_old_status_display", read_only=True
    )
    new_status_display = serializers.CharField(
        source="get_new_status_display", read_only=True
    )

    class Meta:
        model = ReportStatusHistory
        fields = (
            "id",
            "old_status",
            "old_status_display",
            "new_status",
            "new_status_display",
            "changed_by",
            "note",
            "created_at",
        )


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "report", "user", "text", "created_at")
        read_only_fields = ("id", "user", "created_at")
        extra_kwargs = {"report": {"write_only": True}}


class ReportListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()
    status_display = serializers.CharField(
        source="get_status_display", read_only=True
    )
    priority_display = serializers.CharField(
        source="get_priority_display", read_only=True
    )

    class Meta:
        model = Report
        fields = (
            "id",
            "title",
            "description",
            "category",
            "status",
            "status_display",
            "priority",
            "priority_display",
            "address",
            "image",
            "user",
            "lat",
            "lng",
            "created_at",
            "updated_at",
        )

    def get_lat(self, obj):
        return obj.location.y if obj.location else None

    def get_lng(self, obj):
        return obj.location.x if obj.location else None


class ReportDetailSerializer(ReportListSerializer):
    status_history = ReportStatusHistorySerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta(ReportListSerializer.Meta):
        fields = ReportListSerializer.Meta.fields + (
            "status_history",
            "comments",
        )


class ReportCreateSerializer(serializers.ModelSerializer):
    lat = serializers.FloatField(write_only=True)
    lng = serializers.FloatField(write_only=True)

    class Meta:
        model = Report
        fields = (
            "id",
            "title",
            "description",
            "category",
            "priority",
            "address",
            "image",
            "lat",
            "lng",
        )

    def validate_image(self, image):
        return image

    def create(self, validated_data):
        lat = validated_data.pop("lat")
        lng = validated_data.pop("lng")
        validated_data["location"] = make_point(lng, lat)
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    def to_representation(self, instance):
        return ReportDetailSerializer(instance, context=self.context).data


class StatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Report.Status.choices)
    note = serializers.CharField(
        max_length=300, required=False, allow_blank=True
    )

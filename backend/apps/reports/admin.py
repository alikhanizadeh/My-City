from django.contrib import admin

from .models import Comment, Report, ReportStatusHistory


class ReportStatusHistoryInline(admin.TabularInline):
    model = ReportStatusHistory
    extra = 0
    readonly_fields = ("old_status", "new_status", "changed_by", "note", "created_at")


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ("user", "text", "created_at")


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "priority", "user", "created_at")
    list_filter = ("status", "priority", "category")
    search_fields = ("title", "description", "address")
    inlines = [ReportStatusHistoryInline, CommentInline]


@admin.register(ReportStatusHistory)
class ReportStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ("report", "old_status", "new_status", "changed_by", "created_at")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("report", "user", "created_at")

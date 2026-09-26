from rest_framework import permissions


class IsOperatorOrAdmin(permissions.BasePermission):
    """فقط اپراتور یا ادمین اجازه دارند"""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_operator_or_admin
        )


class IsOwnerOrOperatorReadOnly(permissions.BasePermission):
    """
    شهروند فقط گزارش خودش را (پیش از بررسی/در وضعیت new) می‌تواند ویرایش کند.
    اپراتور/ادمین دسترسی کامل خواندن دارند؛ تغییر وضعیت جدا کنترل می‌شود.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_operator_or_admin:
            return True

        is_owner = obj.user_id == request.user.id
        return is_owner and obj.status == obj.Status.NEW

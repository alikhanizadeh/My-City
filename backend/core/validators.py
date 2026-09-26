from django.conf import settings
from django.core.exceptions import ValidationError


def validate_image_file(image):
    """اعتبارسنجی سایز (حداکثر ۵MB) و فرمت (jpg/png/webp) عکس آپلودی"""
    max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if image.size > max_size:
        raise ValidationError(
            f"حجم عکس نباید بیشتر از {settings.MAX_UPLOAD_SIZE_MB} مگابایت باشد."
        )

    content_type = getattr(image, "content_type", None)
    if content_type and content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise ValidationError(
            "فرمت عکس نامعتبر است. فقط jpg، png و webp مجاز است."
        )

"""
اسکریپت seed پروژه «شهر من»
اجرا: python scripts/seed_data.py (از داخل کانتینر backend)
یا: python manage.py shell -c "exec(open('scripts/seed_data.py').read())"
"""
import os
import random
import sys

import django

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.contrib.auth import get_user_model  # noqa: E402

from apps.categories.models import Category  # noqa: E402
from apps.reports.models import Comment, Report  # noqa: E402
from core.utils import make_point  # noqa: E402

User = get_user_model()

# مرکز تهران تقریبی
TEHRAN_LAT = 35.6892
TEHRAN_LNG = 51.3890
SPREAD = 0.08  # پراکندگی مختصات

CATEGORIES = [
    {"name": "چاله", "icon": "construction", "color": "#F59E0B"},
    {"name": "روشنایی", "icon": "lightbulb", "color": "#3B82F6"},
    {"name": "زباله", "icon": "trash-2", "color": "#10B981"},
    {"name": "جدول", "icon": "square-dashed", "color": "#8B5CF6"},
    {"name": "گرافیتی", "icon": "spray-can", "color": "#EC4899"},
    {"name": "آب", "icon": "droplets", "color": "#0EA5E9"},
]

SAMPLE_TITLES = [
    "چاله بزرگ در وسط خیابان",
    "چراغ خیابان خاموش است",
    "انباشت زباله در پیاده‌رو",
    "شکستگی جدول کنار پارک",
    "دیوارنویسی زشت روی دیوار مدرسه",
    "نشتی لوله آب در کوچه",
    "خرابی آسفالت مقابل مغازه",
    "تیر چراغ برق کج شده",
    "سطل زباله پر و لبریز",
    "ترک عمیق در جدول خیابان",
]

STREETS = [
    "خیابان ولیعصر", "خیابان انقلاب", "خیابان آزادی", "بلوار کشاورز",
    "خیابان شریعتی", "خیابان طالقانی", "میدان تجریش", "خیابان فرشته",
    "خیابان جمهوری", "بلوار میرداماد",
]


def run():
    print("در حال ساخت دسته‌بندی‌ها...")
    categories = []
    for cat in CATEGORIES:
        obj, _ = Category.objects.get_or_create(
            name=cat["name"],
            defaults={"icon": cat["icon"], "color": cat["color"]},
        )
        categories.append(obj)

    print("در حال ساخت کاربران تست...")
    admin, created = User.objects.get_or_create(
        username="admin",
        defaults={"email": "admin@example.com", "role": User.Role.ADMIN,
                  "is_staff": True, "is_superuser": True},
    )
    if created:
        admin.set_password("Admin@1234")
        admin.save()

    operator, created = User.objects.get_or_create(
        username="operator",
        defaults={"email": "operator@example.com", "role": User.Role.OPERATOR,
                  "is_staff": True},
    )
    if created:
        operator.set_password("Operator@1234")
        operator.save()

    citizen, created = User.objects.get_or_create(
        username="citizen",
        defaults={"email": "citizen@example.com", "role": User.Role.CITIZEN},
    )
    if created:
        citizen.set_password("Citizen@1234")
        citizen.save()

    print("در حال ساخت ۵۰ گزارش نمونه...")
    statuses = [c[0] for c in Report.Status.choices]
    priorities = [c[0] for c in Report.Priority.choices]

    for i in range(50):
        lat = TEHRAN_LAT + random.uniform(-SPREAD, SPREAD)
        lng = TEHRAN_LNG + random.uniform(-SPREAD, SPREAD)
        report = Report.objects.create(
            title=random.choice(SAMPLE_TITLES),
            description="توضیحات نمونه برای این گزارش که توسط اسکریپت seed تولید شده است.",
            category=random.choice(categories),
            status=random.choice(statuses),
            priority=random.choice(priorities),
            location=make_point(lng, lat),
            address=f"{random.choice(STREETS)}, تهران",
            user=citizen,
        )
        if i % 5 == 0:
            Comment.objects.create(
                report=report, user=operator, text="در حال پیگیری این مورد هستیم."
            )

    print("✅ Seed با موفقیت انجام شد.")
    print("حساب‌های تست: admin/Admin@1234 | operator/Operator@1234 | citizen/Citizen@1234")


if __name__ == "__main__":
    run()

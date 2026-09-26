from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        CITIZEN = "citizen", "شهروند"
        OPERATOR = "operator", "اپراتور"
        ADMIN = "admin", "ادمین"

    role = models.CharField(
        max_length=20, choices=Role.choices, default=Role.CITIZEN
    )
    phone = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return self.get_full_name() or self.username

    @property
    def is_operator_or_admin(self):
        return self.role in (self.Role.OPERATOR, self.Role.ADMIN)

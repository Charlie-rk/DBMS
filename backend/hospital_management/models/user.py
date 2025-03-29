from django.contrib.auth.models import AbstractUser
from django.db import models

GENDER_CHOICES = (
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other'),
)

ROLE_CHOICES = (
    ('doctor', 'Doctor'),
    ('fdo', 'FDO'),
    ('deo', 'DEO'),
    ('da', 'DA'),
)

class CustomUser(AbstractUser):
    # user_id is automatically created as the primary key (id)
    # The username field is available from AbstractUser.
    # You can use email as username if needed by customizing further.

    address = models.TextField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, null=True)
    contact_no = models.CharField(max_length=15, blank=True, null=True)
    joining_date = models.DateField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='doctor')

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

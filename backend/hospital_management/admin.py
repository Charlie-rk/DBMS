from django.contrib import admin
from .models.user import CustomUser
# Register your models here.
admin.site.register(CustomUser)
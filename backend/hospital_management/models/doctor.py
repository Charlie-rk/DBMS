from django import models
from models.user import CustomUser

class DoctorProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        limit_choices_to={'role': 'doctor'},
        related_name='doctor_profile'
    )
    doc_no = models.CharField(max_length=20, unique=True)
    specialization = models.CharField(max_length=100)
    years_of_experience = models.PositiveIntegerField()

    def __str__(self):
        return f"Dr. {self.user.username} - {self.specialization}"

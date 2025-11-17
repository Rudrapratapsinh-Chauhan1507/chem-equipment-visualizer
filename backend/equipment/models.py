from django.db import models
from django.contrib.auth.models import User

class EquipmentDataset(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='datasets/')
    upload_time = models.DateTimeField(auto_now_add=True)
    summary = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"{self.file.name} ({self.upload_time})"

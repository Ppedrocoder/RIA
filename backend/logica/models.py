from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Usuario(AbstractUser):
    def __str__(self):
        return self.username
class TipoArte(models.Model):
    nome = models.CharField(max_length=100)

class Arte(models.Model):
    nome = models.CharField(max_length=100)
    tipoarte = models.ForeignKey(TipoArte, on_delete=models.CASCADE)
    descricao = models.TextField()
    foto = models.URLField()

from django.db import models

# Create your models here.

class TipoArte(models.Model):
    nome = models.CharField(max_length=100)

class Arte(models.Model):
    nome = models.CharField(max_length=100)
    tipoarte = models.ForeignKey(TipoArte, on_delete=models.CASCADE)
    descricao = models.TextField()
    foto = models.ImageField(upload_to='artes/')

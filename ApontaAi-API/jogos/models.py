from django.db import models

class Jogo(models.Model):
    STATUS_CHOICES = [
        ('agendado', 'Agendado'),
        ('em_andamento', 'Em Andamento'),
        ('finalizado', 'Finalizado'),
    ]
    
    RESULTADO_CHOICES = [
        ('vitoria_a', 'Vitória Time A'),
        ('vitoria_b', 'Vitória Time B'),
        ('empate', 'Empate'),
    ]

    time_a = models.CharField(max_length=100)
    time_b = models.CharField(max_length=100)
    data_hora = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='agendado')
    resultado = models.CharField(max_length=20, choices=RESULTADO_CHOICES, null=True, blank=True)

    def __str__(self):
        return f"{self.time_a} x {self.time_b} ({self.data_hora.strftime('%d/%m/%Y')})"
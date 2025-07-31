from django.db import models
from decimal import Decimal

class LaundryOrder(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('in_progress', 'In Progress'),
        ('confirmed', 'Confirmed'),
        ('done', 'Done')
    ]
    
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=20, blank=True)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_amount = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-order_date']

    def __str__(self):
        return f"{self.customer_name} - {self.status} ({self.order_date.strftime('%Y-%m-%d')})"
    
    def calculate_total(self):
        total = sum(item.subtotal for item in self.items.all())
        self.total_amount = total
        self.save()
        return total


class LaundryItem(models.Model):
    ITEM_TYPES = [
        ('shirt', 'Shirt'),
        ('pants', 'Pants'),
        ('dress', 'Dress'),
        ('bedsheet', 'Bed Sheet'),
        ('towel', 'Towel'),
        ('other', 'Other')
    ]
    
    order = models.ForeignKey(LaundryOrder, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=55)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, default='other')
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        self.order.calculate_total()
    
    def __str__(self):
        return f"{self.name} x{self.quantity} - ${self.subtotal}"
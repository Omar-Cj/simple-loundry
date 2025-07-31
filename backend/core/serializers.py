from rest_framework import serializers
from .models import LaundryOrder, LaundryItem


class LaundryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaundryItem
        fields = ['id', 'name', 'item_type', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['subtotal']

    def create(self, validated_data):
        validated_data['subtotal'] = validated_data['quantity'] * validated_data['unit_price']
        return super().create(validated_data)


class LaundryOrderSerializer(serializers.ModelSerializer):
    items = LaundryItemSerializer(many=True, read_only=True)
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = LaundryOrder
        fields = ['id', 'customer_name', 'customer_phone', 'order_date', 'status', 
                 'total_amount', 'notes', 'items', 'items_count']
        read_only_fields = ['total_amount', 'order_date']

    def get_items_count(self, obj):
        return obj.items.count()


class LaundryOrderCreateSerializer(serializers.ModelSerializer):
    items = LaundryItemSerializer(many=True, read_only=False, required=False)
    
    class Meta:
        model = LaundryOrder
        fields = ['customer_name', 'customer_phone', 'status', 'notes', 'items']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = LaundryOrder.objects.create(**validated_data)
        
        for item_data in items_data:
            LaundryItem.objects.create(order=order, **item_data)
        
        order.calculate_total()
        return order
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        
        # Update order fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Clear existing items and create new ones
        instance.items.all().delete()
        for item_data in items_data:
            LaundryItem.objects.create(order=instance, **item_data)
        
        instance.calculate_total()
        return instance


class LaundryOrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LaundryOrder
        fields = ['status']
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import LaundryOrder, LaundryItem
from .serializers import (
    LaundryOrderSerializer, 
    LaundryOrderCreateSerializer,
    LaundryOrderStatusUpdateSerializer,
    LaundryItemSerializer
)


class LaundryOrderViewSet(viewsets.ModelViewSet):
    queryset = LaundryOrder.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LaundryOrderCreateSerializer
        elif self.action == 'update_status':
            return LaundryOrderStatusUpdateSerializer
        return LaundryOrderSerializer
    
    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            return Response(
                LaundryOrderSerializer(order).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        serializer = LaundryOrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(LaundryOrderSerializer(order).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get', 'post'])
    def items(self, request, pk=None):
        order = self.get_object()
        
        if request.method == 'GET':
            items = order.items.all()
            serializer = LaundryItemSerializer(items, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = LaundryItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(order=order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LaundryItemViewSet(viewsets.ModelViewSet):
    queryset = LaundryItem.objects.all()
    serializer_class = LaundryItemSerializer
    
    def get_queryset(self):
        queryset = LaundryItem.objects.all()
        order_id = self.request.query_params.get('order_id', None)
        if order_id is not None:
            queryset = queryset.filter(order__id=order_id)
        return queryset

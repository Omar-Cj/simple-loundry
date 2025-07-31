from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LaundryOrderViewSet, LaundryItemViewSet

router = DefaultRouter()
router.register(r'orders', LaundryOrderViewSet)
router.register(r'items', LaundryItemViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
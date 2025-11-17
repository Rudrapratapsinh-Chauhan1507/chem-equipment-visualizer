from django.urls import path
from .views import (
    RegisterAPIView, LoginAPIView,
    UploadDatasetAPIView, DatasetSummaryAPIView, DatasetHistoryAPIView
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='auth-register'),
    path('login/', LoginAPIView.as_view(), name='auth-login'),
    path('upload/', UploadDatasetAPIView.as_view(), name='upload-dataset'),
    path('summary/<int:id>/', DatasetSummaryAPIView.as_view(), name='dataset-summary'),
    path('history/', DatasetHistoryAPIView.as_view(), name='dataset-history'),
]

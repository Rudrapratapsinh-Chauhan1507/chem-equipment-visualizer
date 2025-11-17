from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
from .models import EquipmentDataset
from .serializers import EquipmentDatasetSerializer, UserSerializer, RegisterSerializer
import pandas as pd
from django.shortcuts import get_object_or_404

class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})

class UploadDatasetAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            df = pd.read_csv(csv_file)
            summary = {
                'total_count': int(len(df)),
                'average_flowrate': float(df['Flowrate'].mean()),
                'average_pressure': float(df['Pressure'].mean()),
                'average_temperature': float(df['Temperature'].mean()),
                'type_distribution': df['Type'].value_counts().to_dict()
            }
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        dataset = EquipmentDataset.objects.create(owner=request.user, file=csv_file, summary=summary)
        serializer = EquipmentDatasetSerializer(dataset)
        self._keep_last_five(request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _keep_last_five(self, user):
        qs = EquipmentDataset.objects.filter(owner=user).order_by('-upload_time')
        for ds in qs[5:]:
            ds.delete()

class DatasetSummaryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, id):
        dataset = get_object_or_404(EquipmentDataset, id=id, owner=request.user)
        return Response(dataset.summary, status=status.HTTP_200_OK)

class DatasetHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        datasets = EquipmentDataset.objects.filter(owner=request.user).order_by('-upload_time')[:5]
        serializer = EquipmentDatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

def home(request):
    return HttpResponse("<h2>Welcome to the Chemical Equipment Visualizer API</h2>")
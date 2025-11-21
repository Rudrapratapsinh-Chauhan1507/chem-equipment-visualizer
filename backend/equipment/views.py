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


# ---------- Helper: Flexible Column Finder ----------
def find_column(df, keywords):
    """
    Try to find a column in df whose name contains ANY of the given keywords
    (case-insensitive). Returns the column name or None.
    """
    cols = list(df.columns)
    for col in cols:
        lower = col.lower()
        for key in keywords:
            if key in lower:
                return col
    return None


# ---------- User Register ----------
class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response(
                {"token": token.key, "user": UserSerializer(user).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------- User Login ----------
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


# ---------- Upload & Analyze Dataset ----------
class UploadDatasetAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        csv_file = request.FILES.get("file")
        if not csv_file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            df = pd.read_csv(csv_file)

            # --- Flexible column detection ---
            flow_col = find_column(df, ["flow", "flowrate"])
            press_col = find_column(df, ["press", "pressure"])
            temp_col = find_column(df, ["temp", "temperature"])
            type_col = find_column(df, ["type", "equipment", "category"])

            # Helper to compute safe numeric mean
            def safe_mean(col_name):
                if not col_name or col_name not in df.columns:
                    return None
                series = pd.to_numeric(df[col_name], errors="coerce")
                if series.notna().any():
                    return float(series.mean())
                return None

            avg_flow = safe_mean(flow_col)
            avg_press = safe_mean(press_col)
            avg_temp = safe_mean(temp_col)

            if type_col:
                type_distribution = df[type_col].value_counts().to_dict()
            else:
                type_distribution = {}

            summary = {
                "total_count": int(len(df)),
                "average_flowrate": avg_flow,
                "average_pressure": avg_press,
                "average_temperature": avg_temp,
                "type_distribution": type_distribution,
            }

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        dataset = EquipmentDataset.objects.create(
            owner=request.user, file=csv_file, summary=summary
        )
        serializer = EquipmentDatasetSerializer(dataset)

        self._keep_last_five(request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _keep_last_five(self, user):
        qs = EquipmentDataset.objects.filter(owner=user).order_by("-upload_time")
        for ds in qs[5:]:
            ds.delete()


# ---------- Get Single Summary ----------
class DatasetSummaryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        dataset = get_object_or_404(EquipmentDataset, id=id, owner=request.user)
        return Response(dataset.summary, status=status.HTTP_200_OK)


# ---------- Get History List ----------
class DatasetHistoryAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        datasets = EquipmentDataset.objects.filter(owner=request.user).order_by("-upload_time")
        serializer = EquipmentDatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ---------- Delete One Dataset ----------
class DatasetDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        dataset = get_object_or_404(EquipmentDataset, id=id, owner=request.user)
        dataset.delete()
        return Response({"success": True, "message": "Dataset deleted"})


# ---------- Home ----------
def home(request):
    return HttpResponse("<h2>Welcome to the Chemical Equipment Visualizer API</h2>")

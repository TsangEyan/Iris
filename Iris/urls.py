from django.contrib import admin
from django.urls import include, path
from toolUI import views

urlpatterns = [
    path('toolUI/', include('toolUI.urls')),
    path('admin/', admin.site.urls),
]
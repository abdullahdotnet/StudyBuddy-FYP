from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('chatbot.urls')),
    path('api/', include('youtube.urls')),
    path('api/user/', include('account.urls')),
    path('api/test-session/', include('test_session.urls')),
    path('api/userspace/', include('userspace.urls')),
    path('api/board/', include('papergen.urls')),
    path('api/entrytest/', include('entrytest.urls')),
    path('api/', include('core_utils.urls')),
    path('api/todo/', include('todo.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )

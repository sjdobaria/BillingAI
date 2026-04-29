import os
import django
from django.conf import settings

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BillingAI.settings')
django.setup()

print(f"MONGODB_URI: {settings.MONGODB_URI}")
print(f"MONGODB_DB_NAME: {settings.MONGODB_DB_NAME}")

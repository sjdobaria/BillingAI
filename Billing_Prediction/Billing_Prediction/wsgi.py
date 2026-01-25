# """
# WSGI config for Billing_Prediction project.

# It exposes the WSGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
# """

# import os

# from django.core.wsgi import get_wsgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Billing_Prediction.settings')

# application = get_wsgi_application()



import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'Billing_Prediction.settings'
)

application = get_wsgi_application()

# ===============================
# AUTO-MIGRATE ON RENDER STARTUP
# ===============================
if os.environ.get("RENDER"):
    try:
        from django.core.management import call_command
        call_command("migrate", interactive=False)
        print("✅ Migrations applied successfully")
    except Exception as e:
        print("❌ Migration error:", e)

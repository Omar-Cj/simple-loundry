from .common import *
import os
import dj_database_url

DEBUG = False

SECRET_KEY = os.environ.get('SECRET_KEY')

ALLOWED_HOSTS = ['simple-loundry-production.up.railway.app', '.railway.app']

# Database configuration for Railway
DATABASES = {
    'default': dj_database_url.config()
}



# Static files configuration for Railway
STATIC_ROOT = BASE_DIR / 'staticfiles'

# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Production CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",  # Replace with your actual frontend domain
]

CORS_ALLOW_CREDENTIALS = True

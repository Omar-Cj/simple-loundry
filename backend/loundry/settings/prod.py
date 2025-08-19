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



# WhiteNoise configuration
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

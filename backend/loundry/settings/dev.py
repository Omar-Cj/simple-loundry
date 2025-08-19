from .common import *


DEBUG = True

SECRET_KEY = 'django-insecure-x_@9wqe()sd(1_*l#89qbs+9c@sth0ig2=q&kor4l0r$o#+^yf'





DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'loundry',
        'HOST': 'localhost',
        'USER': 'root',
        'PASSWORD': 'Software',
    }
}

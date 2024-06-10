class Config(object):
    DEBUG = False
    TESTING = False

        


class DevelopmentConfig(Config):
    DEBUG = True       
    SQLALCHEMY_DATABASE_URI = "sqlite:///music.db"
    SECRET_KEY = "thisissecret"
    SECURITY_PASSWORD_SALT = "thisissalt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    SECURITY_LOGIN_URL = '/'
    SECURITY_LOGIN_USER_TEMPLATE = 'index.html'
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3

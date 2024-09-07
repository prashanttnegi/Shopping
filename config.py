class Config(object):
    DEBUG=False
    TESTING=False
    CACHE_TYPE="RedisCache"

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.sqlite3'
    SECRET_KEY = "mysecretkey"
    SECURITY_LOGIN_URL= '/login'
    SECURITY_PASSWORD_SALT = "thisissalt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    CACHE_REDIS_HOST="127.0.0.1"
    CACHE_REDIS_PORT=6379
    CACHE_REDIS_DB=0

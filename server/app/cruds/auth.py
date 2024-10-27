from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from datetime import datetime, timedelta
from config import get_settings

SECRET_KEY = get_settings().secret_key
ALGORITHM = "HS256"

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        
    def verify_jwt(self, jwt_token: str):
        isTokenValid: bool = False

        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
            isTokenValid = True
        except:
            payload = None

        return isTokenValid
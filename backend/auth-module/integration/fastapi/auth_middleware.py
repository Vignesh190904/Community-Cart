"""
Authentication Middleware for FastAPI
Integrates with Node.js Auth Microservice
"""
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from .auth_client import auth_client


security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials) -> dict:
    """
    Verify JWT token with auth microservice
    
    Args:
        credentials: HTTP Bearer credentials
        
    Returns:
        User data from token
        
    Raises:
        HTTPException if token is invalid
    """
    try:
        token = credentials.credentials
        result = await auth_client.verify_token(token)
        
        if not result.get("success"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        return result.get("data", {}).get("user", {})
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


async def get_current_user(credentials: HTTPAuthorizationCredentials = security) -> dict:
    """
    Dependency to get current authenticated user
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            return {"user": user}
    """
    return await verify_token(credentials)


def require_roles(allowed_roles: List[str]):
    """
    Dependency factory for role-based access control
    
    Usage:
        @app.get("/admin")
        async def admin_route(user: dict = Depends(require_roles(["admin"]))):
            return {"message": "Admin access"}
    """
    async def role_checker(credentials: HTTPAuthorizationCredentials = security) -> dict:
        user = await verify_token(credentials)
        user_role = user.get("role", "").lower()
        
        if user_role not in [role.lower() for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        
        return user
    
    return role_checker


# Convenience functions for common role checks
async def require_admin(credentials: HTTPAuthorizationCredentials = security) -> dict:
    """Require admin role"""
    user = await verify_token(credentials)
    user_role = user.get("role", "").lower()
    
    if user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin role required."
        )
    
    return user


async def require_teacher_or_admin(credentials: HTTPAuthorizationCredentials = security) -> dict:
    """Require teacher or admin role"""
    user = await verify_token(credentials)
    user_role = user.get("role", "").lower()
    
    if user_role not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Teacher or Admin role required."
        )
    
    return user

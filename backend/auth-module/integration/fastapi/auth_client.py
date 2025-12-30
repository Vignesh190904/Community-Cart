"""
Auth Client - Communicates with Node.js Auth Microservice
"""
import httpx
import os
from typing import Optional, Dict, Any


class AuthClient:
    """Client for communicating with the authentication microservice"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        self.base_url = base_url.rstrip('/')
        self.timeout = 10.0
    
    async def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify JWT token with auth service
        
        Args:
            token: JWT token to verify
            
        Returns:
            Dict containing user information if valid
            
        Raises:
            Exception if token is invalid or service is unavailable
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/auth/verify-token",
                    json={"token": token}
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise Exception(error_data.get("message", "Token verification failed"))
                    
            except httpx.RequestError as e:
                raise Exception(f"Auth service unavailable: {str(e)}")
    
    async def get_user_by_id(self, user_id: str, token: str) -> Optional[Dict[str, Any]]:
        """
        Get user details by ID
        
        Args:
            user_id: User ID to fetch
            token: Admin JWT token
            
        Returns:
            User data if found
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/auth/admin/users/{user_id}",
                    headers={"Authorization": f"Bearer {token}"}
                )
                
                if response.status_code == 200:
                    return response.json()
                return None
                
            except httpx.RequestError:
                return None
    
    async def health_check(self) -> bool:
        """
        Check if auth service is healthy
        
        Returns:
            True if service is healthy, False otherwise
        """
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(f"{self.base_url}/health")
                return response.status_code == 200
            except:
                return False


# Singleton instance
auth_client = AuthClient()

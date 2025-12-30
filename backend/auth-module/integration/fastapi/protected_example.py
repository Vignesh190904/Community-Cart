"""
Example protected routes using auth middleware
"""
from fastapi import APIRouter, Depends
from .auth_middleware import (
    get_current_user,
    require_admin,
    require_teacher_or_admin,
    require_roles
)

router = APIRouter(prefix="/protected", tags=["Protected Routes"])


@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    """
    Get current user profile
    Requires: Any authenticated user
    """
    return {
        "success": True,
        "message": "Profile retrieved successfully",
        "data": {"user": user}
    }


@router.get("/admin/dashboard")
async def admin_dashboard(user: dict = Depends(require_admin)):
    """
    Admin dashboard
    Requires: Admin role
    """
    return {
        "success": True,
        "message": "Welcome to admin dashboard",
        "data": {
            "user": user,
            "stats": {
                "total_users": 100,
                "active_sessions": 25
            }
        }
    }


@router.get("/teacher/exams")
async def teacher_exams(user: dict = Depends(require_teacher_or_admin)):
    """
    Teacher's exams
    Requires: Teacher or Admin role
    """
    return {
        "success": True,
        "message": "Teacher exams",
        "data": {
            "user": user,
            "exams": ["Exam 1", "Exam 2"]
        }
    }


@router.get("/student/results")
async def student_results(user: dict = Depends(require_roles(["student"]))):
    """
    Student results
    Requires: Student role
    """
    return {
        "success": True,
        "message": "Student results",
        "data": {
            "user": user,
            "results": ["Result 1", "Result 2"]
        }
    }

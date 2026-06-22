"""
Assets router - backgrounds, mascots, filters
"""
import traceback
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from database import get_supabase

router = APIRouter(tags=["assets"])


@router.get("/backgrounds")
async def get_backgrounds():
    """Get all active backgrounds."""
    try:
        db = get_supabase()
        result = (
            db.table("backgrounds")
            .select("*")
            .eq("is_active", True)
            .order("sort_order")
            .execute()
        )

        backgrounds = []
        for bg in result.data or []:
            image_url = db.storage.from_("assets").get_public_url(bg["image_path"])
            thumbnail_url = (
                db.storage.from_("assets").get_public_url(bg["thumbnail_path"])
                if bg.get("thumbnail_path")
                else image_url
            )
            backgrounds.append({
                "id": bg["id"],
                "name": bg["name"],
                "category": bg["category"],
                "description": bg.get("description"),
                "image_url": image_url,
                "thumbnail_url": thumbnail_url,
            })

        return {"success": True, "message": "Backgrounds retrieved", "data": backgrounds}
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.get("/mascots")
async def get_mascots():
    """Get all active mascots."""
    try:
        db = get_supabase()
        result = (
            db.table("mascots")
            .select("*")
            .eq("is_active", True)
            .order("sort_order")
            .execute()
        )

        mascots = []
        for m in result.data or []:
            image_url = db.storage.from_("assets").get_public_url(m["image_path"])
            thumbnail_url = (
                db.storage.from_("assets").get_public_url(m["thumbnail_path"])
                if m.get("thumbnail_path")
                else image_url
            )
            mascots.append({
                "id": m["id"],
                "name": m["name"],
                "description": m.get("description"),
                "image_url": image_url,
                "thumbnail_url": thumbnail_url,
            })

        return {"success": True, "message": "Mascots retrieved", "data": mascots}
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


@router.get("/filters")
async def get_filters():
    """Get all active AI filters."""
    try:
        db = get_supabase()
        result = (
            db.table("ai_filters")
            .select("*")
            .eq("is_active", True)
            .order("sort_order")
            .execute()
        )

        filters = []
        for f in result.data or []:
            filters.append({
                "id": f["id"],
                "name": f["name"],
                "description": f.get("description"),
                "filter_type": f["filter_type"],
            })

        return {"success": True, "message": "Filters retrieved", "data": filters}
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

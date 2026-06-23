"""
Assets router - backgrounds, mascots, filters
"""
import traceback
from datetime import datetime, timezone, timedelta
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


@router.get("/mood/weekly")
async def get_weekly_mood():
    """Agregat ekspresi wajah 7 hari terakhir dari tabel face_expressions."""
    try:
        db = get_supabase()
        since = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()

        result = (
            db.table("face_expressions")
            .select("expression")
            .gte("created_at", since)
            .execute()
        )

        counts = {"happy": 0, "normal": 0, "sad": 0}
        for row in result.data or []:
            expr = row.get("expression", "").lower()
            if expr in counts:
                counts[expr] += 1

        total = sum(counts.values())
        dominant = max(counts, key=counts.get) if total > 0 else None

        label_map = {
            "happy": "Senang",
            "normal": "Netral",
            "sad": "Sedih",
        }

        breakdown = []
        for expr, count in counts.items():
            breakdown.append({
                "expression": expr,
                "label": label_map.get(expr, expr),
                "count": count,
                "percent": round((count / total * 100) if total > 0 else 0, 1),
            })
        breakdown.sort(key=lambda x: x["count"], reverse=True)

        return {
            "success": True,
            "message": "Weekly mood retrieved",
            "data": {
                "total": total,
                "dominant": dominant,
                "dominant_label": label_map.get(dominant, "-") if dominant else "-",
                "breakdown": breakdown,
                "since": since,
            },
        }
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})

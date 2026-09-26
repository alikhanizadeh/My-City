from django.contrib.gis.geos import Point


def make_point(lng: float, lat: float) -> Point:
    """ساخت یک نقطه PostGIS از longitude و latitude (SRID=4326)"""
    return Point(float(lng), float(lat), srid=4326)

import { Injectable } from "@angular/core";
import { L } from "./leaflet-setup";
import "leaflet.markercluster";
import "leaflet.heat";
import { Report } from "@core/models/report.model";
import { environment } from "@env/environment";

const TILE_LAYERS = {
  voyager: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  positron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

export type TileLayerKey = keyof typeof TILE_LAYERS;

@Injectable({ providedIn: "root" })
export class LeafletMapService {
  private map!: L.Map;
  private currentTileLayer!: L.TileLayer;
  private clusterGroup!: L.MarkerClusterGroup;
  private heatLayer: any = null;
  private userMarker: L.Marker | null = null;

  // --- fallback خودکار منبع تایل ---
  private readonly fallbackChain: TileLayerKey[] = [
    "voyager",
    "positron",
    "osm",
  ];
  private fallbackIndex = 0;
  private tileErrorTimes: number[] = [];
  private readonly TILE_ERROR_THRESHOLD = 6; // تعداد خطا برای تشخیص قطعی سرور
  private readonly TILE_ERROR_WINDOW_MS = 5000; // بازه زمانی بررسی خطاها
  private onTileFallback:
    | ((key: TileLayerKey, allFailed: boolean) => void)
    | null = null;

  /** برای اطلاع‌رسانی به کامپوننت (مثلاً نمایش Toast) وقتی سوییچ تایل رخ می‌دهد */
  setTileFallbackListener(
    callback: (key: TileLayerKey, allFailed: boolean) => void,
  ): void {
    this.onTileFallback = callback;
  }

  init(elementId: string, center: [number, number], zoom: number): L.Map {
    this.map = L.map(elementId, {
      zoomControl: true,
      center,
      zoom,
    });

    this.fallbackIndex = 0;
    this.tileErrorTimes = [];
    this.currentTileLayer = this.createTileLayer(this.fallbackChain[0]);
    this.currentTileLayer.addTo(this.map);

    this.clusterGroup = L.markerClusterGroup({
      iconCreateFunction: (cluster) =>
        L.divIcon({
          html: `<div class="marker-cluster-custom" style="width:40px;height:40px;">${cluster.getChildCount()}</div>`,
          className: "",
          iconSize: L.point(40, 40),
        }),
    });
    this.map.addLayer(this.clusterGroup);

    return this.map;
  }

  /** سوییچ دستی (دکمه «تغییر نوع نقشه») */
  switchTileLayer(key: TileLayerKey): void {
    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }
    const idx = this.fallbackChain.indexOf(key);
    this.fallbackIndex = idx === -1 ? 0 : idx;
    this.tileErrorTimes = [];
    this.currentTileLayer = this.createTileLayer(key);
    this.currentTileLayer.addTo(this.map);
  }

  /** می‌سازد یک تایل‌لایر و به رویداد tileerror آن گوش می‌دهد */
  private createTileLayer(key: TileLayerKey): L.TileLayer {
    const layer = TILE_LAYERS[key];
    const tileLayer = L.tileLayer(layer.url, {
      attribution: layer.attribution,
      maxZoom: 19,
    });
    tileLayer.on("tileerror", () => this.handleTileError());
    return tileLayer;
  }

  /** هر بار یک کاشی (tile) لود نشود صدا زده می‌شود */
  private handleTileError(): void {
    const now = Date.now();
    this.tileErrorTimes.push(now);
    this.tileErrorTimes = this.tileErrorTimes.filter(
      (t) => now - t < this.TILE_ERROR_WINDOW_MS,
    );

    // فقط وقتی تعداد خطاها در بازه زمانی از آستانه گذشت، یعنی احتمالاً
    // کل سرور تایل قطع است (نه یک خطای موردی) و سوییچ می‌کنیم
    if (this.tileErrorTimes.length >= this.TILE_ERROR_THRESHOLD) {
      this.tileErrorTimes = [];
      this.switchToNextFallback();
    }
  }

  private switchToNextFallback(): void {
    const isLast = this.fallbackIndex >= this.fallbackChain.length - 1;
    if (isLast) {
      this.onTileFallback?.(this.fallbackChain[this.fallbackIndex], true);
      return;
    }

    this.fallbackIndex++;
    const nextKey = this.fallbackChain[this.fallbackIndex];

    if (this.currentTileLayer) {
      this.map.removeLayer(this.currentTileLayer);
    }
    this.currentTileLayer = this.createTileLayer(nextKey);
    this.currentTileLayer.addTo(this.map);

    this.onTileFallback?.(nextKey, false);
  }

  setMarkers(reports: Report[], onPopupNavigate: (id: number) => void): void {
    this.clusterGroup.clearLayers();

    reports.forEach((report) => {
      const color = report.category?.color ?? "#2563EB";
      const icon = L.divIcon({
        className: "",
        html: `<div class="city-marker" style="background-color:${color}">
                 <span class="city-marker__icon">●</span>
               </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([report.lat, report.lng], { icon });
      const popupId = `popup-navigate-${report.id}`;

      const imageHtml = report.image
        ? `<img src="${report.image}" class="city-popup__image" alt="${report.title}" />`
        : "";

      marker.bindPopup(
        `<div class="city-popup">
           ${imageHtml}
           <div class="city-popup__body">
             <div class="city-popup__meta">
               <span class="city-popup__badge" style="background-color:${color}">${report.category?.name ?? ""}</span>
             </div>
             <div class="city-popup__title">${escapeHtml(report.title)}</div>
             <div style="font-size:12px;color:#64748B;">${escapeHtml(report.address ?? "")}</div>
             <a href="#" id="${popupId}" class="city-popup__link">مشاهده جزئیات ←</a>
           </div>
         </div>`,
      );

      marker.on("popupopen", () => {
        const link = document.getElementById(popupId);
        if (link) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            onPopupNavigate(report.id);
          });
        }
      });

      this.clusterGroup.addLayer(marker);
    });
  }

  toggleHeatmap(points: [number, number, number][], show: boolean): void {
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
      this.heatLayer = null;
    }
    if (show && points.length) {
      this.heatLayer = (L as any).heatLayer(points, {
        radius: 28,
        blur: 20,
        maxZoom: 17,
      });
      this.heatLayer!.addTo(this.map);
    }
  }

  locateUser(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          this.map.setView([lat, lng], 15);
          this.setUserMarker(lat, lng);
          resolve({ lat, lng });
        },
        () => reject("امکان دریافت موقعیت مکانی وجود ندارد."),
      );
    });
  }

  setUserMarker(lat: number, lng: number): void {
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
    }
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:18px;height:18px;border-radius:50%;background:#2563EB;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.25)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
    this.userMarker = L.marker([lat, lng], { icon }).addTo(this.map);
  }

  getBounds(): L.LatLngBounds {
    return this.map.getBounds();
  }

  onMoveEnd(callback: () => void): void {
    this.map.on("moveend zoomend", callback);
  }

  destroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

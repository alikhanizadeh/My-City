import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { LucideAngularModule, LocateFixed, MapPin } from "lucide-angular";
import * as L from "leaflet";
import { environment } from "@env/environment";
import { GeocodingService } from "@core/services/geocoding.service";

@Component({
  selector: "app-step-location",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <h2 class="text-lg font-semibold text-ink-primary mb-2">محل دقیق مشکل کجاست؟</h2>
    <p class="text-sm text-ink-secondary mb-4">روی نقشه کلیک کنید یا از دکمه موقعیت من استفاده کنید.</p>

    <div class="relative rounded-card overflow-hidden h-72 border border-slate-100">
      <div id="wizard-location-map" class="absolute inset-0"></div>
      <button
        (click)="locateMe()"
        class="absolute bottom-3 left-3 z-[500] w-10 h-10 rounded-full bg-white shadow-soft-hover flex items-center justify-center"
      >
        <lucide-icon [img]="LocateIcon" [size]="18" class="text-primary-from"></lucide-icon>
      </button>
    </div>

    <div class="mt-4">
      <label class="text-xs font-medium text-ink-secondary mb-1 flex items-center gap-1">
        <lucide-icon [img]="PinIcon" [size]="14"></lucide-icon>
        آدرس (به‌صورت خودکار پر می‌شود، قابل ویرایش)
      </label>
      <input class="input-field" [value]="address" (input)="addressChange.emit($any($event.target).value)" />
    </div>
  `,
})
export class StepLocationComponent implements OnInit, OnDestroy {
  @Input() lat: number | null = null;
  @Input() lng: number | null = null;
  @Input() address = "";
  @Output() locationChange = new EventEmitter<{ lat: number; lng: number }>();
  @Output() addressChange = new EventEmitter<string>();

  readonly LocateIcon = LocateFixed;
  readonly PinIcon = MapPin;

  private map!: L.Map;
  private marker: L.Marker | null = null;

  constructor(private geocoding: GeocodingService) {}

  ngOnInit(): void {
    const center: [number, number] = [
      this.lat ?? environment.defaultMapCenter.lat,
      this.lng ?? environment.defaultMapCenter.lng,
    ];
    this.map = L.map("wizard-location-map").setView(center, 14);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      { attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19 }
    ).addTo(this.map);

    if (this.lat && this.lng) {
      this.placeMarker(this.lat, this.lng, false);
    }

    this.map.on("click", (e: L.LeafletMouseEvent) => {
      this.placeMarker(e.latlng.lat, e.latlng.lng, true);
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  locateMe(): void {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      this.map.setView([lat, lng], 16);
      this.placeMarker(lat, lng, true);
    });
  }

  private placeMarker(lat: number, lng: number, reverseGeocode: boolean): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
    this.locationChange.emit({ lat, lng });

    if (reverseGeocode) {
      this.geocoding
        .reverseGeocode(lat, lng)
        .subscribe((address) => this.addressChange.emit(address));
    }
  }
}

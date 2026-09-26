import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import * as L from "leaflet";

@Component({
  selector: "app-mini-map",
  standalone: true,
  imports: [CommonModule],
  template: `<div id="report-mini-map" class="w-full h-56 rounded-card overflow-hidden"></div>`,
})
export class MiniMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() lat!: number;
  @Input() lng!: number;
  @Input() color = "#2563EB";

  private map: L.Map | null = null;

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes["lat"] || changes["lng"])) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private render(): void {
    if (!this.lat || !this.lng) return;

    if (!this.map) {
      this.map = L.map("report-mini-map", {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
      }).setView([this.lat, this.lng], 15);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19 }
      ).addTo(this.map);
    } else {
      this.map.setView([this.lat, this.lng], 15);
    }

    const icon = L.divIcon({
      className: "",
      html: `<div class="city-marker" style="background-color:${this.color}"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
    L.marker([this.lat, this.lng], { icon }).addTo(this.map);
  }
}

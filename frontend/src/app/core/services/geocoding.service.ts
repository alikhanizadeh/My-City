import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "@env/environment";

interface NominatimResponse {
  display_name: string;
  address?: Record<string, string>;
}

@Injectable({ providedIn: "root" })
export class GeocodingService {
  constructor(private http: HttpClient) {}

  /** آدرس متنی را از روی مختصات جغرافیایی برمی‌گرداند */
  reverseGeocode(lat: number, lng: number): Observable<string> {
    const url = `${environment.nominatimUrl}/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fa`;
    return this.http
      .get<NominatimResponse>(url)
      .pipe(map((res) => res.display_name ?? ""));
  }
}

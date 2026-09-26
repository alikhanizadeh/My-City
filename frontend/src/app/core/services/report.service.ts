import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  Comment,
  CreateReportPayload,
  PaginatedResponse,
  Report,
  ReportFilters,
  ReportStatus,
} from "@core/models/report.model";

@Injectable({ providedIn: "root" })
export class ReportService {
  private readonly baseUrl = `${environment.apiBaseUrl}/reports`;

  constructor(private http: HttpClient) {}

  list(filters: ReportFilters = {}): Observable<PaginatedResponse<Report>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<Report>>(`${this.baseUrl}/`, {
      params,
    });
  }

  getById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}/${id}/`);
  }

  create(payload: CreateReportPayload): Observable<Report> {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", String(payload.category));
    formData.append("priority", payload.priority);
    formData.append("address", payload.address);
    formData.append("lat", String(payload.lat));
    formData.append("lng", String(payload.lng));
    if (payload.image) {
      formData.append("image", payload.image);
    }
    return this.http.post<Report>(`${this.baseUrl}/`, formData);
  }

  updateStatus(
    id: number,
    status: ReportStatus,
    note = ""
  ): Observable<Report> {
    return this.http.patch<Report>(`${this.baseUrl}/${id}/status/`, {
      status,
      note,
    });
  }

  addComment(id: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/${id}/comments/`, {
      text,
    });
  }

  nearby(lat: number, lng: number, radius = 500): Observable<Report[]> {
    const params = new HttpParams()
      .set("lat", lat)
      .set("lng", lng)
      .set("radius", radius);
    return this.http.get<Report[]>(`${this.baseUrl}/nearby/`, { params });
  }

  heatmap(): Observable<[number, number, number][]> {
    return this.http.get<[number, number, number][]>(
      `${this.baseUrl}/heatmap/`
    );
  }
}

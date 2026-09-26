import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { StatsOverview } from "@core/models/report.model";

@Injectable({ providedIn: "root" })
export class StatsService {
  private readonly baseUrl = `${environment.apiBaseUrl}/stats`;

  constructor(private http: HttpClient) {}

  overview(): Observable<StatsOverview> {
    return this.http.get<StatsOverview>(`${this.baseUrl}/overview/`);
  }
}

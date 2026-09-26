import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { environment } from "@env/environment";
import { Category } from "@core/models/category.model";

@Injectable({ providedIn: "root" })
export class CategoryService {
  private readonly baseUrl = `${environment.apiBaseUrl}/categories`;
  private cache$?: Observable<Category[]>;

  constructor(private http: HttpClient) {}

  list(): Observable<Category[]> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<Category[]>(`${this.baseUrl}/`)
        .pipe(shareReplay(1));
    }
    return this.cache$;
  }
}

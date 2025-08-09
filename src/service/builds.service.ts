import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Build } from '@models/build';

@Injectable({ providedIn: 'root' })
export class BuildsService {
  private base = 'http://localhost:3000/builds';

  constructor(private http: HttpClient) {}

  private getUserId(): string {
    const id = localStorage.getItem('userId') || JSON.parse(sessionStorage.getItem('loggedInUser') || '{}')._id;
    if (!id) throw new Error('No user id');
    return id;
  }

  // CRUD
  create(name = 'My PC Build'): Observable<Build> {
    return this.http.post<Build>(this.base, { userId: this.getUserId(), name });
  }
  listMine(): Observable<Build[]> {
    return this.http.get<Build[]>(`${this.base}/user/${this.getUserId()}`);
  }
  get(id: string): Observable<Build> {
    return this.http.get<Build>(`${this.base}/${id}`);
  }
  rename(id: string, name: string): Observable<Build> {
    return this.http.put<Build>(`${this.base}/${id}`, { name });
  }
  delete(id: string): Observable<{ok: boolean}> {
    return this.http.delete<{ok: boolean}>(`${this.base}/${id}`);
  }

  // Items
  addItem(id: string, productId: string, quantity = 1): Observable<Build> {
    return this.http.put<Build>(`${this.base}/${id}/addItem`, { productId, quantity });
  }
  removeItem(id: string, productId: string): Observable<Build> {
    return this.http.put<Build>(`${this.base}/${id}/removeItem`, { productId });
  }

  // Pay (mark as paid)
  markPaid(id: string): Observable<Build> {
    return this.http.put<Build>(`${this.base}/${id}`, { isPaid: true });
  }
  markBuildAsPaid(buildId: string): Observable<any> {
    return this.http.put(`${this.base}/${buildId}/pay`, {});
  }
}

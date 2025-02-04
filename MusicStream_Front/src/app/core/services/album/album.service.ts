import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Album, AlbumRequest, PageResponse } from '../../models/album.model';
import {Observable, take} from 'rxjs';
import { environment} from "../../../../environments/environment";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../features/store/auth/auth.reducer";
import {map} from "rxjs/operators";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private userRole: string = '';

  constructor(private readonly http: HttpClient , private readonly store: Store<{ auth: AuthState }>) {
    this.store.select(state => state.auth).pipe(
      take(1),
      map(authState => {
        if (authState.token) {
          const decodedToken: any = jwtDecode(authState.token);
          this.userRole = decodedToken.roles?.[0] || ''; // Assuming roles is an array
        }
      })
    ).subscribe();
  }
  private getEndpoint(prefix: string): string {
    return this.userRole === 'ROLE_ADMIN' ? `${this.apiUrl}/admin${prefix}` : `${this.apiUrl}/user${prefix}`;
  }

  // Get all albums
  getAlbums(page: number, size: number, sortBy: string): Observable<PageResponse<Album>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<Album>>(this.getEndpoint('/albums'), { params });
  }

  // Search albums by title
  searchByTitle(title: string, page: number, size: number, sortBy: string): Observable<PageResponse<Album>> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<Album>>(this.getEndpoint('/albums/search'), { params });
  }

  // Search albums by artist
  searchByArtist(artist: string, page: number, size: number, sortBy: string): Observable<PageResponse<Album>> {
    const params = new HttpParams()
      .set('artist', artist)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<Album>>(this.getEndpoint('/albums/artist'), { params });
  }

  // Filter albums by year
  filterByYear(year: number, page: number, size: number, sortBy: string): Observable<PageResponse<Album>> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<PageResponse<Album>>(this.getEndpoint('/albums/year'), { params });
  }

  // Create a new album
  createAlbum(album: AlbumRequest): Observable<Album> {
    return this.http.post<Album>(`${this.apiUrl}/admin/albums`, album);
  }

  // Update an existing album
  updateAlbum(id: string, album: AlbumRequest): Observable<Album> {
    return this.http.put<Album>(`${this.apiUrl}/admin/albums/${id}`, album);
  }

  // Delete an album
  deleteAlbum(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/albums/${id}`);
  }

  getAlbumById(id: string): Observable<Album> {
    return this.http.get<Album>(this.getEndpoint(`/albums/detail_album/${id}`));
  }
}
import { Injectable } from '@angular/core';
import {Track, TrackPage} from '../../models/track.model';
import {catchError, Observable, take, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../features/store/auth/auth.reducer";
import {map} from "rxjs/operators";
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  private userRole: string = '';
  constructor(private readonly http: HttpClient , private store: Store<{ auth: AuthState }>) {
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

  getAllTracks(page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<TrackPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    return this.http.get<TrackPage>(this.getEndpoint('/songs'), { params });
  }

  searchTracks(title: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<TrackPage> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    return this.http.get<TrackPage>(this.getEndpoint('/songs/search'), { params })
  }

  searchSongsByTitleInAlbum(
    albumId: string,
    title: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'title'
  ): Observable<TrackPage> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<TrackPage>(
      this.getEndpoint(`/songs/album/${albumId}/search`),
      { params }
    );
  }
  getTracksByAlbum(albumId: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<TrackPage> {
    const params = new HttpParams()
      .set('albumId', albumId)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    return this.http.get<TrackPage>(this.getEndpoint('/songs/album'), { params });
  }
  createTrack(trackData: Track, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('track', JSON.stringify(trackData)); // Append track data as JSON
    formData.append('audioFile', file); // Append the file
    formData.forEach((value, key) => {console.log(key + ' ' + value);});
    return this.http.post(this.getEndpoint('/songs'), formData);
  }


  updateTrack(id: string, track: Track, audioFile?: File): Observable<Track> {
    const formData = new FormData();
    formData.append('song', JSON.stringify(track));

    if (audioFile) {
      formData.append('audioFile', audioFile); // Append the file only if it exists
    }

    return this.http.put<Track>(this.getEndpoint(`/songs/${id}`), formData);
  }

  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(this.getEndpoint(`/songs/${id}`));
  }

  getTrackById(id: string): Observable<Track> {
    return this.http.get<Track>(this.getEndpoint(`/songs/${id}`));
  }
}
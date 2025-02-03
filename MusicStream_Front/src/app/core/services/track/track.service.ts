import { Injectable } from '@angular/core';
import {Track, TrackPage} from '../../models/track.model';
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  constructor(private readonly http: HttpClient) {}

  getAllTracks(page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<TrackPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    return this.http.get<TrackPage>(`${this.apiUrl}/user/songs`, { params });
  }

  searchTracks(title: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<TrackPage> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    return this.http.get<TrackPage>(`${this.apiUrl}/user/songs/search`, { params });
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
      `${this.apiUrl}/user/songs/album/${albumId}/search`,
      { params }
    );
  }
  getTracksByAlbum(albumId: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<TrackPage> {
    const params = new HttpParams()
      .set('albumId', albumId)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    return this.http.get<TrackPage>(`${this.apiUrl}/admin/songs/album`, { params });
  }
  createTrack(trackData: Track, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('track', JSON.stringify(trackData)); // Append track data as JSON
    formData.append('audioFile', file); // Append the file
    formData.forEach((value, key) => {console.log(key + ' ' + value);});
    return this.http.post(`${this.apiUrl}/admin/songs`, formData);
  }


  updateTrack(id: string, track: Track, audioFile?: File): Observable<Track> {
    const formData = new FormData();
    formData.append('song', JSON.stringify(track));

    if (audioFile) {
      formData.append('audioFile', audioFile); // Append the file only if it exists
    }

    return this.http.put<Track>(`${this.apiUrl}/admin/songs/${id}`, formData);
  }

  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/songs/${id}`);
  }

  getTrackById(id: string): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/admin/songs/${id}`);
  }
}

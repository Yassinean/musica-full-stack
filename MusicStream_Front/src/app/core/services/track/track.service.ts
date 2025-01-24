import { Injectable } from '@angular/core';
import {Track, SongRequestDTO, SongResponseDTO} from '../../models/track.model';
import {catchError, from, map, Observable, of, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

interface AudioFileRecord {
  id: string;
  file: Blob;
}

interface ImageFileRecord {
  id: string;
  file: Blob;
}
@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly apiUrl = `${environment.apiUrl}/api`;
  constructor(private readonly http: HttpClient) {}

  // Get all tracks (songs) for the user
  getAllTracks(page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<SongResponseDTO[]> {
    return this.http.get<SongResponseDTO[]>(`${this.apiUrl}/user/songs`, {
      params: { page: page.toString(), size: size.toString(), sortBy: sortBy },
    }).pipe(
      catchError((error) => {
        console.error('Error fetching tracks', error);
        return throwError(() => new Error('Error fetching tracks'));
      })
    );
  }

  searchTracksByTitle(title: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<SongResponseDTO[]> {
    return this.http.get<SongResponseDTO[]>(`${this.apiUrl}/user/songs/search`, {
      params: { title, page: page.toString(), size: size.toString(), sortBy: sortBy },
    }).pipe(
      catchError((error) => {
        console.error('Error searching tracks', error);
        return throwError(() => new Error('Error searching tracks'));
      })
    );
  }

  getTracksByAlbumId(albumId: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<SongResponseDTO[]> {
    return this.http.get<SongResponseDTO[]>(`${this.apiUrl}/user/songs/album`, {
      params: { albumId, page: page.toString(), size: size.toString(), sortBy: sortBy },
    }).pipe(
      catchError((error) => {
        console.error('Error fetching tracks by album', error);
        return throwError(() => new Error('Error fetching tracks by album'));
      })
    );
  }

  createTrack(track: SongRequestDTO): Observable<SongResponseDTO> {
    return this.http.post<SongResponseDTO>(`${this.apiUrl}/admin/songs`, track).pipe(
      catchError((error) => {
        console.error('Error creating track', error);
        return throwError(() => new Error('Error creating track'));
      })
    );
  }
  updateTrack(id: string, track: SongRequestDTO): Observable<SongResponseDTO> {
    return this.http.put<SongResponseDTO>(`${this.apiUrl}/admin/chansons/${id}`, track).pipe(
      catchError((error) => {
        console.error('Error updating track', error);
        return throwError(() => new Error('Error updating track'));
      })
    );
  }

  // Delete a track (song)
  deleteTrack(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/chansons/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting track', error);
        return throwError(() => new Error('Error deleting track'));
      })
    );
  }
}

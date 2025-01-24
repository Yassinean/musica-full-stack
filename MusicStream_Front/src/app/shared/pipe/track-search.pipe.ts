import { Pipe, PipeTransform } from '@angular/core';
import {Track} from "../../core/models/track.model";
@Pipe({
  name: 'trackSearch',
  standalone: true,
  pure: false
})
export class TrackSearchPipe implements PipeTransform {
  transform(tracks: Track[] | null | undefined, searchTerm: string | null): Track[] {
    if (!tracks) return [];
    if (!searchTerm) return tracks;

    const search = searchTerm.toLowerCase().trim();

    return tracks.filter(track =>
      track.title?.toLowerCase().includes(search) ||
      track.artist?.toLowerCase().includes(search)
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  filter,
  map,
  mergeMap,
  pluck,
  share,
  switchMap,
  tap,
  toArray,
  catchError,
  retry
} from 'rxjs/operators';

import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService
  ) {}

  getForecast() {
    return this.getCurrentLocation().pipe(
      map((coords) => {
        return new HttpParams()
          .set('lat', String(coords.latitude))
          .set('lon', String(coords.longitude))
          .set('units', 'metric')
          .set('appid', environment.API_KEY);
      }),
      switchMap((params) =>
        this.http.get<OpenWeatherResponse>(this.url, { params })
      ),
      pluck('list'),
      mergeMap((value) => of(...value)),
      filter((value, index) => index % 8 === 0),
      map((value) => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp,
        };
      }),
      toArray(),
      share()
    );
  }

  getCurrentLocation() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (postition) => {
          observer.next(postition.coords);
          observer.complete();
        },
        (err) => observer.error(err)
      );
    }).pipe(
      tap(() => {
        this.notificationsService.addSuccess('Got your location')
      }),
      catchError((err) => {
        this.notificationsService.addError('Failed to get your location');

        return throwError(err);
      })
    );
  }
}

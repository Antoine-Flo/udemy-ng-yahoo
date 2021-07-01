import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  forecast$: Observable<any>;

  constructor(weatherService: WeatherService) {
    this.forecast$ = weatherService.getForecast()
  }

  ngOnInit(): void {}
}

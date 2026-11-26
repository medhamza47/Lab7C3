import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: '<header><h1><a routerLink="/students">EduManager</a></h1></header><main><router-outlet/></main>',
})
export class AppComponent {}

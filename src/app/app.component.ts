import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Employee App';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) {
            route = route.firstChild;
          }
          return route?.snapshot.data?.['title'] || 'Default Title';
        })
      )
      .subscribe(title => {
        this.title = title;
        this.titleService.setTitle(title + ' | Employee App');
      });
  }
}

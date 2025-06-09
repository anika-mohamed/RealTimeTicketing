import { Component } from '@angular/core';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports:[TicketComponent],
  standalone: true,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ang';
}


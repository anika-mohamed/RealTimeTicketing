import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  ticketData = {
    totalTickets: 0,
    ticketReleaseRate: 0,
    customerRetrievalRate: 0,
    maxTicketCapacity: 0,
  };

  statusMessage: string = '';
  alertClass: string = '';
  private timeoutId: any;

  constructor(private http: HttpClient) {}

  // Update status message with alert type
  updateStatus(message: string, alertType: string = 'alert-info') {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); // Clear previous timeout
    }

    this.statusMessage = message;
    this.alertClass = alertType;

    this.timeoutId = setTimeout(() => {
      this.statusMessage = '';
      this.alertClass = '';
    }, 6000);
  }

  // Save ticket configuration
  saveTicketConfiguration() {
    if (this.validateInputs()) {
      this.http.post('http://localhost:8080/api/configuration/save', this.ticketData, { responseType: 'text' })
        .subscribe(
          (response) => {
            if (response) {
              this.updateStatus('Ticket configuration saved successfully!', 'alert-success');
            } else {
              this.updateStatus('Unexpected empty response from server.', 'alert-warning');
            }
          },
          (error) => {
            console.error('Error saving ticket configuration:', error);
            this.updateStatus('Failed to save ticket configuration.', 'alert-danger');
          }
        );
    } else {
      this.updateStatus('Please fill all required fields.', 'alert-warning');
    }
  }

  // Start ticket simulation
  startTicketSimulation() {
    if (this.validateInputs()) {
      this.http.post('http://localhost:8080/api/configuration/start', this.ticketData, { responseType: 'text' })
        .subscribe(
          (response) => {
            this.updateStatus('Ticket simulation started successfully!', 'alert-success');
          },
          (error) => {
            console.error('Error starting ticket simulation:', error);
            this.updateStatus('Failed to start ticket simulation.', 'alert-danger');
          }
        );
    } else {
      this.updateStatus('Please fill all required fields.', 'alert-warning');
    }
  }

  // Stop ticket simulation
  stopTicketSimulation() {
    this.http.post('http://localhost:8080/api/configuration/stop', {}, { responseType: 'text' })
      .subscribe(
        (response) => {
          this.updateStatus('Ticket simulation stopped successfully.', 'alert-warning');
        },
        (error) => {
          console.error('Error stopping ticket simulation:', error);
          this.updateStatus('Failed to stop ticket simulation.', 'alert-danger');
        }
      );
  }

  // Validate ticket data inputs
  validateInputs(): boolean {
    return (
      this.ticketData.totalTickets > 0 &&
      this.ticketData.ticketReleaseRate > 0 &&
      this.ticketData.customerRetrievalRate > 0 &&
      this.ticketData.maxTicketCapacity > 0
    );
  }
}

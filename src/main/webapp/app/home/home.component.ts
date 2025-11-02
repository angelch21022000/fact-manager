import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import LoginComponent from 'app/login/login.component';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule, LoginComponent],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account = signal<Account | null>(null);

  private readonly destroy$ = new Subject<void>();

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  today: Date = new Date();

  // Datos de resumen de caja
  dailyRevenue: number = 2850.75;
  invoicesToday: number = 42;
  paidInvoices: number = 38;
  pendingInvoices: number = 4;
  pendingAmount: number = 420.5;
  voidedInvoices: number = 2;
  voidedAmount: number = 150.25;
  revenueGrowth: number = 12.5;

  // Métodos de pago
  cashAmount: number = 1850.25;
  debitAmount: number = 650.5;
  creditAmount: number = 250.0;
  transferAmount: number = 100.0;

  // Control de caja
  openingBalance: number = 500.0;
  expenses: number = 125.75;
  currentBalance: number = 3225.0;
  balanceDifference: number = 0;
  exchangeRate: number = 35.5;

  // Datos para gráficas
  salesChartData: any;
  chartOptions: any;

  // Datos de tablas
  todayInvoices: any[] = [];

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));

    this.calculateBalanceDifference();
    this.initializeChart();
    this.initializeData();
  }

  private calculateBalanceDifference(): void {
    this.balanceDifference = this.currentBalance - (this.openingBalance + this.dailyRevenue - this.expenses);
  }

  private initializeChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.salesChartData = {
      labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
      datasets: [
        {
          label: 'Ventas por Hora (USD)',
          data: [120, 190, 300, 250, 420, 280, 350, 410, 380, 150],
          fill: true,
          borderColor: documentStyle.getPropertyValue('--primary-500'),
          tension: 0.4,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        },
      ],
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  private initializeData(): void {
    // Facturas del día
    this.todayInvoices = [
      { number: 'FAC-001-2401', client: 'CONSUMIDOR FINAL', time: '08:15 AM', amount: 45.5, paymentMethod: 'Efectivo', status: 'Pagada' },
      {
        number: 'FAC-002-2401',
        client: 'EMPRESA XYZ C.A.',
        time: '09:30 AM',
        amount: 320.75,
        paymentMethod: 'Transferencia',
        status: 'Pagada',
      },
      { number: 'FAC-003-2401', client: 'CONSUMIDOR FINAL', time: '10:45 AM', amount: 85.0, paymentMethod: 'Débito', status: 'Pagada' },
      { number: 'FAC-004-2401', client: 'JUAN PÉREZ', time: '11:20 AM', amount: 150.25, paymentMethod: 'Crédito', status: 'Pagada' },
      { number: 'FAC-005-2401', client: 'MARÍA GONZÁLEZ', time: '12:30 PM', amount: 65.8, paymentMethod: 'Efectivo', status: 'Anulada' },
      { number: 'FAC-006-2401', client: 'CONSUMIDOR FINAL', time: '14:15 PM', amount: 420.0, paymentMethod: 'Efectivo', status: 'Pagada' },
      { number: 'FAC-007-2401', client: 'CARLOS RODRÍGUEZ', time: '15:40 PM', amount: 95.5, paymentMethod: 'Débito', status: 'Pendiente' },
      { number: 'FAC-008-2401', client: 'CONSUMIDOR FINAL', time: '16:20 PM', amount: 28.75, paymentMethod: 'Efectivo', status: 'Pagada' },
    ];
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Pagada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Anulada':
        return 'danger';
      default:
        return 'info';
    }
  }

  getPaymentMethodSeverity(method: string): string {
    switch (method) {
      case 'Efectivo':
        return 'success';
      case 'Débito':
        return 'info';
      case 'Crédito':
        return 'warning';
      case 'Transferencia':
        return 'help';
      default:
        return 'secondary';
    }
  }

  updateExchangeRate(): void {
    // Simular actualización del tipo de cambio
    this.exchangeRate = 35.5 + (Math.random() * 2 - 1);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Actualizado',
    //   detail: 'Tipo de cambio actualizado',
    //   life: 3000
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

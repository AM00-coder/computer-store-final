import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/service/cart.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BuildsService } from 'src/service/builds.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PaymentComponent implements OnInit {
  form!: FormGroup;
  buildId?: string;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private buildsService: BuildsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('📄 PaymentComponent loaded');

    // Build the form (keep this clean)
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(12)]],
      nameOnCard: ['', Validators.required],
      expiry: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
    });

    // Read optional ?buildId=... from the query string
    this.buildId = this.route.snapshot.queryParamMap.get('buildId') || undefined;
    console.log('🔎 buildId from query:', this.buildId);
  }

  handlePayment(event?: Event): void {
    if (event) event.preventDefault();
    console.log('💳 handlePayment() fired');

    if (this.form.invalid) {
      alert('Please fill all payment fields correctly.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to pay.');
      return;
    }

    // 1) Mark cart as paid
    // 2) (Optional) mark the selected build as paid if buildId is present
    // 3) (Optional) clear the cart if you implemented clearCart on the backend
    this.cartService.markCartAsPaid().pipe(
      switchMap(() => {
        // If you have a builds endpoint to mark paid:
        const build$ = this.buildId
          ? this.buildsService.markBuildAsPaid(this.buildId)
          : of(null);

        // If you implemented clearCart(userId) on the server, include it; otherwise skip.
        const clearCart$ = this.cartService.clearCart
          ? this.cartService.clearCart(userId)
          : of(null);

        return forkJoin([build$, clearCart$]);
      })
    ).subscribe({
      next: () => {
        alert('✅ Payment successful! Thank you.');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Payment failed:', err);
        alert('❌ Payment failed. Please try again.');
      }
    });
  }
}

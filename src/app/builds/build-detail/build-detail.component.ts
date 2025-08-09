import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BuildsService } from 'src/service/builds.service';
import { ProductsService } from 'src/service/products.service';
import { Build, BuildItem } from '@models/build';

@Component({
  standalone: true,
  selector: 'app-build-detail',
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container py-4" *ngIf="build">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h3 class="m-0">{{ build.name }}</h3>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" (click)="goBack()">Back</button>
        <button class="btn btn-success" [disabled]="build.items.length===0 || build.isPaid"
                (click)="goPay()">Pay {{ build.totalPrice | currency }}</button>
      </div>
    </div>
    <div class="mb-3">
      <span class="badge" [class.bg-success]="build.isPaid" [class.bg-secondary]="!build.isPaid">
        {{ build.isPaid ? 'Paid' : 'Draft' }}
      </span>
    </div>

    <div *ngIf="build.items.length === 0" class="alert alert-info">No items. Go to Catalog and add some.</div>

    <div class="list-group">
      <div class="list-group-item d-flex align-items-center" *ngFor="let it of build.items">
        <img [src]="it.product?.image" style="width:64px;height:64px;object-fit:cover" class="rounded me-3" />
        <div class="me-auto">
          <div class="fw-semibold">{{ it.product?.name }}</div>
          <div class="text-muted small">{{ it.product?.category }} • {{ it.product?.price | currency }}</div>
          <div class="text-muted small">Qty: {{ it.quantity }}</div>
        </div>
        <button class="btn btn-sm btn-outline-danger" (click)="removeItem(it.productId)">Remove</button>
      </div>
    </div>
  </div>
  `
})
export class BuildDetailComponent implements OnInit {
  build!: Build;
  id!: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private builds: BuildsService,
    private products: ProductsService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load() {
    this.builds.get(this.id).subscribe(b => {
      // Optionally hydrate product for UI if backend populated
      this.build = {
        ...b,
        items: b.items.map((i: any) => ({
          ...i,
          product: i.productId && typeof i.productId === 'object' ? {
            _id: i.productId._id,
            name: i.productId.name,
            price: i.productId.price,
            image: i.productId.image,
            category: i.productId.category
          } : undefined,
          productId: typeof i.productId === 'string' ? i.productId : i.productId._id
        }))
      };
    });
  }

  removeItem(productId: string) {
    this.builds.removeItem(this.id, productId).subscribe(b => this.load());
  }

  goPay() {
    // reuse your existing payment screen
    this.router.navigate(['/payment'], { queryParams: { buildId: this.id } });
  }
  goBack() { this.router.navigate(['/builds']); }
}


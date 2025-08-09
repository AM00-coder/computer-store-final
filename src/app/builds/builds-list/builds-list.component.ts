import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BuildsService } from 'src/service/builds.service';
import { Build } from '@models/build';

@Component({
  standalone: true,
  selector: 'app-builds-list',
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">My Builds</h3>
      <button class="btn btn-primary" (click)="makeBuild()">+ New Build</button>
    </div>

    <div *ngIf="builds.length === 0" class="alert alert-info">No builds yet. Create one!</div>

    <div class="row g-3">
      <div class="col-12 col-md-6 col-lg-4" *ngFor="let b of builds">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-1">{{ b.name }}</h5>
            <div class="text-muted small mb-2">{{ b.items.length }} items • {{ b.totalPrice | currency }}</div>
            <span class="badge" [class.bg-success]="b.isPaid" [class.bg-secondary]="!b.isPaid">
              {{ b.isPaid ? 'Paid' : 'Draft' }}
            </span>
          </div>
          <div class="card-footer d-flex gap-2">
            <a [routerLink]="['/builds', b._id]" class="btn btn-sm btn-outline-primary">Open</a>
            <button class="btn btn-sm btn-outline-danger ms-auto" (click)="remove(b._id!)">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class BuildsListComponent implements OnInit {
  builds: Build[] = [];
  constructor(private svc: BuildsService, private router: Router) {}
  ngOnInit() { this.refresh(); }
  refresh() { this.svc.listMine().subscribe(b => this.builds = b); }
  makeBuild() {
    this.svc.create().subscribe(b => this.router.navigate(['/builds', b._id]));
  }
  remove(id: string) {
    if (!confirm('Delete this build?')) return;
    this.svc.delete(id).subscribe(() => this.refresh());
  }
}

/**
 * THE APP-ROOT COMPONENT MUST COME BEFORE ANY OTHER COMPONENT/SERVICE/DIRECTIVE/ETC
 */

import { Component, ChangeDetectionStrategy, Injectable, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';

/**
 * MAIN APPLICATION COMPONENT
 * This MUST be the first class defined in the file for the environment to bootstrap it correctly.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kennedy-wrapper">
      <nav class="google-bar">
        <div class="logo-container">
          <span class="logo-text">Angular <strong>Enterprise</strong> 2025</span>
          <span class="archive-badge">ARCHIVE</span>
        </div>
        <div class="user-controls">
          <div class="circle-avatar">A</div>
        </div>
      </nav>

      <div class="sub-nav">
        <button 
          *ngFor="let cat of categories" 
          [class.active]="activeCategory === cat"
          (click)="selectCategory(cat)"
          class="nav-link"
        >
          {{ cat }}
        </button>
      </div>

      <main class="content-area">
        <div class="sidebar">
          <div class="sidebar-item" [class.active]="activeCategory === 'All'">Schedule</div>
          <div class="sidebar-item">Speakers</div>
          <div class="sidebar-item">Venue Info</div>
          <div class="sidebar-item">Partners</div>
          <hr class="kennedy-divider" />
          <div class="legal-links">
            <p>© 2025 Google Enterprise</p>
            <p>Privacy & Terms</p>
          </div>
        </div>

        <div class="main-stage">
          <h1 class="page-title">Session Schedule — May 2025</h1>
          <div class="card-container">
            <div *ngFor="let session of (filteredSessions$ | async)" class="k-card">
              <div class="card-header">
                <span class="session-time">{{ session.time }}</span>
                <span class="session-category">{{ session.category }}</span>
              </div>
              <h2 class="session-title">{{ session.title }}</h2>
              <p class="session-meta">
                <strong>{{ session.speaker }}</strong> • {{ session.room }}
              </p>
              <div class="k-action-row">
                <button class="k-button k-button-primary">Watch Replay</button>
                <button class="k-button k-button-standard">Slides</button>
              </div>
            </div>
            <div class="info-box" *ngIf="(filteredSessions$ | async)?.length === 0">
              No sessions found for this category.
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      --k-blue: #4d90fe;
      --k-border: #dcdcdc;
      --k-text: #222;
      --k-text-secondary: #666;
      --k-red: #dd4b39;
      display: block;
      height: 100vh;
      font-family: Arial, sans-serif;
    }
    .kennedy-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
    }
    .google-bar {
      height: 44px;
      background: #2d2d2d;
      color: #ccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
    }
    .logo-text { color: #fff; font-size: 18px; }
    .archive-badge {
      background: #f1f1f1;
      color: #333;
      font-size: 10px;
      font-weight: bold;
      padding: 2px 4px;
      border-radius: 2px;
      margin-left: 10px;
    }
    .circle-avatar {
      width: 30px; height: 30px;
      background: #bb724b;
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .sub-nav {
      background: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;
      padding: 0 40px;
      display: flex;
    }
    .nav-link {
      border: none; background: transparent;
      padding: 15px 20px; color: #666;
      cursor: pointer; font-size: 13px;
      border-bottom: 3px solid transparent;
      outline: none;
    }
    .nav-link.active {
      color: #dd4b39;
      border-bottom: 3px solid #dd4b39;
      font-weight: bold;
    }
    .content-area { display: flex; flex: 1; overflow: hidden; }
    .sidebar { width: 160px; padding: 20px 0; border-right: 1px solid #ebebeb; }
    .sidebar-item { padding: 6px 25px; font-size: 13px; color: #333; cursor: pointer; }
    .sidebar-item.active {
      background: #eee; color: #dd4b39; font-weight: bold;
      border-left: 3px solid #dd4b39; padding-left: 22px;
    }
    .main-stage { flex: 1; padding: 20px 40px; overflow-y: auto; }
    .page-title { font-size: 20px; font-weight: normal; margin-bottom: 25px; }
    .k-card { border: 1px solid var(--k-border); padding: 15px; margin-bottom: 15px; }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .session-time { color: var(--k-blue); font-weight: bold; font-size: 12px; }
    .session-category { font-size: 11px; text-transform: uppercase; color: #999; }
    .session-title { font-size: 16px; margin: 0 0 8px 0; color: #1155cc; cursor: pointer; }
    .session-meta { font-size: 13px; color: var(--k-text-secondary); margin-bottom: 15px; }
    .k-action-row { display: flex; gap: 10px; }
    .k-button { border-radius: 2px; font-size: 11px; font-weight: bold; padding: 0 12px; height: 29px; cursor: pointer; }
    .k-button-primary {
      background-color: #4d90fe;
      background-image: linear-gradient(to bottom, #4d90fe, #4787ed);
      border: 1px solid #3079ed; color: #fff;
    }
    .k-button-standard {
      background-color: #f5f5f5;
      background-image: linear-gradient(to bottom, #f5f5f5, #f1f1f1);
      border: 1px solid #dcdcdc; color: #333;
    }
    .kennedy-divider { border: 0; border-top: 1px solid #ebebeb; margin: 15px 0; }
    .legal-links { padding: 0 25px; font-size: 11px; color: #999; }
    .info-box { padding: 20px; background: #f9edbe; border: 1px solid #f0c36d; font-size: 13px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit, OnDestroy {
  private conferenceService = inject(ConferenceService);
  
  categories = ['All', 'Core', 'Architecture', 'Legacy', 'Performance'];
  activeCategory = 'All';
  filteredSessions$!: Observable<Session[]>;
  private sub = new Subscription();

  ngOnInit() {
    this.updateFilter();
  }

  selectCategory(cat: string) {
    this.activeCategory = cat;
    this.updateFilter();
  }

  private updateFilter() {
    this.filteredSessions$ = this.conferenceService.filterSessions(this.activeCategory);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

/**
 * MOCK SERVICE
 */
@Injectable({ providedIn: 'root' })
export class ConferenceService {
  private sessions$ = new BehaviorSubject<Session[]>([
    { id: 1, title: 'Optimizing Zone.js for Large Enterprise Apps', speaker: 'Sarah Drasner', room: 'Ballroom A', time: '09:00 AM', category: 'Performance' },
    { id: 2, title: 'The Case Against Signals: Staying with RxJS', speaker: 'Ben Lesh', room: 'Room 204', time: '10:30 AM', category: 'Core' },
    { id: 3, title: 'Monorepo Strategies for 2025', speaker: 'Victor Savkin', room: 'Room 101', time: '11:45 AM', category: 'Architecture' },
    { id: 4, title: 'Legacy Kennedy UI: A Retrospective', speaker: 'Matias Niemelä', room: 'Design Lab', time: '02:00 PM', category: 'Legacy' },
    { id: 5, title: 'Deep Dive into Dependency Injection', speaker: 'Ward Bell', room: 'Ballroom B', time: '03:30 PM', category: 'Core' },
  ]);

  getSessions(): Observable<Session[]> {
    return this.sessions$.asObservable();
  }

  filterSessions(category: string): Observable<Session[]> {
    if (!category || category === 'All') return this.getSessions();
    return this.sessions$.pipe(
      map(sessions => sessions.filter(s => s.category === category))
    );
  }
}

/**
 * DATA MODELS
 */
interface Session {
  id: number;
  title: string;
  speaker: string;
  room: string;
  time: string;
  category: 'Core' | 'Architecture' | 'Legacy' | 'Performance';
}

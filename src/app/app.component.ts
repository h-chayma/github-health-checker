import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GithubService } from './services/github.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'githubHealthChecker';
  owner: string = 'academico-sis';
  repo: string = 'academico';
  repository: any;
  pullRequests: any[] = [];
  commitActivity: any[] = [];
  daysSinceLastCommit: number = 0;
  contributorsCount: number = 0;
  loading: boolean = false;

  constructor(private githubService: GithubService, private notificationService: NotificationService) { }

  checkRepoHealth() {
    this.loading = true;
    forkJoin({
      repositoryData: this.githubService.getRepositoryData(this.owner, this.repo),
      commitActivity: this.githubService.getCommitActivity(this.owner, this.repo),
      contributors: this.githubService.getContributors(this.owner, this.repo),
      pullRequests: this.githubService.getPullRequests(this.owner, this.repo)
    }).subscribe({
      next: ({ repositoryData, commitActivity, contributors, pullRequests }) => {
        this.repository = repositoryData;
        const lastPush = new Date(repositoryData.pushed_at);
        const currentDate = new Date();
        this.daysSinceLastCommit = Math.floor((currentDate.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24));
        this.commitActivity = commitActivity;
        this.contributorsCount = contributors.length;
        this.pullRequests = pullRequests;
      },
      error: (error) => {
        this.notificationService.showError('Error fetching repository data. Please try again later.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

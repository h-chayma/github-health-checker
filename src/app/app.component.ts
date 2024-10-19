import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GithubService } from './services/github.service';

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
  errorMessage: string | null = null;

  constructor(private githubService: GithubService) { }

  checkRepoHealth() {
    this.errorMessage = null;
    if (!this.owner || !this.repo) {
      this.errorMessage = 'Please enter both repository owner and name.';
      return;
    }
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
        this.loading = false;
        if (error.status === 404) {
          this.errorMessage = 'Repository not found. Please check the owner and repository name.';
        } else if (error.status === 403) {
          this.errorMessage = 'API rate limit exceeded. Please try again later.';
        } else {
          this.errorMessage = 'An error occurred while fetching data. Please try again later.';
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

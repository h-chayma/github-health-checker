import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/repos/';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json'
    });
  }

  getRepositoryData(owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}${owner}/${repo}`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  getCommitActivity(owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}${owner}/${repo}/commits`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  getPullRequests(owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}${owner}/${repo}/pulls`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  getContributors(owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}${owner}/${repo}/contributors`;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }
}

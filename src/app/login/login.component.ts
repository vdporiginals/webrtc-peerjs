import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username;
  password;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  login() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    const body = `grant_type=password&username=${this.username}&password=${this.password}`;

    this.http
      .post<any>(`https://api.clouddoctor.com.vn/token`, body, httpOptions)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 400) {
            //   this.toastService.showError('Sai tên tài khoản hoặc mật khẩu!');
          }
          return throwError(err);
        })
      )
      .subscribe((res) => {
        localStorage.setItem('access_token', JSON.stringify(res));
      });
  }
}

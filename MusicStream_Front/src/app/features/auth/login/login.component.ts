import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as AuthActions from "../../store/auth/auth.action"
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AuthState} from "../../store/auth/auth.reducer";
import {NgClass, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly fb: FormBuilder , private readonly store: Store<{ auth: AuthState }>) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  ngOnInit(): void {
    this.subscription.add(
      this.store.select(state => state.auth).subscribe(authState => {
        this.loading = authState.loading;
        this.error = authState.error;
      })
    )
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ username, password }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

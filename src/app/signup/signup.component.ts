import { CommonModule } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonToolbar, IonCardTitle, IonCardHeader, IonCardContent, IonContent, IonItem, IonLabel, IonButton } from "@ionic/angular/standalone";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, CommonModule, FormsModule]
})
export class SignupComponent  implements OnInit {

  phoneNumber = '';
  otp = '';
  confirmationResult: ConfirmationResult | null = null;
  message = '';
  recaptchaVerifier: RecaptchaVerifier | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    const auth = getAuth();
    // Render invisible reCAPTCHA on page load (required by Firebase)
    // this.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    //   size: 'invisible',
    //   callback: () => {
    //     // reCAPTCHA solved
    //   }
    // }, auth);
  }

  sendOTP() {
    this.message = '';
    const auth = getAuth();
    signInWithPhoneNumber(auth, this.phoneNumber)
      .then((confirmationResult) => {
        this.ngZone.run(() => {
          this.confirmationResult = confirmationResult;
          this.message = 'OTP sent! Please check your phone.';
        });
      })
      .catch(error => {
        this.ngZone.run(() => {
          this.message = 'Failed to send OTP: ' + error.message;
        });
      });
  }

  verifyOTP() {
    if (!this.confirmationResult) return;
    this.confirmationResult.confirm(this.otp)
      .then(result => {
        this.ngZone.run(() => {
          this.message = 'Phone number verified! User UID: ' + result.user.uid;
          // Proceed with signup or navigation
        });
      })
      .catch(error => {
        this.ngZone.run(() => {
          this.message = 'Invalid OTP. Try again.';
        });
      });
  }
}

import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private firebaseX: FirebaseX
  ) {
    this.platform.ready().then(() => {
      this.firebaseX.getToken().then(token => {
        console.log("FCM Token:", token);
      });

      this.firebaseX.onMessageReceived().subscribe(data => {
        console.log("Push received:", data);
      });
    });
  }
}

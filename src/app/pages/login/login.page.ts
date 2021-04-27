import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ServicesService } from '../../service/services.service';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: any;
  password: any;
  constructor(
    public server: ServicesService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public nav: NavController
  ) { }

  ngOnInit() {
    if (localStorage.getItem("bearer_Token") && localStorage.getItem("bearer_Token") != 'undefined') {
      this.nav.navigateRoot('/home');      
    }
  }

  async login(data)
  {
    const loading = await this.loadingController.create({});
    await loading.present();
    // Formateamos la URL
    let body = "email="+data.email+"&password="+data.password;
    // Enviamos al Servidor
    this.server.login(body).subscribe((data:any) => {
      loading.dismiss();
      // Controlamos la respuesta
      if (data.response == true) {
          localStorage.setItem('bearer_Token',JSON.stringify(data.data.jwt));
          this.presentToast("Bienvenido(a) de nuevo.",'success');
          this.nav.navigateRoot('/home');
        }else {
          this.presentToast(data.message,'danger');
        }
    },(error:any) => {
      this.presentToast(error,"danger");
    });
  }

  async presentToast(txt,color) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:color
    });
    toast.present();
  }
}

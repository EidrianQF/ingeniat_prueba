import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ServicesService } from '../../service/services.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    public server: ServicesService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public nav: NavController
  ) { }

  ngOnInit() {
  }
  
  async signup(data)
  {
    const loading = await this.loadingController.create({});
    await loading.present();
    // Formateamos los datos
    let body = "firstname="+data.firstname+"&lastname="+data.lastname+"&birthdate="+data.birthdate+"&email="+data.email+"&password="+data.password;
    // Enviamos al servidor
    this.server.signup(body).subscribe((data:any) => {
      loading.dismiss();
      // Controlamos la respuesta
      if (data.response == true) {
          this.presentToast("Cuenta creada con éxito, por favor inicia sesión",'success');
          this.nav.navigateRoot('/login');
        }else {
          this.presentToast(data.message,'danger');
        }
    },(error: any) => {
      this.presentToast(error,'danger');
    });
  }

  
  async presentToast(txt, color) {
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

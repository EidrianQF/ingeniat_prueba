import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { ServicesService } from '../../service/services.service';
import { SearchPage } from './search/search.page';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  searchQuery: any;
  data: any;
  viewItems: any = [];
  hasSearch: any;
  marcas: any;
  
  let_end: boolean = false;
  let_init = 0;
  Tot_items = 0;
  fakeData = [1,2,3,4,5,6,7];
  pageView: any = 1;
  viewScrollBtn: boolean = false;
  constructor(
    public server: ServicesService,
    public nav: NavController,
    public toastController: ToastController,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    if (!localStorage.getItem("bearer_Token") || localStorage.getItem("bearer_Token") == 'undefined') {
      this.presentToast("Aún no has iniciado sesión",'danger');
      this.nav.navigateRoot('/login');      
    }else {
      this.loadData(localStorage.getItem("bearer_Token"));
    }
  }

  async loadData(jwt)
  {
    const loading = await this.loadingController.create({});
    await loading.present();

    this.server.list(jwt).subscribe((data:any) => {
      loading.dismiss();
      if (data.response == true) {
        this.data = data.data.resultados;
        this.marcas = data.data.marcas;   
        this.Tot_items = this.data.length;

        for (let r = 0; r < 5; r++) {
          const element = data.data.resultados[r];
          this.viewItems.push(element);
        }
      }else {
        this.presentToast(data.message,'danger');
      }
     
    });
  }

  loadMoreData(event)
  {
    setTimeout(() => {
      if (this.viewItems.length >= this.Tot_items) {
        // event.target.disabled = true;
        // this.let_end = true;
        this.pageView += 1;
        this.server.ViewMoreoptions(this.pageView,localStorage.getItem("bearer_Token"))
        .subscribe((data:any) => {
          this.let_init = 0;
          this.Tot_items = this.Tot_items + data.data.resultados.length;
          this.data = data.data.resultados;
          for (let r = 0; r < 5; r++) {
            const element = data.data.resultados[r];
            this.viewItems.push(element);
          }
          event.target.complete();
        });
        
      }else {
        this.let_init += 5;
        let end = this.let_init + 5;
        for (let r = this.let_init; r < end; r++) {
          const element = this.data[r];
          this.viewItems.push(element);
        }

        if (this.viewItems.length >= 50) {
          this.viewScrollBtn = true;
        }
        event.target.complete();
      }
      
    }, 500);
  }

  doRefresh(event) {

    setTimeout(() => {
      this.loadData(localStorage.getItem("bearer_Token"));
      event.target.complete();
    }, 2000);
  }

  async ViewSearch()
  {
    const modal = await this.modalController.create({
      component: SearchPage,
      animated:true,
      mode:'ios',
      cssClass: "search-modal-css",
      backdropDismiss:true,
      swipeToClose: true,
      componentProps: {
        marcas: JSON.stringify(this.marcas)
      }
    });

    modal.onDidDismiss().then(data=>{
      if (data.data && data.data.role == "ViewMarca") {
        this.ViewSearchItem(data);
      }
    });

    return await modal.present();
  }

  async ViewSearchItem(data)
  {
    const loading = await this.loadingController.create({});
    await loading.present();

    this.server.getListSearch(data.data.id,localStorage.getItem("bearer_Token")).subscribe((req:any) => {
      loading.dismiss();
      this.hasSearch   = true;
      this.searchQuery = data.data.data.nombre;
      this.data        = req.data.resultados;
    });
  }

  scrollUp()
  {
    this.viewScrollBtn = false;
    this.getContent().scrollToTop(300);
  }

  getContent() {
    return document.querySelector('ion-content');
  }

  closeSearch() {
    this.hasSearch   = false;
    this.searchQuery = '';
    this.loadData(localStorage.getItem("bearer_Token"));
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Cerrar Sesión',
        role: 'destructive',
        icon: 'lock-closed-sharp',
        handler: () => {
          localStorage.removeItem("bearer_Token");
          this.nav.navigateRoot('/login');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
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

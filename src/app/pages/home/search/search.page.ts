import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @Input() marcas: string;

  data: any;
  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.data = JSON.parse(this.marcas);
  }

  viewitem(item)
  {
    this.modalController.dismiss({
      data: item,
      role:"ViewMarca",
      id:item.idMarca
    })
  }

}

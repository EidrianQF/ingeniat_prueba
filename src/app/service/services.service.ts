import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  url = "https://apidevedm.ingeniat.com/proyectoCandidatos/";
  jwt: any = localStorage.getItem('bearer_Token') ? JSON.parse(localStorage.getItem('bearer_Token')) : '';
  
  constructor(
    private http: HttpClient
  ) { }

  headers = {
    headers: new HttpHeaders({
      "Authentication": "application/json",
      "Content-Type" : "application/json"
    })
  }

  login(data)
  {
    // Enviamos peticion y mapeamos la respuesta
    return this.http.post(this.url+"login?"+data,this.headers)
             .pipe(map(results => results));
  }

  signup(data)
  {
    // Enviamos peticion y mapeamos la respuesta
    return this.http.post(this.url+'registro?'+data,this.headers)
            .pipe(map(results => results));
  }

  list(jwt) 
  {
    let headers = {
      headers: new HttpHeaders({
        "Authentication": "application/json",
        "Content-Type" : "application/json",
        "Authorization" : 'Bearer '+ JSON.parse(jwt)
      })
    }
    // Enviamos peticion y mapeamos la respuesta
    return this.http.get(this.url+'lista',headers)
    .pipe(map(results => results));
  }

  getListSearch(marca,jwt)
  {
    let headers = {
      headers: new HttpHeaders({
        "Authentication": "application/json",
        "Content-Type" : "application/json",
        "Authorization" : 'Bearer '+ JSON.parse(jwt)
      })
    }
    // Enviamos peticion y mapeamos la respuesta
    return this.http.get(this.url+'lista?idMarca='+marca,headers)
    .pipe(map(results => results));
  }
  
  ViewMoreoptions(page,jwt)
  {
    let headers = {
      headers: new HttpHeaders({
        "Authentication": "application/json",
        "Content-Type" : "application/json",
        "Authorization" : 'Bearer '+ JSON.parse(jwt)
      })
    }
    // Enviamos peticion y mapeamos la respuesta
    return this.http.get(this.url+'lista?page='+page,headers)
    .pipe(map(results => results));
  }

}

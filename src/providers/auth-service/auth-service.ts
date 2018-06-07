import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

//import del pacchetto storage per salvare e caricare le password degli utenti
import { Storage } from '@ionic/storage';

//import del pacchetto md5 per HASH della password
import * as md5 from 'md5';
import 'rxjs/add/operator/map';

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {
  constructor(private storage: Storage){}
  currentUser: User;


//metodo per il login che ricava la password dalla mail inserita, se esiste e la confronta con la password inserita al login
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        //controllo password 
        this.storage.get(credentials.email).then(password => {
          
          if(password == md5(credentials.password)){
            observer.next(true);
            
          
        } else{
            observer.next(false);
            
        }
        observer.complete();
          });
        
      });
    }
  }

//metodo che salva email e password inseriti nella fase di registrazione
  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      
      return Observable.create(observer => {

        //controllo che la mail inserita per la registrazione non sia già presente
        if(this.storage.get(credentials.email).then(pass => pass != undefined)){

        //salvataggio della password e mail inserita e HASH della password prima dell'inserimento
        this.storage.set(credentials.email, md5(credentials.password));
        observer.next(true);
        }else{
          observer.next(false);
        }
        observer.complete();
      });
    } 
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
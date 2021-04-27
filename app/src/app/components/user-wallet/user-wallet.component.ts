import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, map,find } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-wallet',
  templateUrl: './user-wallet.component.html',
  styleUrls: ['./user-wallet.component.scss']
})
export class UserWalletComponent implements OnInit {

  userEmail:string=""
  myWallet:any=[]
  

  

  constructor(private apiService: ApiService, public auth: AuthService) {
    this.auth.user$.subscribe((data:any) =>{
      this.userEmail= data.email
      console.log("userData:", this.userEmail); 
      
    });
   }

  ngOnInit(): void {

    /**
     * SACAMOS DE LA DB EL USER QUE ESTÁ VIENDO SU PERFIL
     * MAP DEL ARRAY DEL OBJETO, Y FILTRAMOS POR LA CONDICIÓN, EN ESTE CASO SERÁ SOLD:FALSE PARA OBTENER LAS OPERACIONES QUE SIGUEN SIN VENDERSE.
     * FOREACH - FINALMENTE CON LA DATA OBTENIDA SACAMOS EN UNA VARIABLE EL NOMBRE DE LA COIN Y LA USAMOS PARA PASARLA COMO PARÁMETRO PARA EL APISERVICE
     * NOS SUBSCRIBIMOS Y EN UNA VARIABLE GUARDAMOS EL PRICING ACTUAL.
     * GUARDAMOS EN LA VARIABLE MEDIANTE PUSH EL OBJETO.
     */
   
   this.apiService.getWalletByUser(this.userEmail)
   .subscribe((data:any)=>{
     data.wallets.map((values:any)=>{
      let data = values.coins.filter((dataWallet:any)=> !dataWallet.sold)  
      data.forEach((dataUser:any)=>{
        let coinName = dataUser.coin
        let purchase_price= dataUser.purchase_price
        let id = dataUser._id
        console.log(coinName);
        this.apiService.getPriceCoin(coinName).subscribe((p:any)=>{
          let pricing = p[coinName].usd

          this.myWallet.push( {market_price: pricing , coinName, purchase_price, id  }); 
          console.log("myWalletobs",this.myWallet);   
       });
        
      })
      
     })
     
   })
   /*  .pipe(
      map((values:any) => {
        return values.wallets.filter((dataWallet:any) => !dataWallet.coins.sold)})
      ).subscribe((data:any)=>{ 
        data.forEach( (dataUser:any) =>{ 
          let coinName = dataUser.coin
          let purchase_price = dataUser.purchase_price

          this.apiService.getPriceCoin(coinName).subscribe((p:any)=>{
            let pricing = p[coinName].usd

            this.myWallet.push( {data: pricing , coinName, purchase_price  }); 
            console.log("myWalletobs",this.myWallet);   
         });
     });    
   }); */


  }




}

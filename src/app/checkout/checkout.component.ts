import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { CheckoutService } from './checkout.service';

@Component({
    selector: 'checkout',
    providers: [CheckoutService],
    styleUrls: ['checkout.component.css'],
    templateUrl: 'checkout.component.html'
})
export class CheckoutComponent implements OnInit {
    _cartContent: any;
    _userInfo: any;
    _loginStatus: boolean = false;
    _cartSum: number = 0;
    _cartTotal: string;

    constructor(
        private checkoutService: CheckoutService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.getCartInfo()
    }

    getCartInfo() {
        this.checkoutService.getCartById()
            .subscribe(response => {
                this._userInfo = response.userInfo;
                if (!this._userInfo) this.router.navigate(['']);
                this._cartContent = response.data;
                if (!this._cartContent || !this._cartContent.length) this.router.navigate(['user/cart'])
                for (var prop in this._cartContent) {
                    this._cartSum += parseFloat(this._cartContent[prop].price) * parseFloat(this._cartContent[prop].product_quantity);
                }
                this._cartTotal = this._cartSum.toFixed(2);
            },
            error => {
                if (error) this.router.navigate(['user/cart']);
            });
    }

    checkoutConfirm(value: any) {
        if (this._userInfo && value.fullname && value.address && value.city && value.state && value.zip) {
            this.checkoutService.sendCheckout(value)
                .subscribe(response => {
                    if (response) this.router.navigate(['user/orders']);
                },
                error => {
                    if (error) this.router.navigate(['user/cart']);
                });
        }
    }
}
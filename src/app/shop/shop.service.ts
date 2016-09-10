import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class ShopService {
    private _brand: string = '';
    private _os: string = '';
    private _ram: string = '';
    private _processor: string = '';
    private _storage: string = '';

    private _brandName: string[] = ['Asus', 'Acer', 'Apple', 'HP', 'Microsoft', 'Lenovo', 'Dell', 'Samsung'];
    private _osName: string[] = ['Mac OS X', 'Windows 10', 'Chrome OS', 'Windows 8.1', 'Windows 7 Home'];
    private _processorName: string[] = ['Intel Core i7', 'Intel Core i5', 'Intel Core i3', 'Intel Core 2', 'AMD'];
    private _storageName: string[] = ['SSD', 'Hard Disk'];

    private queryCollector = [];
    private osCollector = [];
    private ramCollector = [];
    private processorCollector = [];
    private storageCollector = [];

    constructor(
        private http: Http
    ) { }

    getAllProducts(page: number, _queryParam: string) {
        // For insert/remove on checkbox
        function _without(value) {
            return value != _queryParam;
        }

        if (this._brandName.indexOf(_queryParam) >= 0){
            if (this.queryCollector.length >= 1 && this.queryCollector.indexOf(_queryParam) !== -1) {
                this.queryCollector = this.queryCollector.filter(_without);
            }
            else if (_queryParam !== '') this.queryCollector.push(_queryParam);
        }
        else if (this._osName.indexOf(_queryParam) >= 0){
            if (this.osCollector.length >= 1 && this.osCollector.indexOf(_queryParam) !== -1) {
                this.osCollector = this.osCollector.filter(_without);
            }
            else if (_queryParam !== '') this.osCollector.push(_queryParam);
        }
        else if(parseInt(_queryParam)) {
            if (this.ramCollector.length >= 1 && this.ramCollector.indexOf(_queryParam) !== -1) {
                this.ramCollector = this.ramCollector.filter(_without);
            }
            else if (_queryParam !== '') this.ramCollector.push(_queryParam);
        }
        else if(this._processorName.indexOf(_queryParam) >=0){
            if (this.processorCollector.length >= 1 && this.processorCollector.indexOf(_queryParam) !== -1) {
                this.processorCollector = this.processorCollector.filter(_without);
            }
            else if (_queryParam !== '') this.processorCollector.push(_queryParam);
        }
        else if (this._storageName.indexOf(_queryParam) >=0) {
            if (this.storageCollector.length >= 1 && this.storageCollector.indexOf(_queryParam) !== -1) {
                this.storageCollector = this.storageCollector.filter(_without);
            }
            else if (_queryParam !== '') this.storageCollector.push(_queryParam);
        }

        this._brand = this.queryCollector.join(',');
        this._os = this.osCollector.join(',');
        this._ram = this.ramCollector.join(',');
        this._processor = this.processorCollector.join(',');
        this._storage = this.storageCollector.join(',');

        let productUrl = `/api/shop/${page}?brand=${this._brand}&os=${this._os}&ram=${this._ram}&processor=${this._processor}&storage=${this._storage}`;  //api url

        return this.http.get(productUrl)
            .map((res: any) => res.json());
    }
}


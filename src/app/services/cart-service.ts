import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { DataObservableService } from '../services/data-observable.service';
// import { Config } from '../services/config.static';
import { ConfigService } from '../services/config.service';

declare var jQuery: any;
declare var $: any;


@Injectable()
export class CartService {

    public config: any;
    private cartItemsObserver: any;
    // cartItems$: Observable<any>;
    public cartName = 'AffiliateMarketingCart';
    public clearCart = false;
    public items = [];

    sku: string;
    productname: string;
    unitprice: any;
    saleprice: any;
    showsale: Boolean;
    quantity: any;
    sh: any;
    faux: Boolean;

    serviceName: any;
    merchantID: any;
    options: any;

    constructor(private configService: ConfigService,
                private dataObservableService: DataObservableService) {

        // this.cartItems$ = new Observable(observer => {
        //     this.cartItemsObserver = observer;
        // }).share();

        this.loadItems();

        this.config = this.configService.config();
        // this.products = this.configService.getProducts();
        // alert('Configurations: '+ JSON.stringify(this.products));

    }

    // load items from local storage
    loadItems() {

        let items = localStorage != null ? localStorage[this.cartName + '_items'] : null;
        if (items != null && JSON != null) {
            try {
                items = JSON.parse(items);
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    if (item.sku != null && item.productname != null &&
                        item.unitprice != null && item.saleprice != null &&
                        item.showsale != null && item.quantity != null && item.sh != null &&
                        item.faux != null) {
                        item = new this.cartItem(item.sku, item.productname, item.unitprice,
                            item.saleprice, item.showsale, item.quantity, item.sh, item.faux);
                        this.items.push(item);
                    }
                }
            } catch (err) {
                // ignore errors while loading...
            }
        }
        return items;
    }

    // save items to local storage
    saveItems() {
        if (localStorage != null && JSON != null) {
            localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
        }
    }

    // adds an item to the cart
    addItem(sku, productname, unitprice,
        saleprice, showsale, quantity, sh, faux) {
        const _return = true;
        if (!faux) {
            let found = false;
            for (let i = 0; i < this.items.length && !found; i++) {
                const item = this.items[i];
                if (item.sku === sku) {
                    found = true;
                    item.quantity = this.toNumber(item.quantity + quantity);
                    if (item.quantity <= 0) {
                        this.items.splice(i, 1);
                    }
                }
            }
            // if item wasn't already in cart, add it now
            if (!found) {
                const item = new this.cartItem(sku, productname, unitprice, saleprice, showsale, quantity, sh, faux);
                this.items.push(item);
            }
            // save changes
            this.saveItems();
        } else {
            alert('This product is shown for demonstration purposes only!');
        }
        return _return;
    }

    // adds an item to the cart from non-angular page using url parameters
    addItemUrl(sku, productname, unitprice, saleprice,
        showsale, quantity, sh, faux) {
        this.addItem(sku, productname, unitprice, saleprice,
        showsale, quantity, sh, faux);
    }

    // get the total price for all items currently in the cart
    getTotalPrice(sku) {
        let total: any;
        total = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (sku === null || item.sku === sku) {
                if (item.showsale) {
                    total += this.toNumber(item.quantity * item.saleprice);
                } else {
                    total += this.toNumber(item.quantity * item.unitprice);
                }
            }
        }
        return total;
    }

    // get the total shipping & handling for all items currently in the cart
    // You can customize this any way you want.
    // Here I decided to charge whatever the max sh is for the items in the cart
    getTotalSH(sku) {
        const myArray = [];
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            // alert(this.toNumber(item.sh));
            if (sku === null || item.sku === sku) {
                // alert(this.toNumber(item.sh));
                myArray.push(this.toNumber(item.sh));
            }
        }
        if (myArray.length < 1) {
            return undefined;
        } else {
            return Math.max.apply(Math, myArray);
        }
    }

    // get the total price for all items currently in the cart
    getTotalCount(sku) {
        let count: any;
        count = 0;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (sku === null || item.sku === sku) {
                count += this.toNumber(item.quantity);
            }
        }
        return count;
    }

    // clear the cart
    clearItems() {
        this.items = [];
        this.saveItems();
    }

    createGuid4(): string {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function(c: string) {
            const r = Math.floor(Math.random() * 16),
                v = c === 'x' ? r : (r % 4 + 4);
            return v.toString(16);
        }).toUpperCase();
    }

    // check out using PayPal for details see:
    // www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
    // See: https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlletiables/
    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the
    // shopping cart with PayPal, you have to create a merchant account with
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    // myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");
    // this.addCheckoutParameters('PayPal', this.PAYMENT_PAYPAL_BUYNOW, {});
    checkoutPayPal() {

        if (this.config.PAYPAL_BUYNOW_EMAIL_OR_ID === 'PAYPAL_BUYNOW_EMAIL_OR_ID') {
            alert('You must first enter your PayPal Email Addres ' +
                  'or PayPal Company ID in config.json. Cancelling Checkout...');
            return;
        }

        let bFoundFaux = false;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.faux) {
                bFoundFaux = true;
                this.items.splice(i, 1);
            }
        }
        if (this.items.length < 1) {
            alert('Faux items in your cart are not for sale and were removed!');
            this.clearCart = this.clearCart === null || this.clearCart;
            return;
        }

        if (bFoundFaux) {
            alert('Faux items in your cart are not for sale and were removed!');
        }

        const myArray = [];
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            myArray.push(this.toNumber(item.sh));
        }
        let totalSH = 0;
        if (myArray.length > 0) {
            totalSH = Math.max.apply(Math, myArray);
        }

        // The cost of shipping this item. If you specify shipping and shipping2 is not defined,
        // this flat amount is charged regardless of the quantity of items purchased.
        // This shipping letiable is valid only for Buy Now and Add to Cart buttons.
        // Default — If profile-based shipping rates are configured, buyers are charged an amount
        // according to the shipping methods they choose.

        // global data  _xclick   _cart
        const data = {
            cmd: '_cart',
            business: this.config.PAYPAL_BUYNOW_EMAIL_OR_ID,
            upload: '1',
            rm: '2',
            charset: 'utf-8'
        };

        // item data
        let bShipping = false;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const ctr = i + 1;
            data['item_number_' + ctr] = item.sku;
            const z1 = item.sku;
            const z2 = z1.replace('&#8482;', '™');  // &#8482; //TM
            const z3 = z2.replace('&#8480;', '℠');  // &#8480; //SM
            const z4 = z3.replace('&#174', '®');  // &#174   //Registered
            const z5 = z4.replace('&#169;', '©');  // &#169;  //Copyright
            const z6 = z5.replace('&#8471;', '℗');  // &#8471; //Patent
            data['item_name_' + ctr] = z6;
            data['quantity_' + ctr] = item.quantity;
            data['amount_' + ctr] = item.unitprice.toFixed(2);
            if (totalSH.toFixed(2) === item.sh.toFixed(2)) {
                if (!bShipping) {
                    data['shipping_' + ctr] = totalSH.toFixed(2);
                    bShipping = true;
                }
            }
        }

        // build form
        const form = $('<form/></form>');
        form.attr('action', 'https://www.paypal.com/cgi-bin/webscr');
        form.attr('method', 'POST');
        // form.attr('notify_url', 'http://www.YOUR_DOMAIN.com/ac_notify.html');
        // form.attr('cancel_return', 'http://www.YOUR_DOMAIN.com/ac_cancel.html');
        form.attr('notify_url', 'http://www.sergioapps.com/cart_notify.aspx');
        form.attr('cancel_return', 'http://www.sergioapps.com/cart_cancel.aspx');
        ///////////////////////////////////////////////////////////
        // PayPal's custom html letiable returned to ac_notify.html
        let _did = this.config.DISTRIBUTOR_ID;

        if (localStorage['did']) {
            const t = localStorage['did'];
            if (t !== 'undefined') {
                for (let x = 0; x < this.config.DISTRIBUTORS.length; x++) {
                    if (t === this.config.DISTRIBUTORS[x].did) {
                        _did = _did + '|' + t;
                        break;
                    }
                }
            }
        }

        // form.attr('custom', _did + '|' + _did2);
        form.attr('custom', _did);
        // form.attr('item_number', 'ac_item_number');
        // form.attr('item_number_x', 'ac_item_number_x');
        form.attr('invoice', this.createGuid4());
        ///////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////
        // form.attr("cmd", "cmd");
        // form.attr("business", "business");
        // form.attr("lc", "lc");
        // form.attr("item_name", "item_name");
        // form.attr("item_number", "item_number");
        // form.attr("amount", "amount");
        // form.attr("currency_code", "currency_code");
        // form.attr("button_subtype", "button_subtype");
        // form.attr("no_note", "no_note");
        // form.attr("cn", "cn");
        // form.attr("no_shipping", "no_shipping");
        // form.attr("rm", "rm");
        // form.attr("return", "return_URL");
        // form.attr("cancel_return" + cancel_return_URL");
        // form.attr("shipping", "shipping");
        // form.attr("bn", "bn");
        // form.attr("address_override", "address_override");
        // form.attr("notify_url", "notify_url");
        ////////////////////////////////////////////////////////////////

        // form.attr("image_url" + image_url");
        // form.attr("cpp_cart_border_color", "cpp_cart_border_color");
        // form.attr("cpp_header_image" + cpp_header_image");
        // form.attr("cpp_headerback_color", "cpp_headerback_color");
        // form.attr("cpp_logo_image", "cpp_logo_image");

        // form.attr("invoice", "invoice");
        // form.attr("custom", "custom");
        // form.attr("baseamt", "baseamt");
        // form.attr("quantity", "quantity");
        // form.attr("undefined_quantity", "undefined_quantity");
        // form.attr("tax_rate=0"");
        // form.attr("handling", "handling");
        // form.attr("basedes", "basedes");
        // form.attr("page_style", "page_style");
        // form.attr("cbt", "cbt");

        ////////////////////////////////////////////////////////////////
        // form.attr("address1", "ship_address1"); //100
        // form.attr("address2", "ship_address2"); //100
        // form.attr("city", "ship_city");	 //40
        // form.attr("country", "ship_country");	 //2
        // form.attr("email", "ship_email");	//127
        // form.attr("first_name", "ship_first_name");	//32
        // form.attr("last_name", "ship_last_name");	//64
        // form.attr("lc", "ship_lc");	// The default is US 2
        // form.attr("charset", "ship_charset");	//see Setting the Character Set – charset.
        // form.attr("night_phone_a", "ship_night_phone_a");
        // form.attr("night_phone_b", "ship_night_phone_b");
        // form.attr("state", "ship_state");	//2
        // form.attr("zip", "ship_zip");
        ////////////////////////////////////////////////////////////////

        // form.attr("first_name", "ship_first_name");	//32
        // form.attr("last_name", "ship_last_name");	//64

        const options = [];
        form.attr('style', 'display:none;');
        this.addFormFields(form, data);
        this.addFormFields(form, options);
        $('body').append(form);

        // alert(form.attr('custom'));

        // submit form
        this.clearCart = this.clearCart === null || this.clearCart;
        form.submit();

        // form.attr('action', 'http://www.sergioapps.com/test.html');
        // form.submit();

        form.remove();

    }

    // check out using Google Wallet
    // for details see:
    // developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
    // developers.google.com/checkout/developer/interactive_demo
    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the
    // shopping cart with Google Wallet, you have to create a merchant account with
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    // myCart.addCheckoutParameters("Google", "GooGle_Wallet_ID",
    // this.addCheckoutParameters('Google', this.PAYMENT_GOOGLE_WALLET_ID,
    //     {
    //         ship_method_name_1: 'UPS Next Day Air',
    //         ship_method_price_1: '20.00',
    //         ship_method_currency_1: 'USD',
    //         ship_method_name_2: 'UPS Ground',
    //         ship_method_price_2: '15.00',
    //         ship_method_currency_2: 'USD'
    //     }
    // );
    checkoutGoogle() {

        if (this.config.GOOGLE_WALLET_ID === 'GOOGLE_WALLET_ID') {
            alert('You must first enter your Google Wallet ID ' +
                  'in config.json. Cancelling Checkout...');
            return;
        }

        let options: any;
        options = {
                ship_method_name_1: 'UPS Next Day Air',
                ship_method_price_1: '20.00',
                ship_method_currency_1: 'USD',
                ship_method_name_2: 'UPS Ground',
                ship_method_price_2: '15.00',
                ship_method_currency_2: 'USD'
            };

        let bFoundFaux = false;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.faux) {
                bFoundFaux = true;
                this.items.splice(i, 1);
            }
        }
        if (this.items.length < 1) {
            alert('Faux items in your cart are not for sale and were removed!');
            this.clearCart = this.clearCart === null || this.clearCart;
            return;
        }
        if (bFoundFaux) {
            alert('Faux items in your cart are not for sale and were removed!');
        }

        // global data
        const data = {};

        ///////////////////////////////////////////////////////////
        // PayPal's custom html letiable returned to ac_notify.html
        // let _did = localStorage['ac_distributorid'];
        // if (_did === null || _did === 'undefined') {
        //    _did = "nodid";
        // }
        // data['custom_' + ctr] = _did;
        ///////////////////////////////////////////////////////////

        // item data
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const ctr = i + 1;
            data['item_name_' + ctr] = item.sku;
            data['item_description_' + ctr] = item.productname;
            data['item_price_' + ctr] = item.unitprice.toFixed(2);
            data['item_quantity_' + ctr] = item.quantity;
            data['item_merchant_id_' + ctr] = this.config.PAYMENT_GOOGLE_WALLET_ID;
        }

        // build form
        const form = $('<form/></form>');
        // NOTE: in production projects, use the checkout.google url below;
        // for debugging/testing, use the sandbox.google url instead.
        // form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
        form.attr('action', 'https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/' +
         this.config.PAYMENT_GOOGLE_WALLET_ID);
        form.attr('method', 'POST');
        form.attr('style', 'display:none;');
        this.addFormFields(form, data);
        this.addFormFields(form, options);
        $('body').append(form);

        // submit form
        this.clearCart = this.clearCart == null || this.clearCart;
        form.submit();
        form.remove();
    }

    // check out using Stripe
    // for details see:
    // https://stripe.com/docs/checkout
    // enable Stripe checkout
    // note: the second parameter identifies your publishable key; in order to use the
    // shopping cart with Stripe, you have to create a merchant account with
    // Stripe. You can do that here:
    // https://manage.stripe.com/register
    // myCart.addCheckoutParameters("Stripe", "pk_test_stripe",
    // this.addCheckoutParameters('Stripe', this.PAYMENT_STRIPE,
    //     {
    //         chargeurl: 'https://localhost:1234/processStripe.aspx'
    //     }
    // );
    checkoutStripe() {

        if (this.config.STRIPE_ID === 'STRIPE_ID') {
             alert('You must first enter your Stripe ID ' +
                  'in config.json. Cancelling Checkout...');
            return;
        }

        // myCart.addCheckoutParameters("Stripe", "pk_test_stripe",
        // this.addCheckoutParameters('Stripe', this.PAYMENT_STRIPE,
        const options = { chargeurl: 'https://localhost:1234/processStripe.aspx' };

        let bFoundFaux = false;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.faux) {
                bFoundFaux = true;
                this.items.splice(i, 1);
            }
        }
        if (this.items.length < 1) {
            alert('Faux items in your cart are not for sale and were removed!');
            this.clearCart = this.clearCart === null || this.clearCart;
            return;
        }
        if (bFoundFaux) {
            alert('Faux items in your cart are not for sale and were removed!');
        }

        // global data
        const data = {};

        ///////////////////////////////////////////////////////////
        // PayPal's custom html letiable returned to ac_notify.html
        // let _did = localStorage['ac_distributorid'];
        // if (_did === null || _did === 'undefined') {
        //    _did = 'nodid';
        // }
        // data['custom_' + ctr] = _did;
        ///////////////////////////////////////////////////////////

        // item data
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const ctr = i + 1;
            data['item_name_' + ctr] = item.sku;
            data['item_description_' + ctr] = item.productname;
            data['item_price_' + ctr] = item.unitprice.toFixed(2);
            data['item_quantity_' + ctr] = item.quantity;
        }

        // build form
        const form = $('.form-stripe');
        form.empty();
        // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
        // See https://stripe.com/docs/checkout
        // You'll get a POST to the address below w/ a stripeToken.
        // First, you have to initialize the Stripe API w/ your public/private keys.
        // You then call Customer.create() w/ the stripeToken and your email address.
        // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
        form.attr('action', options['chargeurl']);
        form.attr('method', 'POST');
        form.attr('style', 'display:none;');
        this.addFormFields(form, data);
        this.addFormFields(form, options);
        $('body').append(form);

        // ajaxify form
        form.ajaxForm({
            success: function () {
                $.unblockUI();
                alert('Thanks for your order!');
            },
            error: function (result) {
                $.unblockUI();
                alert('Error submitting order: ' + result.statusText);
            }
        });

        const token = function (res) {
            const $input = $('<input type=hidden name=stripeToken />').val(res.id);

            // show processing message and block UI until form is submitted and returns
            $.blockUI({ message: 'Processing order...' });

            // submit form
            form.append($input).submit();
            this.clearCart = this.clearCart === null || this.clearCart;
            form.submit();
        };

        // WS
        // StripeCheckout.open({
        //     key: parms.merchantID,
        //     address: false,
        //     amount: this.getTotalPrice() * 100, /** expects an integer **/
        //     currency: 'usd',
        //     name: 'Purchase',
        //     description: 'Description',
        //     panelLabel: 'Checkout',
        //     token: token
        // });
    }

    // utility methods
    addFormFields(form, data) {
        if (data != null) {
            $.each(data, function (name, value) {
                if (value != null) {
                    const input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                    form.append(input);
                }
            });
        }
    }
    toNumber(value) {
        const num: any = this.stripNonNumeric(value);
        value = num * 1;
        return isNaN(value) ? 0 : value;
    }

    stripNonNumeric(str) {
        str += '';
        const rgx = /^d|.|-$/;
        let out = '';
        for (let i = 0; i < str.length; i++) {
            if (rgx.test(str.charAt(i))) {
                if (!((str.charAt(i) === '.' && out.indexOf('.') !== -1) ||
                    (str.charAt(i) === '-' && out.length !== 0))) {
                    out += str.charAt(i);
                }
            }
        }
        return out;
    }

// WS
    // ----------------------------------------------------------------
    // checkout parameters (one per supported payment service)
    //
    checkoutParameters(serviceName, merchantID, options) {
        this.serviceName = serviceName;
        this.merchantID = merchantID;
        this.options = options;
        return this;
    }

    // ----------------------------------------------------------------
    // items in the cart
    //
    cartItem(sku, productname, unitprice, saleprice, showsale, quantity, sh, faux) {
        this.sku = sku;
        this.productname = productname;
        this.unitprice = unitprice * 1;
        this.saleprice = saleprice * 1;
        this.showsale = showsale;
        this.quantity = quantity * 1;
        this.sh = sh * 1;
        this.faux = faux;
    }

    buyNow(obj: any) {
        window.open(obj.buynowlink);
    }
}



// export class ShoppingCart {

//     public cartName: any; // = cartName;
//     public clearCart = false;
//     public checkoutParameters = {};
//     public items = [];

//     productid: string;
//     sku: string;
//     productname: string;
//     storeid: string;
//     unitprice: any;
//     saleprice: any;
//     showsale: Boolean;
//     quantity: any;
//     sh: any;
//     notes: string;
//     faux: Boolean;

//     constructor(productid: string,
//                 sku: string,
//                 productname: string,
//                 storeid: string,
//                 unitprice: any,
//                 saleprice: any,
//                 showsale: Boolean,
//                 quantity: any,
//                 sh: any,
//                 notes: string,
//                 faux: Boolean) {

//         this.productid = productid;
//         this.sku = sku;
//         this.productname = productname;
//         this.storeid = storeid;
//         this.unitprice = unitprice;
//         this.saleprice = saleprice;
//         this.showsale = showsale;
//         this.quantity = quantity;
//         this.sh = sh;
//         this.notes = notes;
//         this.faux = faux;
//     }

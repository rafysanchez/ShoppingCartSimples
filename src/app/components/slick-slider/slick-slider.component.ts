import { Component, OnInit, Input, ElementRef, AfterViewInit, AfterContentInit} from '@angular/core';
declare var jQuery: any;

// @Component({
//   selector: 'app-slick-slider',
//   templateUrl: './slick-slider.component.html',
//   styleUrls: ['./slick-slider.component.css']
// })
@Component({
    selector: 'app-slick-slider',
    template: `
        <ng-content></ng-content>
    `
})
export class SlickSliderComponent implements AfterContentInit {
    @Input() options: any;

    $element: any;

    defaultOptions: any = {};

    constructor(private el: ElementRef) {
    }

    ngAfterContentInit() {

        for (const key in this.options) {
            // this.defaultOptions[key] = this.options[key];
            if (this.options.hasOwnProperty(key)) {
                this.defaultOptions[key] = this.options[key];
            }
        }


        // this.$element = jQuery(this.el.nativeElement).slick(this.defaultOptions);
        // this.$element = jQuery(this.el.nativeElement).slick({
        //     slidesToShow: 3,
        //     slidesToScroll: 3,
        //     arrows: true
        // });

        // this.$element = jQuery(this.el.nativeElement).slick(this.defaultOptions);
        this.$element = jQuery(this.el.nativeElement).slick({
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: true,
            // adaptiveHeight: true,
            // autoplay: true,
            // autoplaySpeed: 3000,
            // centerMode: true,
            // centerPadding: '50px',
            // cssEase: 'ease',
            // dots: true,
            // draggable: true,
            // easing: 'linear',
            // fade: true,
            // focusOnSelect: true,
            // infinite: true,
            // initialSlide: 0,
            // lazyLoad: 'ondemand',
            // swipeToSlide: true,
            // infinite: true,
            // pauseOnHover: true,
            // rtl: true,
            // slide: 'div',
            // speed: 300,
            // swipe: 'false',
            // touchMove: 'false',
            // touchThreshold: 5,
            // useCSS: 'false',
            // variableWidth: true,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
    }
}







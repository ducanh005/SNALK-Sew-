(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // Initiate the wowjs
    new WOW().init();
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonial carousel
    $(".testimonial-carousel-1").owlCarousel({
        loop: true,
        dots: false,
        margin: 25,
        autoplay: true,
        slideTransition: 'linear',
        autoplayTimeout: 0,
        autoplaySpeed: 10000,
        autoplayHoverPause: false,
        responsive: {
            0:{
                items:1
            },
            575:{
                items:1
            },
            767:{
                items:2
            },
            991:{
                items:3
            }
        }
    });

    $(".testimonial-carousel-2").owlCarousel({
        loop: true,
        dots: false,
        rtl: true,
        margin: 25,
        autoplay: true,
        slideTransition: 'linear',
        autoplayTimeout: 0,
        autoplaySpeed: 10000,
        autoplayHoverPause: false,
        responsive: {
            0:{
                items:1
            },
            575:{
                items:1
            },
            767:{
                items:2
            },
            991:{
                items:3
            }
        }
    });

})(jQuery);

const form = document.querySelector('form[class="dat-lich"]')
if(form){
    console.log(form)
    const country=form.querySelector('select.country')
    const city=form.querySelector('select.city')
    const area=form.querySelector('select.area')
    const event=form.querySelector('select.event')
    const clients=form.querySelector('select.clients')
    const phone=form.querySelector('input.phone')
    const date=form.querySelector('input.date')
    const email=form.querySelector('input.email')
    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        // console.log(country.value)
        // console.log(city.value)
        // console.log(area.value)
        // console.log(event.value)
        // console.log(clients.value)
        // console.log(phone.value)
        // console.log(email.value)
        // console.log(date.value)
        const alertPlaceholder = document.querySelector('#liveAlertPlaceholder')

        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
              `<div class="alert alert-${type} alert-dismissible" role="alert">`,
              `   <div>${message}</div>`,
              '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
              '</div>'
            ].join('')
          
            alertPlaceholder.append(wrapper)
          }
        if(city.value!='default'&&country.value!='default'&&area.value!='default'&&event.value!='default'&&clients.value!='default'&&date.value!=""&&email!=""&&phone!=""){
            form.submit()
            appendAlert('Đặt lịch thành công', 'success')
            
        }
        else{
            appendAlert('Vui lòng diền đủ thông tin', 'danger')
        }
    })

}


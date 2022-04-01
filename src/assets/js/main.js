$(document).ready(function(){
    /*-----------Bootstrap Sanitizer whitelist for tooltip-------------*/
    var myDefaultWhiteList = $.fn.tooltip.Constructor.DEFAULTS.whiteList
    myDefaultWhiteList.table = []
    myDefaultWhiteList.tbody = []
    myDefaultWhiteList.td = []
    myDefaultWhiteList.tr = []
    /*-----------tooltip active-------------*/
    $("[data-toggle='tooltip']").tooltip();
    /*-----------popover active-------------*/
    $("[data-toggle='popover']").not('.pt-popover').popover({trigger: 'manual'});
    $("[data-toggle='popover']").not('.pt-popover').click(function(){
        $("[data-toggle='popover']").not(this).popover("hide");
        $(this).popover("toggle");
    });
    // pt-popover используется на странице check ip
    $("[data-toggle='popover'].pt-popover").attr('tabindex', '0');
    $("[data-toggle='popover'].pt-popover").popover({trigger: 'focus'});
    /*-----------page-------------*/
    $('.translate-update-language-select').change(function(){
        $val = $(this).val();
        $('.translate-update-block').hide();
        $('.translate-update').hide();
        if ($val)
        {
            $('.translate-update').show();
            $('.translate-update-block.__' + $val).show();
        }
    });
    /*----------------------------*/
    /*-------- user order --------*/
    if (
        $('#user-order-tabs').length &&
        ['#vpn', '#proxy', '#socks', '#abc', '#resident'].indexOf(window.location.hash) !== -1
    ) {
        $('#user-order-tabs a[href="' + window.location.hash + '"]').tab('show');
    }

    if (
        $('#user-order-tabs').length &&
        window.location.hash === '#socks-tab'
    ) {
        $('#user-order-tabs a[href="#socks"]').tab('show');
    }
    /*----------------------------*/
    /*-----------buy--------------*/
    $('.buy-control a').click(function(){
        var days = $(this).data('count');
        $('.buy-control a').removeClass('btn-default-transparent');
        $(this).addClass('btn-default-transparent');
        $('.pricing-tables .plan span').removeClass('__active');
        $('span.__days_' + days).addClass('__active');

        if (days == 3)
            $('.__abc').html('<s>' + $('.__abc').html() + '</s>');
        else
        {
            if ($('.__abc').find('s').length)
                $('.__abc').html($('.__abc').find('s').html());
        }

        var id = $(this).data('id');
        $('#term-id').val(id);
    });
    $('.plan a.btn').click(function(){
        var id = $(this).data('id');
        var auth = $('#auth').val();

        $('#price-id').val(id);

        if (auth == 1)
            $('#email-form').submit();
        else
            $("#myModal").modal('show');

        // send metrics-------
        var GOALS = { 2: 'standardvpn', 3: 'doublevpn', 4: 'perfectvpn', 5: 'litevpn' };
        sendMetrika(GOALS[id] || '');
        // --------------------
    });
    $('#email-form').submit(function(){
        var success = true;
        $('#email-form .form-control').each(function(){
            $(this).parent().removeClass('has-success');
            $(this).parent().removeClass('has-error');
            if ($(this).val())
            {
                $(this).parent().addClass('has-success');
            }
            else
            {
                $(this).parent().addClass('has-error');
                success = false;
            }
        });

        // send metrics-------
        var auth = $('#auth').val();
        if (success && auth == 0)
            sendMetrika($('#socks-tariff-id').length ? 'new-buyanonymousproxy-email' : 'new-buyvpn-email');
        // -------------------

        return success;
    });
    $('#email-form .form-control').blur(function(){
        $(this).parent().removeClass('has-success');
        $(this).parent().removeClass('has-error');
        if ($(this).val())
            $(this).parent().addClass('has-success');
        else
            $(this).parent().addClass('has-error');
    });

    if ($('#vpn-promo-timer').length) {
        var expire = $('#vpn-promo-timer').data('expire');

        (function(){
            function timer() {
                expire -= 1;

                if (expire < 0) {
                    $('#vpn-promo-timer .promo-timer__num').html('00 ' + secondShortText);
                    window.location.reload();
                    return undefined;
                }

                var seconds = Math.floor(expire % 60);
                var minutes = Math.floor((expire / 60) % 60);
                var hours = Math.floor((expire / 60 / 60) % 24);
                var days = Math.floor(expire / 60 / 60 / 24);

                var timerText = '';

                if (days > 0) {
                    timerText += (days < 10 ? '0' + days : days) + ' ' + dayShortText + ' ';
                }

                if (hours > 0 || timerText) {
                    timerText += (hours < 10 ? '0' + hours : hours) + ' ' + hourShortText + ' ';
                }

                if (minutes > 0 || timerText) {
                    timerText += (minutes < 10 ? '0' + minutes : minutes) + ' ' + minuteShortText + ' ';
                }

                timerText += (seconds < 10 ? '0' + seconds : seconds) + ' ' + secondShortText + ' ';

                $('#vpn-promo-timer .promo-timer__num').html(timerText);

                setTimeout(timer, 1000);
            }

            timer();
        })();
    }
    /*----------------------------*/
    /*-----------payment-------------*/
    $('.buy-promo-toggle').click(function(){
        $('.buy-promo-field').toggle(300);
    });
    var find_buy_promocode_timer;
    function find_buy_promocode()
    {
        var promocode = $('#buy-promo').val();
        if (promocode)
        {
            $('#buy-promo').addClass('__load');
            $.post((langUrl || '') + "/payment/ajaxcheckpromocode", {promocode: promocode, type: 'buy_vpn'},
                function (data){
                    $('#buy-promo').removeClass('__load');
                    $('.buy-promo-field').removeClass('has-error has-success');
                    if (data.error)
                    {
                        $('.buy-promo-field').addClass('has-error');
                        $('.buy-promo-field .help-block.__buy').html(data.error);
                    }
                    else
                    {
                        $('.buy-promo-field').addClass('has-success');
                        $('.buy-promo-field .help-block.__buy').html(data.success);
                    }
                    price_term_change();
            }, 'json');
        }
        else
        {
            $('.buy-promo-field').removeClass('has-error has-success');
            $('.buy-promo-field .help-block.__buy').html('');
            price_term_change();
        }
    };
    $('#buy-promo').keyup(function(){
        clearTimeout(find_buy_promocode_timer);
        find_buy_promocode_timer = setTimeout(find_buy_promocode, 1000);
    });
    $('#buy-promo').change(function(){
        clearTimeout(find_buy_promocode_timer);
        find_buy_promocode();
    });

    // check promo in init
    if ($('#buy-promo').length && $('#buy-promo').val()) {
        $('.buy-promo-field').toggle(300);
        clearTimeout(find_buy_promocode_timer);
        find_buy_promocode();
    }

    function getPaymentPartsDesc(provider, amount, currency)
    {
        var text = '';

        if ($('#' + provider + '_limit').length) {
            var limit = $('#' + provider + '_limit').val();

            if (amount > limit) {
                var count = Math.floor(amount / limit);
                var remainder = Math.round((amount % limit) * 100) / 100;

                var parts = [];

                for (var i = 0; i < count; i++) {
                    parts.push(limit + ' ' + currency);
                }

                if (remainder) {
                    parts.push(remainder + ' ' + currency);
                }

                text = l10n.parts + ': ' + parts.join(', ');
            }
        }

        return text;
    }

    function price_term_change()
    {
        var price_id = $('#payment-price-id').val();
        var term_id = $('#payment-term-id').val();
        var promocode = $('#buy-promo').val();

        $('.submit-amount').html('');
        $('.payment-parts').html('');
        $('.phone-field').hide();

        $('.payment-price-need').addClass('__load');
        $.post((langUrl || '') + "/payment/ajaxgetprice", {price_id: price_id, term_id: term_id, promocode: promocode, promo_type: 'buy_vpn'}, 
            function (data){
                $('.payment-price-need').removeClass('__load');
                $('.payment-price-need span').html(data.need_pay);
                $('.payment-value-desc').html(data.description);
                $('#diff-amount').val(data.diff);
                if (data.diff < 0)
                {
                    $('.form-group.way-field').show();
                    var provider = $('#payment-form input[name=way_id]:checked').val();
                    payment_provider_calc(provider);
                }
                else
                    $('.form-group.way-field').hide();
        }, 'json');
    };
    $('.payment-term-field a.btn').click(function(){
        $('.payment-term-field a.btn').removeClass('btn-default-transparent');
        $(this).addClass('btn-default-transparent');

        var termId = $(this).data('id');
        $('#payment-term-id').val(termId);
        price_term_change();
    });
    function payment_provider_calc(provider)
    {
        var  usd = $('#usd-id').val();
        var  bitcoin = $('#bitcoin-id').val();
        var amount_final = Math.abs($('#diff-amount').val());
        var currency_final = 'USD';
        switch (provider) {
            case 'rwebmoney':
                currency_final = 'WMR';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'yandex':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                //amount_final = Math.ceil(amount_final * 100) / 100;
                break;

            case 'qiwi':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'paypal_rus':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'bitcoin':
                currency_final = 'BTC';
                amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                break;

            case 'perfect':
                currency_final = 'PMUSD';
                break;

            case 'zwebmoney':
                currency_final = 'WMZ';
                break;

            case 'coinpayments':
                var coinpaymentsId = $('#payment-coinpayments-select').val();
                var coinpaymentsRate = coinpayments[+coinpaymentsId];

                currency_final = coinpaymentsRate.code;
                amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                break;
        }

        if ($('#commission_' + provider).length)
        {
            var commission = $('#commission_' + provider).val();
            amount_final = amount_final * (1 + commission * 1);
            if (provider == 'bitcoin')
                amount_final = Math.ceil(amount_final * 1000000) / 1000000;
            else
                amount_final = Math.ceil(amount_final * 100) / 100;
        }

        $('.submit-amount').html(amount_final + ' ' + currency_final);
        $('.payment-parts').html(getPaymentPartsDesc(provider, amount_final, currency_final));

        if (provider == 'qiwi')
            $('.phone-field').show();
        else
            $('.phone-field').hide();

        if (provider == 'coinpayments')
            $('.coinpayments-field').show();
        else
            $('.coinpayments-field').hide();
    };
    if ($('#payment-form').length && $('.way-field.__need_calc').length)
    {
        var provider = $('#payment-form input[name=way_id]:checked').val();
        payment_provider_calc(provider);
    }
    $('#payment-form input[name=way_id]').change(function(){
        var provider = $(this).val();
        payment_provider_calc(provider);
    });
    $('#payment-coinpayments-select').change(function(){
        var provider = $('#payment-form input[name=way_id]:checked').val();
        payment_provider_calc(provider);
    });
    $('#payment-form').submit(function(){
        var success = true;

        var provider = $('#payment-form input[name=way_id]:checked').val();

        $('.phone-field').removeClass('has-error has-success');

        if (provider == 'qiwi')
        {
            if ($('#payment-phone').val())
                $('.phone-field').addClass('has-success');
            else
            {
                $('.phone-field').addClass('has-error');
                success = false;
            }
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        // send metrika-----------------
        if (success)
            sendMetrika(isNewUser ? 'new-buyvpn-payment' : 'reg-buyvpn-payment');
        // -----------------------------

        return success;
    });
    /*----------------------------*/
    /*--------------order--------------*/
    function order_price_term_change()
    {
        var price_id = $('#order-price_id').val();
        var term_id = $('#order-term_id').val();
        $('.order-price-need span').html('-');
        $('.order-price-need').addClass('__load');
        $.post((langUrl || '') + "/payment/ajaxgetprice", {price_id: price_id, term_id: term_id}, 
            function (data){
                $('.order-price-need').removeClass('__load');
                $('.order-price-need span').html(data.need_pay);
        }, 'json');
    };
    $('#order-price_id').change(order_price_term_change);
    $('#order-term_id').change(order_price_term_change);
    $('#order-is-test').change(function(){
        if ($(this).prop('checked')) {
            $('#order-price_id').val(4); // Perfect VPN
            $('#order-term_id').val(2); // 3 days
            $('#order-is-take').prop('checked', false);

            $('#order-price_id, #order-term_id, #order-is-take').prop('disabled', true);
        } else {
            $('#order-price_id, #order-term_id, #order-is-take').prop('disabled', false);
        }

        order_price_term_change();
    });
    /*----------------------------*/
    /*--------------upgrade--------------*/
    function upgrade_get_amount()
    {
        var price_id = $('#upgrade-price').val();
        var id = $('#order-id').val();
        var promocode = $('#upgrade-promo').val();

        $('.submit-amount').html('');
        $('.payment-parts').html('');
        $('.phone-field').hide();

        $('.upgrade-price-need').addClass('__load');
        $.post((langUrl || '') + "/payment/ajaxupgrade", {id: id, price_id: price_id, promocode: promocode}, 
            function (data){
                $('.upgrade-price-need').removeClass('__load');
                $('.upgrade-price-need span').html(data.need_pay);
                $('.upgrade-value-desc').html(data.description);
                $('#diff-amount').val(data.diff);
                if (data.diff < 0)
                {
                    $('.form-group.way-field').show();
                    var provider = $('#upgrade-form input[name=way_id]:checked').val();
                    upgrade_provider_calc(provider);
                }
                else
                    $('.form-group.way-field').hide();
        }, 'json');
    };
    $('.upgrade-promo-toggle').click(function(){
        $('.upgrade-promo-field').toggle(300);
    });
    $('.upgrade-price-field-control a.btn').click(function(){
        $('.upgrade-price-field-control a.btn').removeClass('btn-default-transparent');
        $(this).addClass('btn-default-transparent');

        var priceId = $(this).data('id');
        $('#upgrade-price').val(priceId);
        upgrade_get_amount();
    });
    var find_promocode_timer;
    function find_promocode()
    {
        var promocode = $('#upgrade-promo').val();
        if (promocode)
        {
            $('#upgrade-promo').addClass('__load');
            $.post((langUrl || '') + "/payment/ajaxcheckpromocode", {promocode: promocode, type: 'upgrade_vpn'},
                function (data){
                    $('#upgrade-promo').removeClass('__load');
                    $('.upgrade-promo-field').removeClass('has-error has-success');
                    if (data.error)
                    {
                        $('.upgrade-promo-field').addClass('has-error');
                        $('.upgrade-promo-field .help-block.__upgrade').html(data.error);
                    }
                    else
                    {
                        $('.upgrade-promo-field').addClass('has-success');
                        $('.upgrade-promo-field .help-block.__upgrade').html(data.success);
                    }
                    upgrade_get_amount();
            }, 'json');
        }
        else
        {
            $('.upgrade-promo-field').removeClass('has-error has-success');
            $('.upgrade-promo-field .help-block.__upgrade').html('');
            upgrade_get_amount();
        }
    };
    $('#upgrade-promo').keyup(function(){
        clearTimeout(find_promocode_timer);
        find_promocode_timer = setTimeout(find_promocode, 1000);
    });
    $('#upgrade-promo').change(function(){
        clearTimeout(find_promocode_timer);
        find_promocode();
    });

    // check promo in init
    if ($('#upgrade-promo').length && $('#upgrade-promo').val()) {
        $('.upgrade-promo-field').toggle(300);
        clearTimeout(find_promocode_timer);
        find_promocode();
    }

    function upgrade_provider_calc(provider)
    {
        var  usd = $('#usd-id').val();
        var  bitcoin = $('#bitcoin-id').val();
        var amount_final = Math.abs($('#diff-amount').val());
        var currency_final = 'USD';
        switch (provider) {
            case 'rwebmoney':
                currency_final = 'WMR';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'yandex':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                //amount_final = Math.ceil(amount_final * 100) / 100;
                break;

            case 'qiwi':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'paypal_rus':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'bitcoin':
                currency_final = 'BTC';
                amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                break;

            case 'perfect':
                currency_final = 'PMUSD';
                break;

            case 'zwebmoney':
                currency_final = 'WMZ';
                break;

            case 'coinpayments':
                var coinpaymentsId = $('#upgrade-coinpayments-select').val();
                var coinpaymentsRate = coinpayments[+coinpaymentsId];

                currency_final = coinpaymentsRate.code;
                amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                break;
        }

        if ($('#commission_' + provider).length)
        {
            var commission = $('#commission_' + provider).val();
            amount_final = amount_final * (1 + commission * 1);
            if (provider == 'bitcoin')
                amount_final = Math.ceil(amount_final * 1000000) / 1000000;
            else
                amount_final = Math.ceil(amount_final * 100) / 100;
        }

        $('.submit-amount').html(amount_final + ' ' + currency_final);
        $('.payment-parts').html(getPaymentPartsDesc(provider, amount_final, currency_final));

        if (provider == 'qiwi')
            $('.phone-field').show();
        else
            $('.phone-field').hide();

        if (provider == 'coinpayments')
            $('.coinpayments-field').show();
        else
            $('.coinpayments-field').hide();
    };
    if ($('#upgrade-form .way-field.__need_calc').length)
    {
        var provider = $('#upgrade-form input[name=way_id]:checked').val();
        upgrade_provider_calc(provider);
    }
    $('#upgrade-form input[name=way_id]').change(function(){
        var provider = $(this).val();
        upgrade_provider_calc(provider);
    });
    $('#upgrade-coinpayments-select').change(function(){
        var provider = $('#upgrade-form input[name=way_id]:checked').val();
        upgrade_provider_calc(provider);
    });
    $('#upgrade-form').submit(function(){
        var success = true;

        var provider = $('#upgrade-form input[name=way_id]:checked').val();

        $('.phone-field').removeClass('has-error has-success');

        if (provider == 'qiwi')
        {
            if ($('#upgrade-phone').val())
                $('.phone-field').addClass('has-success');
            else
            {
                $('.phone-field').addClass('has-error');
                success = false;
            }
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        // send metrika-----------------
        if (success)
            sendMetrika('upgradevpn');
        // -----------------------------

        return success;
    });
    /*----------------------------*/
    /*--------------profile--------------*/
    //-------------login---------------
    $('#profile-login-edit').click(function(){
        $('.profile-login-view-wrap').hide();
        $('.profile-login-edit-wrap').show();
    });
    $('#profile-login-close').click(function(){
        $('.profile-login-edit-wrap').hide();
        $('.profile-login-view-wrap').show();
        $('.profile-login-error-same').hide();
    });
    $('#profile-username').blur(function(){
        $('.profile-login-edit-wrap').removeClass('has-error');
        $('.profile-login-error-same').hide();
    });
    $('#profile-login-save').click(function(){
        var login = $('#profile-username').val();
        if (login)
        {
            $('#profile-username').addClass('__load');
            $.post("/user/ajaxloginsave", {login: login}, 
                function (data){
                    $('#profile-username').removeClass('__load');
                    if (data == 'same')
                    {
                        $('.profile-login-error-same').show();
                        $('.profile-login-edit-wrap').addClass('has-error');
                    }
                    else if (data == 'error')
                        $('.profile-login-edit-wrap').addClass('has-error');
                    else
                    {
                        $('.profile-login-text').html(login);
                        $('.profile-login-edit-wrap').hide();
                        $('.profile-login-view-wrap').show();
                    }
            });
        }
        else
        {
            $('.profile-login-edit-wrap').addClass('has-error');
        }
    });
    //-------------email---------------
    $('#profile-email-edit').click(function(){
        $('.profile-email-view-wrap').hide();
        $('.profile-email-edit-wrap').show();
    });
    $('#profile-email-close').click(function(){
        $('.profile-email-edit-wrap').hide();
        $('.profile-email-view-wrap').show();
        $('.profile-email-error-same').hide();
    });
    $('#profile-email').blur(function(){
        $('.profile-email-edit-wrap').removeClass('has-error');
        $('.profile-email-error-same').hide();
    });
    $('#profile-email-save').click(function(){
        var email = $('#profile-email').val();
        if (email)
        {
            $('#profile-email').addClass('__load');
            $.post("/user/ajaxemailsave", {email: email}, 
                function (data){
                    $('#profile-email').removeClass('__load');
                    if (data == 'same')
                    {
                        $('.profile-email-error-same').show();
                        $('.profile-email-edit-wrap').addClass('has-error');
                    }
                    else if (data == 'error')
                        $('.profile-email-edit-wrap').addClass('has-error');
                    else
                    {
                        $('#profile-email').prop('disabled', true);
                        $('#profile-email-save').hide();
                        $('#profile-email-close').hide();
                        $('.profile-email-edit-confirm').show();
                    }
            });
        }
        else
        {
            $('.profile-email-edit-wrap').addClass('has-error');
        }
    });
    //------------------password----------------
    $('#profile-password-edit').click(function(){
        $('.profile-password-view-wrap').hide();
        $('.profile-password-edit-wrap').show();
    });
    $('#profile-password-close').click(function(){
        $('.profile-password-edit-wrap').hide();
        $('.profile-password-view-wrap').show();
    });
    $('#profile-password').blur(function(){
        $('.profile-password-edit-wrap').removeClass('has-error');
    });
    $('#profile-password-save').click(function(){
        var password = $('#profile-password').val();
        if (password)
        {
            $('#profile-password').addClass('__load');
            $.post("/user/ajaxpasswordsave", {password: password}, 
                function (data){
                    $('#profile-password').removeClass('__load');
                    if (data == 'error')
                        $('.profile-password-edit-wrap').addClass('has-error');
                    else
                    {
                        $('#profile-password').val('');
                        $('.profile-password-edit-wrap').hide();
                        $('.profile-password-view-wrap').show();
                    }
            });
        }
        else
        {
            $('.profile-password-edit-wrap').addClass('has-error');
        }
    });
    //------------------socks----------------
    $('#socks-login').change(function(){
        var password = $('#socks-login :selected').data('password');
        $('.socks-password-text').html(password);
        $('#socks-password').val(password);

        // save curent login
        var id = $('#socks-login').val();
        $('.socks-login-view-wrap').addClass('__load');
        $.post("/proxy/ajaxloginactive", {id: id},
            function (data){
                $('.socks-login-view-wrap').removeClass('__load');
        });
    });
    $('#socks-password-edit').click(function(){
        $('#socks-password').val($('.socks-password-text').html());
        $('.socks-password-view-wrap').hide();
        $('.socks-password-edit-wrap').show();
    });
    $('#socks-password-close').click(function(){
        $('.socks-password-edit-wrap').hide();
        $('.socks-password-view-wrap').show();
    });
    $('#socks-password').blur(function(){
        $('.socks-password-edit-wrap').removeClass('has-error');
    });
    $('#socks-password-save').click(function(){
        var password = $('#socks-password').val();
        var proxy_id = $('#socks-login').val();
        if (password && proxy_id)
        {
            $('#socks-password').addClass('__load');
            $.post("/proxy/ajaxproxypasswordsave", {password: password, proxy_id: proxy_id}, 
                function (data){
                    $('#socks-password').removeClass('__load');
                    if (data == 'error')
                        $('.socks-password-edit-wrap').addClass('has-error');
                    else
                    {
                        $('.socks-password-text').html(password);
                        $('#socks-login :selected').data('password', password);
                        $('.socks-password-edit-wrap').hide();
                        $('.socks-password-view-wrap').show();
                    }
            });
        }
        else
        {
            $('.socks-password-edit-wrap').addClass('has-error');
        }
    });
    //------------- socks panel ---------
    var isChrome = /chrome/i.test(navigator.userAgent);

    if ($('.user-socks-panel').length && isChrome) {
        $('.user-socks-panel__iframe').hide();
        $('.user-socks-panel__link').show();
    }

    if ($('.site-socks-wrapper').length && isChrome) {
        $('.site-socks-wrapper__iframe').hide();
        $('.site-socks-wrapper__link').show();
    }
    /*-----------------------------------*/
    /*--------------balance--------------*/
    if ($('#balance-form').length)
    {
        balance_increase_amount();
    }
    function balance_increase_amount(){
        var amount = Number($('#balance-amount').val());
        amount = isNaN(amount) ? 0 : amount;
        var provider = $('#balance-form input[name=way_id]:checked').val();

        $('.submit-amount').html('');
        $('.payment-parts').html('');

        if (amount > 0)
            $('.balance-price-need span').html(amount);
        else
            $('.balance-price-need span').html(0);

        if (provider == 'qiwi')
            $('.balance-phone-field').show();
        else
            $('.balance-phone-field').hide();

        if (provider == 'coinpayments')
            $('.coinpayments-field').show();
        else
            $('.coinpayments-field').hide();

        if (provider && amount > 0)
        {
            var usd = $('#usd-id').val();
            var bitcoin = $('#bitcoin-id').val();
            var amount_final = amount;
            var currency_final = 'USD';

            switch (provider) {
                case 'rwebmoney':
                    currency_final = 'WMR';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'yandex':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                    //amount_final = Math.ceil(amount_final * 100) / 100;
                    break;

                case 'qiwi':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'paypal_rus':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'bitcoin':
                    currency_final = 'BTC';
                    amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                    break;

                case 'perfect':
                    currency_final = 'PMUSD';
                    break;

                case 'zwebmoney':
                    currency_final = 'WMZ';
                    break;

                case 'coinpayments':
                    var coinpaymentsId = $('#balance-coinpayments-select').val();
                    var coinpaymentsRate = coinpayments[+coinpaymentsId];

                    currency_final = coinpaymentsRate.code;
                    amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                    break;
            }

            if ($('#commission_' + provider).length)
            {
                var commission = $('#commission_' + provider).val();
                amount_final = amount_final * (1 + commission * 1);
                if (provider == 'bitcoin')
                    amount_final = Math.ceil(amount_final * 1000000) / 1000000;
                else
                    amount_final = Math.ceil(amount_final * 100) / 100;
            }

            $('.submit-amount').html(amount_final + ' ' + currency_final);
            $('.payment-parts').html(getPaymentPartsDesc(provider, amount_final, currency_final));
        }
    };
    $('#balance-amount').keyup(function(){
        if (this.value.match(/[^0-9\.]/g)) {
            this.value = this.value.replace(/[^0-9\.]/g, '');
        }
        
        balance_increase_amount();
    });
    $('#balance-amount').blur(function(){
        $(this).parent().removeClass('has-error has-success');
        if ($(this).val())
            $(this).parent().addClass('has-success');
        else
            $(this).parent().addClass('has-error');
    });
    $('#balance-amount').change(balance_increase_amount);
    $('#balance-coinpayments-select').change(balance_increase_amount);
    $('#balance-form input[name=way_id]').change(balance_increase_amount);
    $('#balance-form').submit(function(){
        var success = true;

        $('.balance-amount-field').removeClass('has-error has-success');
        $('.balance-phone-field').removeClass('has-error has-success');

        var amount = Number($('#balance-amount').val());
        amount = isNaN(amount) ? 0 : amount;
        var provider = $('#balance-form input[name=way_id]:checked').val();

        if (amount > 0)
        {
            $('.balance-amount-field').addClass('has-success');
        }
        else
        {
            $('.balance-amount-field').addClass('has-error');
            success = false;
        }

        if (provider == 'qiwi')
        {
            if ($('#balance-phone').val())
                $('.balance-phone-field').addClass('has-success');
            else
            {
                $('.balance-phone-field').addClass('has-error');
                success = false;
            }
        }

        return success;
    });
    /*----------------------------*/
    /*--------------order list--------------*/
    $('.user-order-item_title.__active span').click(function(){
        var paramDiv = $(this).parent().parent().find('.user-order-item_param');
        var setupDiv = $(paramDiv).find('.user-order-item-setup');
        if ($(paramDiv).is(':hidden'))
        {
            var order_id = setupDiv.data('order');
            setupDiv.addClass('__load');
            $.post((langUrl || '') + "/user/ajaxgetsetup", {order_id: order_id}, 
                function (data){
                    setupDiv.removeClass('__load');
                    setupDiv.html(data);
            });
        }
        else
        {
            setupDiv.html('');
        }
        paramDiv.toggle(300);
    });
    $('body').on('click', '.user-order-ip a', function(){
        $(this).parent().find('.user-order-pptp').toggle(300);
    });
    /*------------login-------------*/
    $('.order-login-edit').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.order-login-view-wrap').hide();
        $(current_parent).find('.order-login-edit-wrap').show();
    });
    $('.order-login-close').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.order-login-edit-wrap').hide();
        $(current_parent).find('.order-login-view-wrap').show();
    });
    $('.order-login').blur(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.order-login-edit-wrap').removeClass('has-error');
        $(current_parent).find('.order-login-error').hide();
    });
    $('.order-login-save').click(function(){
        var current_parent = $(this).parent().parent();
        var login = $(current_parent).find('.order-login').val();
        var order_id = $(current_parent).find('.order-login-edit-wrap').data('order');

        if (/^[A-Za-z0-9_-]+$/.test(login))
        {
            $(current_parent).find('.order-login').addClass('__load');
            $.post("/user/ajaxorderlogin", {login: login, order_id: order_id}, 
                function (data){
                    $(current_parent).find('.order-login').removeClass('__load');
                    if (data == 'error') {
                        $(current_parent).find('.order-login-edit-wrap').addClass('has-error');
                        $(current_parent).find('.order-login-error').show();
                    } else {
                        $(current_parent).find('.order-login-text').html(login);
                        $(current_parent).find('.order-login-edit-wrap').hide();
                        $(current_parent).find('.order-login-view-wrap').show();
                    }
            });
        }
        else
        {
            $(current_parent).find('.order-login-edit-wrap').addClass('has-error');
            $(current_parent).find('.order-login-error').show();
        }
    });
    /*-------------password--------------*/
    $('.order-password-edit').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.order-password-view-wrap').hide();
        $(current_parent).find('.order-password-edit-wrap').show();
    });
    $('.order-password-close').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.order-password-edit-wrap').hide();
        $(current_parent).find('.order-password-view-wrap').show();
    });
    $('.order-password').blur(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.order-password-edit-wrap').removeClass('has-error');
        $(current_parent).find('.order-password-error').hide();
    });
    $('.order-password-save').click(function(){
        var current_parent = $(this).parent().parent();
        var password = $(current_parent).find('.order-password').val();
        var order_id = $(current_parent).find('.order-password-edit-wrap').data('order');

        if (/^[A-Za-z0-9_-]+$/.test(password))
        {
            $(current_parent).find('.order-password').addClass('__load');
            $.post("/user/ajaxorderpassword", {password: password, order_id: order_id}, 
                function (data){
                    $(current_parent).find('.order-password').removeClass('__load');
                    if (data == 'error') {
                        $(current_parent).find('.order-password-edit-wrap').addClass('has-error');
                        $(current_parent).find('.order-password-error').show();
                    } else {
                        $(current_parent).find('.order-password-text').html(password);
                        $(current_parent).find('.order-password-edit-wrap').hide();
                        $(current_parent).find('.order-password-view-wrap').show();
                    }
            });
        }
        else
        {
            $(current_parent).find('.order-password-edit-wrap').addClass('has-error');
            $(current_parent).find('.order-password-error').show();
        }
    });
    /*-------------autopay--------------*/
    $('.order-autopay').change(function(){
        var currentDom = $(this);
        var order_id = $(currentDom).parent().parent().data('order');

        $(currentDom).parent().parent().find('.order-autopay-form-processing').fadeIn(500);
        $(currentDom).prop('disabled', true);
        $.post("/user/ajaxorderautopay", {
                autopay: $(currentDom).prop("checked") ? 1 : 0, 
                order_id: order_id
            }, 
            function (data){
                $(currentDom).parent().parent().find('.order-autopay-form-processing').fadeOut(500);
                $(currentDom).prop('disabled', false);
        });
    });
    $('.order-autopay-period').change(function(){
        var currentDom = $(this);
        var order_id = $(currentDom).parent().parent().data('order');

        $(currentDom).parent().parent().find('.order-autopay-form-processing').fadeIn(500);
        $.post("/user/ajaxorderautopayperiod", {
                period: $(this).val(),
                order_id: order_id
            }, 
            function (data){
                $(currentDom).parent().parent().find('.order-autopay-form-processing').fadeOut(500);
        });
    });
    /*-----------------------------------*/
    /*-------------------prolong----------------*/
    $('.prolong-promo-toggle').click(function(){
        $('.prolong-promo-field').toggle(300);
    });
    var find_prolong_promocode_timer;
    function find_prolong_promocode()
    {
        var promocode = $('#prolong-promo').val();
        if (promocode)
        {
            $('#prolong-promo').addClass('__load');
            $.post((langUrl || '') + "/payment/ajaxcheckpromocode", {promocode: promocode, type: 'prolong_vpn'},
                function (data){
                    $('#prolong-promo').removeClass('__load');
                    $('.prolong-promo-field').removeClass('has-error has-success');
                    if (data.error)
                    {
                        $('.prolong-promo-field').addClass('has-error');
                        $('.prolong-promo-field .help-block.__prolong').html(data.error);
                    }
                    else
                    {
                        $('.prolong-promo-field').addClass('has-success');
                        $('.prolong-promo-field .help-block.__prolong').html(data.success);
                    }
                    prolong_term_change();
            }, 'json');
        }
        else
        {
            $('.prolong-promo-field').removeClass('has-error has-success');
            $('.prolong-promo-field .help-block.__prolong').html('');
            prolong_term_change();
        }
    };
    $('#prolong-promo').keyup(function(){
        clearTimeout(find_prolong_promocode_timer);
        find_prolong_promocode_timer = setTimeout(find_prolong_promocode, 1000);
    });
    $('#prolong-promo').change(function(){
        clearTimeout(find_prolong_promocode_timer);
        find_prolong_promocode();
    });

    // check promo in init
    if ($('#prolong-promo').length && $('#prolong-promo').val()) {
        $('.prolong-promo-field').toggle(300);
        clearTimeout(find_prolong_promocode_timer);
        find_prolong_promocode();
    }

    function prolong_term_change()
    {
        var price_id = $('#prolong-price-id').val();
        var term_id = $('#prolong-term-id').val();
        var promocode = $('#prolong-promo').val();

        $('.submit-amount').html('');
        $('.payment-parts').html('');
        $('.phone-field').hide();

        $('.prolong-price-need').addClass('__load');
        $.post((langUrl || '') + "/payment/ajaxgetprice", {price_id: price_id, term_id: term_id, promocode: promocode, promo_type: 'prolong_vpn'}, 
            function (data){
                $('.prolong-price-need').removeClass('__load');
                $('.prolong-price-need span').html(data.need_pay);
                $('.prolong-value-desc').html(data.description);
                $('#diff-amount').val(data.diff);
                if (data.diff < 0)
                {
                    $('.form-group.way-field').show();
                    var provider = $('#prolong-form input[name=way_id]:checked').val();
                    prolong_provider_calc(provider);
                }
                else
                    $('.form-group.way-field').hide();
        }, 'json');
    };
    $('.prolong-term-field a.btn').click(function(){
        $('.prolong-term-field a.btn').removeClass('btn-default-transparent');
        $(this).addClass('btn-default-transparent');

        var termId = $(this).data('id');
        $('#prolong-term-id').val(termId);
        prolong_term_change();
    });
    function prolong_provider_calc(provider)
    {
        var  usd = $('#usd-id').val();
        var  bitcoin = $('#bitcoin-id').val();
        var amount_final = Math.abs($('#diff-amount').val());
        var currency_final = 'USD';
        switch (provider) {
            case 'rwebmoney':
                currency_final = 'WMR';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'yandex':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                //amount_final = Math.ceil(amount_final * 100) / 100;
                break;

            case 'qiwi':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'paypal_rus':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'bitcoin':
                currency_final = 'BTC';
                amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                break;

            case 'perfect':
                currency_final = 'PMUSD';
                break;

            case 'zwebmoney':
                currency_final = 'WMZ';
                break;

            case 'coinpayments':
                var coinpaymentsId = $('#prolong-coinpayments-select').val();
                var coinpaymentsRate = coinpayments[+coinpaymentsId];

                currency_final = coinpaymentsRate.code;
                amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                break;
        }

        if ($('#commission_' + provider).length)
        {
            var commission = $('#commission_' + provider).val();
            amount_final = amount_final * (1 + commission * 1);
            if (provider == 'bitcoin')
                amount_final = Math.ceil(amount_final * 1000000) / 1000000;
            else
                amount_final = Math.ceil(amount_final * 100) / 100;
        }

        $('.submit-amount').html(amount_final + ' ' + currency_final);
        $('.payment-parts').html(getPaymentPartsDesc(provider, amount_final, currency_final));

        if (provider == 'qiwi')
            $('.phone-field').show();
        else
            $('.phone-field').hide();

        if (provider == 'coinpayments')
            $('.coinpayments-field').show();
        else
            $('.coinpayments-field').hide();
    };
    if ($('#prolong-form .way-field.__need_calc').length)
    {
        var provider = $('#prolong-form input[name=way_id]:checked').val();
        prolong_provider_calc(provider);
    }
    $('#prolong-form input[name=way_id]').change(function(){
        var provider = $(this).val();
        prolong_provider_calc(provider);
    });
    $('#prolong-coinpayments-select').change(function(){
        var provider = $('#prolong-form input[name=way_id]:checked').val();
        prolong_provider_calc(provider);
    });
    $('#prolong-form').submit(function(){
        var success = true;

        var provider = $('#prolong-form input[name=way_id]:checked').val();

        $('.phone-field').removeClass('has-error has-success');

        if (provider == 'qiwi')
        {
            if ($('#prolong-phone').val())
                $('.phone-field').addClass('has-success');
            else
            {
                $('.phone-field').addClass('has-error');
                success = false;
            }
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        // send metrika-----------------
        if (success)
            sendMetrika('prolongvpn');
        // -----------------------------

        return success;
    });
    /*-----------------------------------*/
    /*-------------------referal----------------*/
    $('.referal-count').click(function(){
        var currentDom = $(this).parent().find('.referal-list');
        var id = $(this).data('id');
        currentDom.toggle(300);
        if (!$(this).parent().find('.table').length)
        {
            currentDom.addClass('__load');
            $.post("/referal/ajaxgetreferals", {id: id}, 
                function (data){
                    currentDom.removeClass('__load');
                    currentDom.html(data);
            });
        }
    });
    $('.user-payout-cancel').click(function(){
        var id = $(this).data('id');
        var status = $(this).data('status');
        $(this).parent().parent().find('td:eq(4)').html(status);
        $(this).parent().parent().addClass('__cancel');
        $(this).remove();
        $.post("/user/ajaxpayoutcancel", {id: id, status: status}, 
            function (data){
        });
    });
    /*-----------------------------------*/
    /*------------------friend-----------*/
    $('.friend-count').click(function(){
        $(this).parent().find('.friend-list').toggle(300);
    });
    /*-----------------------------------*/
    /*-------------------payout----------------*/
    $('#payout-form').submit(function(){
        var success = true;
        $('#payout-form .form-control').each(function(){
            $(this).parent().removeClass('has-success');
            $(this).parent().removeClass('has-error');
            if ($(this).val())
            {
                $(this).parent().addClass('has-success');
                if ($(this).attr('id') == 'payout-amount')
                {
                    var maxAmount = parseFloat($('#max-amount').val());
                    var amount = parseFloat($(this).val());
                    if (isNaN(amount) || amount < 10 || amount > maxAmount)
                    {
                        $(this).parent().addClass('has-error');
                        success = false;
                    }
                }
            }
            else
            {
                $(this).parent().addClass('has-error');
                success = false;
            }
        });
        return success;
    });
    /*-----------------------------------*/
    /*-------------------ticket----------*/
    // ajax send
    /*$('#ticket-chat-submit').click(function(){
        var messageField = $('#ticket-chat-message');
        $(messageField).parent().removeClass('has-success').removeClass('has-error');
        if ($(messageField).val())
        {
            var message = $(messageField).val();
            var ticket_id = $('#ticket-chat-id').val();
            $(messageField).parent().addClass('has-success');
            $(this).button('loading');
            $.post('/ticket/ajaxchatcreate', {message: message, ticket_id: ticket_id}, 
                function (data){
                    $('#ticket-chat-submit').button('reset');
                    if (data.sent == 'yes' && data.html)
                    {
                        $('.ticket-chat-list').append($(data.html));
                        $('.ticket-chat-list').scrollTop(100000000000);
                        $('#ticket-chat-submit').addClass('btn-success');
                        setTimeout(function(){
                            $('#ticket-chat-submit').removeClass('btn-success');
                        }, 2000);
                        messageField.val('');
                    }
                    else
                        alert('Произошла ошибка');
            }, 'json');
        }
        else
            $(messageField).parent().addClass('has-error');
    });*/
    // scroll to end chat
    if ($('.ticket-chat-list').length)
    {
        $('.ticket-chat-list').scrollTop(100000000000);
    }
    // form send
    $('#ticket-chat-activeform').submit(function(){
        var success = true;
        var isClosed = $('#ticket-is-close').prop('checked');

        $('#ticket-chat-message').parent().removeClass('has-success');
        $('#ticket-chat-message').parent().removeClass('has-error');

        if ($('#ticket-chat-message').val() || isClosed)
            $('#ticket-chat-message').parent().addClass('has-success');
        else
        {
            $('#ticket-chat-message').parent().addClass('has-error');
            success = false;
        }

        return success;
    });
    $('#ticket-chat-message').blur(function(){
        $('#ticket-chat-message').parent().removeClass('has-success');
        $('#ticket-chat-message').parent().removeClass('has-error');
    });
    $('.ticket-view-important').click(function(){
        $(this).removeClass('glyphicon-star');
        $(this).removeClass('glyphicon-star-empty');
        $(this).addClass($(this).data('important') == '1' ? 'glyphicon-star-empty' : 'glyphicon-star');
        $(this).data('important', ($(this).data('important') == '1' ? '0' : '1'));

        var ticket_id = $('#ticket-chat-id').val();
        $.post('/ticket/ajaximportant', {ticket_id: ticket_id}, function (data){});
    });
    $('.ticket-index-important').click(function(){
        $(this).removeClass('glyphicon-star');
        $(this).removeClass('glyphicon-star-empty');
        $(this).addClass($(this).data('important') == '1' ? 'glyphicon-star-empty' : 'glyphicon-star');
        $(this).data('important', ($(this).data('important') == '1' ? '0' : '1'));

        var ticket_id = $(this).data('ticket');
        $.post('/ticket/ajaximportant', {ticket_id: ticket_id}, function (data){});
    });
    $('#ticket-create-socks').click(function(){
        var ticketId = $(this).data('ticket');

        $(this).button('loading');
        $('#ticket-socks-result').html('');

        $.post('/proxy/ajaxticketsockscreate', {ticketId: ticketId},
            function (data){
                $('#ticket-create-socks').button('reset');

                if (data.state == 'error') {
                    $('#ticket-socks-result').html('<div class="alert alert-danger"><p>' + data.message + '</p></div>');
                } else {
                    $('#ticket-socks-result').html('<div class="alert alert-success"><p>Username: ' + data.login + '<br>Password: ' + data.password + '</p><p>Доступы к аккаунту уже отправлены клиенту</p></div>');
                }
        }, 'json');
    });

    if (/ticket=new/.test(window.location.href)) {
        $("#feedbackModal").modal('show');
    }
    /*-----------------------------------*/
    /*----------------socks--------------*/
    $('.prices-proxy-start a.btn').click(function(){
        var id = $(this).data('id');
        var auth = $('#auth').val();

        $('#socks-tariff-id').val(id);

        if (auth == 1)
            $('#email-form').submit();
        else
            $("#myModal").modal('show');
    });
    $('.add-socks-form .form-control').focus(function(){
        $('.add-socks-form .form-group').removeClass('has-error');
    });
    $('#add-socks-submit').click(function(){
        var login = $('#add-socks-login').val();
        var password = $('#add-socks-password').val();
        var error = 0;

        $('.add-socks-form .form-group').removeClass('has-error');

        if (!login)
        {
            $('#add-socks-login').parent().addClass('has-error');
            error = 1;
        }

        if (!password)
        {
            $('#add-socks-password').parent().addClass('has-error');
            error = 1;
        }

        if (!error)
        {
            $(this).button('loading');
            $.post('/proxy/ajaxsockscreate', {login: login, password: password}, 
                function (data){
                    $('#socks-login').append($(data));
                    $('#socks-login :last').prop('selected', true);
                    $('#socks-login').change();

                    $('#add-socks-submit').button('reset');
                    $('#add-socks-login').val('');
                    $('#add-socks-password').val('');
                    $('#socksModal').modal('hide');
            });
        }
    });
    /*-----------------------------------*/
    /*--------balance control------------*/
    $('#balance-control-reason').change(function(){
        if ($(this).val() == 'another')
            $('.bc-comment-field').show(200);
        else
            $('.bc-comment-field').hide(200);
    });
    $('.balance-control .form-control').focus(function(){
        $(this).parent().removeClass('has-error').removeClass('has-success');
    });
    $('#balance-control-form').submit(function(){
        var success = true;
        $('#balance-control-form .form-control').each(function(){
            if (
                $(this).attr('id') == 'balance-control-amount' ||
                $(this).attr('id') == 'balance-control-reason'
            )
            {
                $(this).parent().removeClass('has-success');
                $(this).parent().removeClass('has-error');
                if ($(this).val())
                    $(this).parent().addClass('has-success');
                else
                {
                    $(this).parent().addClass('has-error');
                    success = false;
                }
            }
            if ($(this).attr('id') == 'balance-control-comment' && $('#balance-control-reason').val() == 'another')
            {
                $(this).parent().removeClass('has-success');
                $(this).parent().removeClass('has-error');
                if ($(this).val())
                    $(this).parent().addClass('has-success');
                else
                {
                    $(this).parent().addClass('has-error');
                    success = false;
                }
            }
        });
        return success;
    });
    /*-----------------------------------*/
    /*----dashboard-checkip-btn----------*/
    $('.dashboard-checkip-btn').click(function(){
        var userId = $(this).data('user');

        $('#dashboard-checkip-modal').data('user', userId);
        $('#dashboard-checkip-modal').modal('show');

        return false;
    });
    $('.dashboard-checkip-save').click(function(){
        var userId = $('#dashboard-checkip-modal').data('user');
        var freeCheck = $('#dashboard-checkip-field').val();
        var action = $(this).data('action');

        $(this).button('loading');

        $.post('/admin/ajaxcheckipsave',
            {
                userId: userId,
                freeCheck: freeCheck,
                action: action,
            },
            function (data){
                $('.dashboard-user tr[data-key="' + userId + '"] .free-check-col').html(data);

                $('.dashboard-checkip-save').button('reset');
                $('#dashboard-checkip-field').val('');
                $('#dashboard-checkip-modal').data('user', 0);
                $("#dashboard-checkip-modal").modal('hide');
        });
    });
    /*-----------------------------------*/
    /*------------- buy abc -------------*/
    if ($('#abcbuy-form').length)
    {
        abcbuy_calc_amount();
    }
    function abcbuy_calc_amount(){
        var amount = Number($('#need-pay').val());
        var provider = $('#abcbuy-form input[name=way_id]:checked').val();

        $('.submit-amount').html('');
        $('.payment-parts').html('');

        if (provider == 'qiwi')
            $('.abcbuy-phone-field').show();
        else
            $('.abcbuy-phone-field').hide();

        if (provider == 'coinpayments')
            $('.coinpayments-field').show();
        else
            $('.coinpayments-field').hide();

        if (provider && amount > 0)
        {
            var  usd = $('#usd-id').val();
            var  bitcoin = $('#bitcoin-id').val();
            var amount_final = amount;
            var currency_final = 'USD';
            switch (provider) {
                case 'rwebmoney':
                    currency_final = 'WMR';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'yandex':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                    //amount_final = Math.ceil(amount_final * 100) / 100;
                    break;

                case 'qiwi':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'paypal_rus':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'bitcoin':
                    currency_final = 'BTC';
                    amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                    break;

                case 'perfect':
                    currency_final = 'PMUSD';
                    break;

                case 'zwebmoney':
                    currency_final = 'WMZ';
                    break;

                case 'coinpayments':
                    var coinpaymentsId = $('#abcbuy-coinpayments-select').val();
                    var coinpaymentsRate = coinpayments[+coinpaymentsId];

                    currency_final = coinpaymentsRate.code;
                    amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                    break;
            }

            if ($('#commission_' + provider).length)
            {
                var commission = $('#commission_' + provider).val();
                amount_final = amount_final * (1 + commission * 1);
                if (provider == 'bitcoin')
                    amount_final = Math.ceil(amount_final * 1000000) / 1000000;
                else
                    amount_final = Math.ceil(amount_final * 100) / 100;
            }

            $('.submit-amount').html(amount_final + ' ' + currency_final);
            $('.payment-parts').html(getPaymentPartsDesc(provider, amount_final, currency_final));
        }
    };
    $('#abcbuy-form input[name=way_id]').change(abcbuy_calc_amount);
    $('#abcbuy-coinpayments-select').change(abcbuy_calc_amount);
    $('#abcbuy-form').submit(function(){
        var success = true;
        var provider = $('#abcbuy-form input[name=way_id]:checked').val();

        if (provider == 'qiwi')
        {
            $('.abcbuy-phone-field').removeClass('has-error has-success');

            if ($('#abcbuy-phone').val())
                $('.abcbuy-phone-field').addClass('has-success');
            else
            {
                $('.abcbuy-phone-field').addClass('has-error');
                success = false;
            }
        }

        if ($('.abcbuy-email-field').length) {
            $('.abcbuy-email-field').removeClass('has-error has-success');

            if ($('#abcbuy-email').val())
                $('.abcbuy-email-field').addClass('has-success');
            else
            {
                $('.abcbuy-email-field').addClass('has-error');
                success = false;
            }
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        return success;
    });
    /*-----------------------------------*/
    /*------------- buy proxy -----------*/
    function buy_proxy_handler() {
        // origin amount

        $('.buy-proxy-phone-field').removeClass('has-error has-success');
        $('#buy-proxy-count').parent().removeClass('has-error has-success');
        
        var country = $('#buy-proxy-country').val();
        var count = +$('#buy-proxy-count').val();
        var city = $('#buy-proxy-city').val();
        var freeIp = $('#buy-proxy-city :selected').data('count');
        var balance = +$('#balance-id').val();

        if (count < 0) {
            count = 0;
            $('#buy-proxy-count').val(count);
        }

        var item = countries[country] || {count: 0, buy: 0, prolong: 0};
        var amountBuy = count * item.buy;
        var amountProlong = count * item.prolong;

        $('.proxy-price-description span.__buy').html(item.buy);
        $('.proxy-price-description span.__prolong').html(item.prolong);
        $('.proxy-count-description span.__number').html(city ? (freeIp || 0) : item.count);
        $('#max-count').val(city ? (freeIp || 0) : item.count);

        // need to pay

        var amountDiscount = amountBuy;

        if (common_promocode_discount) {
            amountDiscount = amountDiscount * (100 - common_promocode_discount) / 100;
            amountDiscount = Math.ceil(amountDiscount * 100) / 100;
        }

        $('.buy-proxy-price-need span').html(amountDiscount);

        if (balance) {
            if (balance >= amountDiscount) {
                $('.buy-proxy-value-desc').html(l10n.fromBalance + ' ' + amountDiscount + ' $');
            } else {
                $('.buy-proxy-value-desc').html(l10n.fromBalance + ' ' + balance + ' $<br>' + l10n.needToPay + ' <b>' + Number((amountDiscount - balance).toFixed(2)) + ' $</b>');
            }
        }

        $('.way-field').hide();
        $('.buy-proxy-phone-field').hide();
        $('.submit-amount').html('');
        $('.payment-parts').html('');

        if (amountDiscount > balance) {
            $('.way-field').show();
            var provider = $('input[name=way_id]:checked').val();

            if (provider == 'qiwi')
                $('.buy-proxy-phone-field').show();
            else
                $('.buy-proxy-phone-field').hide();

            if (provider == 'coinpayments')
                $('.coinpayments-field').show();
            else
                $('.coinpayments-field').hide();

            var result = get_final_amount(provider, Number((amountDiscount - balance).toFixed(2)));

            $('.submit-amount').html(result.amount + ' ' + result.currency);
            $('.payment-parts').html(getPaymentPartsDesc(provider, result.amount, result.currency));
        }
    }

    function buy_proxy_set_city() {
        var country = $('#buy-proxy-country').val();
        var prompt = $('#buy-proxy-city').data('prompt');

        var options = ['<option value="">' + prompt + '</option>'];

        if (countries[country] && countries[country].city) {
            options = options.concat(countries[country].city.map(function(item){
                return '<option value="' + item.city + '" data-count="' + item.freeIp + '">' + item.city + '</option>';
            }));
        }

        $('#buy-proxy-city').html(options.join(''));
    }

    function get_final_amount(provider, amount) {
        var  usd = $('#usd-id').val();
        var  bitcoin = $('#bitcoin-id').val();
        var amount_final = amount;
        var currency_final = 'USD';
        switch (provider) {
            case 'rwebmoney':
                currency_final = 'WMR';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'yandex':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                //amount_final = Math.ceil(amount_final * 100) / 100;
                break;

            case 'qiwi':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'paypal_rus':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'bitcoin':
                currency_final = 'BTC';
                amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                break;

            case 'perfect':
                currency_final = 'PMUSD';
                break;

            case 'zwebmoney':
                currency_final = 'WMZ';
                break;

            case 'coinpayments':
                var coinpaymentsId = $('#buy-proxy-coinpayments-select').val();
                var coinpaymentsRate = coinpayments[+coinpaymentsId];

                currency_final = coinpaymentsRate.code;
                amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                break;
        }

        if ($('#commission_' + provider).length)
        {
            var commission = $('#commission_' + provider).val();
            amount_final = amount_final * (1 + commission * 1);
            if (provider == 'bitcoin')
                amount_final = Math.ceil(amount_final * 1000000) / 1000000;
            else
                amount_final = Math.ceil(amount_final * 100) / 100;
        }

        return {
            amount: amount_final,
            currency: currency_final,
        };
    };

    if ($('#buy-proxy-form').length)
    {
        buy_proxy_set_city();
        buy_proxy_handler();
    }

    $('#buy-proxy-country').change(function(){
        buy_proxy_set_city();
        buy_proxy_handler();
    });
    $('#buy-proxy-form input[name=way_id]').change(buy_proxy_handler);
    $('#buy-proxy-count').change(buy_proxy_handler);
    $('#buy-proxy-count').keyup(buy_proxy_handler);
    $('#buy-proxy-city').change(buy_proxy_handler);
    $('#buy-proxy-form #buy-proxy-coinpayments-select').change(buy_proxy_handler);

    $('#buy-proxy-promo').keyup(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode_timer = setTimeout(find_common_promocode, 1000, 'buy_proxy', buy_proxy_handler);
    });
    $('#buy-proxy-promo').change(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('buy_proxy', buy_proxy_handler);
    });

    // check promo in init
    if ($('#buy-proxy-promo').length && $('#buy-proxy-promo').val()) {
        $('.common-promo-field').toggle(300);
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('buy_proxy', buy_proxy_handler);
    }

    $('#buy-proxy-form').submit(function(){
        var success = true;
        var provider = $('#buy-proxy-form input[name=way_id]:checked').val();

        // provider field
        if (provider == 'qiwi')
        {
            $('.buy-proxy-phone-field').removeClass('has-error has-success');

            if ($('#buy-proxy-phone').val()) {
                $('.buy-proxy-phone-field').addClass('has-success');
            } else {
                $('.buy-proxy-phone-field').addClass('has-error');
                success = false;
            }
        }

        // count field
        var maxCount = +$('#max-count').val();
        $('#buy-proxy-count').parent().removeClass('has-error has-success');

        if (
            $('#buy-proxy-count').val() &&
            $('#buy-proxy-count').val() > 0 &&
            $('#buy-proxy-count').val() <= maxCount
        ) {
            $('#buy-proxy-count').parent().addClass('has-success');
        } else {
            $('#buy-proxy-count').parent().addClass('has-error');
            success = false;
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        return success;
    });
    /*-----------------------------------*/
    /*---------- prolong proxy ----------*/
    function prolong_proxy_handler() {
        // origin amount

        $('.prolong-proxy-phone-field').removeClass('has-error has-success');

        var balance = +$('#balance-id').val();
        var amountBuy = 0;

        $('.proxy-ip-checkbox').each(function(){
            if ($(this).prop('checked')) {
                amountBuy += $(this).data('price');
            }
        });

        // need to pay

        var amountDiscount = amountBuy;

        if (common_promocode_discount) {
            amountDiscount = amountDiscount * (100 - common_promocode_discount) / 100;
            amountDiscount = Math.ceil(amountDiscount * 100) / 100;
        }

        $('.prolong-proxy-price-need span').html(amountDiscount);

        if (balance) {
            if (balance >= amountDiscount) {
                $('.prolong-proxy-value-desc').html(l10n.fromBalance + ' ' + amountDiscount + ' $');
            } else {
                $('.prolong-proxy-value-desc').html(l10n.fromBalance + ' ' + balance + ' $<br>' + l10n.needToPay + ' <b>' + Number((amountDiscount - balance).toFixed(2)) + ' $</b>');
            }
        }

        $('.way-field').hide();
        $('.prolong-proxy-phone-field').hide();
        $('.submit-amount').html('');
        $('.payment-parts').html('');

        if (amountDiscount > balance) {
            $('.way-field').show();
            var provider = $('input[name=way_id]:checked').val();

            if (provider == 'qiwi')
                $('.prolong-proxy-phone-field').show();
            else
                $('.prolong-proxy-phone-field').hide();

            if (provider == 'coinpayments')
                $('.coinpayments-field').show();
            else
                $('.coinpayments-field').hide();

            var result = get_final_amount(provider, Number((amountDiscount - balance).toFixed(2)));

            $('.submit-amount').html(result.amount + ' ' + result.currency);
            $('.payment-parts').html(getPaymentPartsDesc(provider, result.amount, result.currency));
        }
    }

    if ($('#prolong-proxy-form').length)
    {
        prolong_proxy_handler();
    }

    $('#prolong-proxy-form input[name=way_id]').change(prolong_proxy_handler);
    $('#prolong-proxy-form #buy-proxy-coinpayments-select').change(prolong_proxy_handler);
    $('.proxy-ip-checkbox').change(prolong_proxy_handler);
    $('.proxy-ip-all-checkbox').change(function(){
        $(this).parents('.prolong-proxy-ip-item').find('.proxy-ip-checkbox').prop('checked', $(this).prop('checked'));
        prolong_proxy_handler();
    });

    $('#prolong-proxy-promo').keyup(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode_timer = setTimeout(find_common_promocode, 1000, 'buy_proxy', prolong_proxy_handler);
    });
    $('#prolong-proxy-promo').change(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('buy_proxy', prolong_proxy_handler);
    });

    // check promo in init
    if ($('#prolong-proxy-promo').length && $('#prolong-proxy-promo').val()) {
        $('.common-promo-field').toggle(300);
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('buy_proxy', prolong_proxy_handler);
    }

    $('#prolong-proxy-form').submit(function(){
        var success = true;
        var provider = $('#prolong-proxy-form input[name=way_id]:checked').val();

        // provider field
        if (provider == 'qiwi')
        {
            $('.prolong-proxy-phone-field').removeClass('has-error has-success');

            if ($('#prolong-proxy-phone').val()) {
                $('.prolong-proxy-phone-field').addClass('has-success');
            } else {
                $('.prolong-proxy-phone-field').addClass('has-error');
                success = false;
            }
        }

        // ip checked
        $('.proxy-ip-checkbox').parent().parent().removeClass('has-error has-success');

        if ($('.proxy-ip-checkbox:checked').length) {
            $('.proxy-ip-checkbox').parent().parent().addClass('has-success');
        } else {
            $('.proxy-ip-checkbox').parent().parent().addClass('has-error');
            success = false;
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        return success;
    });
    /*-----------------------------------*/
    /*------------- auth ip -------------*/
    checkAvailableAuthIpAdd();

    $('.user-auth-ip-my').click(function(){
        var input = $(this).parent().find('.auth-ip-input');

        input.val($(this).data('ip'));
        checkShowAuthSaveBtn(input);
    });
    $('.user-auth-ip-list').on('click', '.auth-ip-save', function(){
        var saveBtn = $(this);
        var input = $(this).parent().find('.auth-ip-input');
        var authIp = input.val();
        var authId = input.data('id');
        var matched = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(authIp);

        if (
            matched &&
            (matched[1] >= 0 && matched[1] <= 255) &&
            (matched[2] >= 0 && matched[2] <= 255) &&
            (matched[3] >= 0 && matched[3] <= 255) &&
            (matched[4] >= 0 && matched[4] <= 255)
        ) {
            $(this).parent().removeClass('has-error');
            input.addClass('__load');

            $.post('/user/ajaxsaveauthip', {ip: authIp, id: authId},
                function(data) {
                    input.removeClass('__load');
                    input.data('id', data.id);
                    input.data('old', authIp);

                    saveBtn.hide();
            }, 'json');
        } else {
            $(this).parent().addClass('has-error');
        }
    });
    $('.user-auth-ip-list').on('click', '.auth-ip-remove', function(){
        var removeBtn = $(this);
        var input = $(this).parent().find('.auth-ip-input');
        var authId = input.data('id');

        if (authId == -100) {
            $(removeBtn).parent().parent().remove();
            checkAvailableAuthIpAdd();
        } else {
            input.addClass('__load');

            $.post('/user/ajaxdeleteauthip', {id: authId},
                function(data) {
                    $(removeBtn).parent().parent().remove();
                    checkAvailableAuthIpAdd();
            });
        }
    });
    $('.user-auth-ip-list').on('change input', '.auth-ip-input', function(){
        checkShowAuthSaveBtn(this);
    });
    $('.user-auth-ip-add').click(function(){
        var html = '<div class="user-auth-ip-item">' +
            '<div class="user-auth-ip-edit form-inline">' +
                '<input type="text" class="form-control auth-ip-input" name="auth-ip" value="" placeholder="" data-id="-100" data-old="">' +
                '<span class="glyphicon glyphicon-ok profile-icon auth-ip-save __hide" aria-hidden="true"></span>' +
                '<span class="glyphicon glyphicon-remove profile-icon auth-ip-remove" aria-hidden="true"></span>' +
            '</div>' +
        '</div>';

        $('.user-auth-ip-list').append(html);
        checkAvailableAuthIpAdd();
    });

    function checkShowAuthSaveBtn(input) {
        var newVal = $(input).val();
        var oldVal = $(input).data('old');
        var saveBtn = $(input).parent().find('.auth-ip-save');

        if (newVal !== oldVal) {
            saveBtn.show();
        } else {
            saveBtn.hide();
        }
    }

    function checkAvailableAuthIpAdd() {
        if ($('.user-auth-ip-item').length < 3) {
            $('.user-auth-ip-add').show();
        } else {
            $('.user-auth-ip-add').hide();
        }
    }
    /*-----------------------------------*/
    /*-------- proxy auth login ---------*/
    $('.proxy-auth-login-edit').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.proxy-auth-login-wrap').hide();
        $(current_parent).find('.proxy-auth-login-edit-wrap').show();
    });
    $('.proxy-auth-login-close').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.proxy-auth-login-edit-wrap').hide();
        $(current_parent).find('.proxy-auth-login-wrap').show();
    });
    $('.proxy-auth-login').blur(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.proxy-auth-login-edit-wrap').removeClass('has-error');
        $(current_parent).find('.proxy-auth-login-error').hide();
    });
    $('.proxy-auth-login-save').click(function(){
        var current_parent = $(this).parent().parent();
        var login = $(current_parent).find('.proxy-auth-login').val();
        var order_id = $(current_parent).find('.proxy-auth-login-edit-wrap').data('order');

        if (/^[A-Za-z0-9]+$/.test(login))
        {
            $(current_parent).find('.proxy-auth-login').addClass('__load');
            $.post("/user/ajaxproxylogin", {login: login, order_id: order_id}, 
                function (data){
                    $(current_parent).find('.proxy-auth-login').removeClass('__load');
                    if (data == 'error') {
                        $(current_parent).find('.proxy-auth-login-edit-wrap').addClass('has-error');
                        $(current_parent).find('.proxy-auth-login-error').show();
                    } else {
                        $(current_parent).find('.proxy-auth-login-text').html(login);
                        $(current_parent).find('.proxy-auth-login-edit-wrap').hide();
                        $(current_parent).find('.proxy-auth-login-wrap').show();
                    }
            });
        }
        else
        {
            $(current_parent).find('.proxy-auth-login-edit-wrap').addClass('has-error');
            $(current_parent).find('.proxy-auth-login-error').show();
        }
    });
    /*-----------------------------------*/
    /*------ proxy auth password --------*/
    $('.proxy-auth-password-edit').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.proxy-auth-password-view-wrap').hide();
        $(current_parent).find('.proxy-auth-password-edit-wrap').show();
    });
    $('.proxy-auth-password-close').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.proxy-auth-password-edit-wrap').hide();
        $(current_parent).find('.proxy-auth-password-view-wrap').show();
    });
    $('.proxy-auth-password').blur(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.proxy-auth-password-edit-wrap').removeClass('has-error');
        $(current_parent).find('.proxy-auth-password-error').hide();
    });
    $('.proxy-auth-password-save').click(function(){
        var current_parent = $(this).parent().parent();
        var password = $(current_parent).find('.proxy-auth-password').val();
        var order_id = $(current_parent).find('.proxy-auth-password-edit-wrap').data('order');

        if (/^[A-Za-z0-9]+$/.test(password))
        {
            $(current_parent).find('.proxy-auth-password').addClass('__load');
            $.post("/user/ajaxproxypassword", {password: password, order_id: order_id}, 
                function (data){
                    $(current_parent).find('.proxy-auth-password').removeClass('__load');
                    if (data == 'error') {
                        $(current_parent).find('.proxy-auth-password-edit-wrap').addClass('has-error');
                        $(current_parent).find('.proxy-auth-password-error').show();
                    } else {
                        $(current_parent).find('.proxy-auth-password-text').html(password);
                        $(current_parent).find('.proxy-auth-password-edit-wrap').hide();
                        $(current_parent).find('.proxy-auth-password-view-wrap').show();
                    }
            });
        }
        else
        {
            $(current_parent).find('.proxy-auth-password-edit-wrap').addClass('has-error');
            $(current_parent).find('.proxy-auth-password-error').show();
        }
    });
    /*-----------------------------------*/
    /*--------- proxy autopay -----------*/
    $('.proxy-order-autopay__input').change(function(){
        var currentDom = $(this);
        var order_id = $(currentDom).data('id');

        $(currentDom).parent().addClass('proxy-order-autopay--processing');
        $(currentDom).prop('disabled', true);

        $.post("/user/ajaxproxyautopay", {
                autopay: $(currentDom).prop("checked") ? 1 : 0, 
                order_id: order_id
            }, 
            function (data){
                $(currentDom).parent().removeClass('proxy-order-autopay--processing');
                $(currentDom).prop('disabled', false);
        });
    });
    /*-----------------------------------*/
    /*---------- ticket answer ----------*/
    $('.ticket-template-title').click(function(){
        var text = $(this).data('text');
        var targetField = $('.ticket-answer-template').data('target');

        if (text && targetField) {
            var oldVal = $(targetField).val();
            $(targetField).val(oldVal + '\n\n' + text);
        }
    });
    /*-----------------------------------*/
    /*--------- proxy admin create ------*/
    function proxy_admin_handler() {
        var country = $('#proxy-admin-country').val();
        var term = $('#proxy-admin-term-id').val();
        var countIps = $('.proxy-admin-ip-checkbox:checked').length;

        var item = countries[country] || {count: 0, buy: 0, prolong: 0};
        var countDays = terms[term] || 0;
        var amountBuy = 1 * item.buy;
        var amountProlong = 1 * item.prolong;
        var needAmount = (item.buy / 30) * countDays * countIps;

        $('.proxy-admin-price-description span.__buy').html(item.buy);
        $('.proxy-admin-price-description span.__prolong').html(item.prolong);

        $('.proxy-admin-price-need span').html(Math.ceil(needAmount * 100) / 100);
    }

    $('body').on('change', '.proxy-admin-ip-checkbox', proxy_admin_handler);
    $('#proxy-admin-term-id').change(proxy_admin_handler);

    $('#proxy-admin-country').change(function(){
        var country = $('#proxy-admin-country').val();

        $('.proxy-admin-ip-list').addClass('__load');

        $.post('/proxy-order/ajaxgetfreeip', {countryId: country}, function (data){
            $('.proxy-admin-ip-list').removeClass('__load');

            $('.proxy-admin-ip-list').html(data);

            proxy_admin_handler();
        });

    });

    $('#proxy-admin-is-test').change(function(){
        if ($(this).prop('checked')) {
            $('#proxy-admin-term-id').val(2); // 3 days
            $('#proxy-admin-is-take').prop('checked', false);

            $('#proxy-admin-term-id, #proxy-admin-is-take').prop('disabled', true);
        } else {
            $('#proxy-admin-term-id, #proxy-admin-is-take').prop('disabled', false);
        }

        proxy_admin_handler();
    });

    $('#proxy-admin-form').submit(function(){
        var success = true;

        // ip checked
        $('.proxy-admin-ip-checkbox').parent().parent().removeClass('has-error has-success');

        if ($('.proxy-admin-ip-checkbox:checked').length) {
            $('.proxy-admin-ip-checkbox').parent().parent().addClass('has-success');
        } else {
            $('.proxy-admin-ip-checkbox').parent().parent().addClass('has-error');
            success = false;
        }

        return success;
    });

    if ($('#proxy-admin-form').length)
    {
        $('#proxy-admin-country').change();
    }
    /*-----------------------------------*/
    /*--------- admin mailing -----------*/
    if ($('#mailing-type-field').length) {
        function mailingTypeChangeHandler() {
            var type = $('#mailing-type-field').val();
            var dateFrom = $('#mailing-date-from').val();
            var dateTo = $('#mailing-date-to').val();

            if (type == 'registration_date') {
                $('.date-register-container').show(300);
            } else {
                $('.date-register-container').hide(300);
            }

            $.post("/admin/ajaxcountmailing", { type, dateFrom, dateTo }, function (data) {
                $('.admin-mailing__count span').html(data.count);
            });
        }

        $('#mailing-type-field').change(mailingTypeChangeHandler);
        $('#mailing-date-from').change(mailingTypeChangeHandler);
        $('#mailing-date-to').change(mailingTypeChangeHandler);
        mailingTypeChangeHandler();
    }
    /*-----------------------------------*/
    /*-------- buy resident proxy -------*/
    function buy_resident_proxy_handler() {
        // origin amount

        $('.buy-resident-proxy-phone-field').removeClass('has-error has-success');

        var tariffId = $('#buy-resident-proxy-tariff').val();
        var balance = +$('#balance-id').val();
        var amount = tariffPrice[tariffId];

        // need to pay

        var amountDiscount = amount;

        if (common_promocode_discount) {
            amountDiscount = amountDiscount * (100 - common_promocode_discount) / 100;
            amountDiscount = Math.ceil(amountDiscount * 100) / 100;
        }

        $('.buy-resident-proxy-price-need span').html(amountDiscount);

        if (balance) {
            if (balance >= amountDiscount) {
                $('.buy-resident-proxy-value-desc').html(l10n.fromBalance + ' ' + amountDiscount + ' $');
            } else {
                $('.buy-resident-proxy-value-desc').html(l10n.fromBalance + ' ' + balance + ' $<br>' + l10n.needToPay + ' <b>' + Number((amountDiscount - balance).toFixed(2)) + ' $</b>');
            }
        }

        $('.way-field').hide();
        $('.buy-resident-proxy-phone-field').hide();
        $('.submit-amount').html('');
        $('.payment-parts').html('');

        if (amountDiscount > balance) {
            $('.way-field').show();
            var provider = $('input[name=way_id]:checked').val();

            if (provider == 'qiwi')
                $('.buy-resident-proxy-phone-field').show();
            else
                $('.buy-resident-proxy-phone-field').hide();

            if (provider == 'coinpayments')
                $('.coinpayments-field').show();
            else
                $('.coinpayments-field').hide();

            var result = get_resident_proxy_final_amount(provider, Number((amountDiscount - balance).toFixed(2)));

            $('.submit-amount').html(result.amount + ' ' + result.currency);
            $('.payment-parts').html(getPaymentPartsDesc(provider, result.amount, result.currency));
        }
    }

    function get_resident_proxy_final_amount(provider, amount) {
        var usd = $('#usd-id').val();
        var bitcoin = $('#bitcoin-id').val();
        var amount_final = amount;
        var currency_final = 'USD';
        switch (provider) {
            case 'rwebmoney':
                currency_final = 'WMR';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'yandex':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                //amount_final = Math.ceil(amount_final * 100) / 100;
                break;

            case 'qiwi':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'paypal_rus':
                currency_final = 'RUB';
                amount_final = Math.ceil(amount_final * usd * 100) / 100;
                break;

            case 'bitcoin':
                currency_final = 'BTC';
                amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                break;

            case 'perfect':
                currency_final = 'PMUSD';
                break;

            case 'zwebmoney':
                currency_final = 'WMZ';
                break;

            case 'coinpayments':
                var coinpaymentsId = $('#buy-resident-coinpayments-select').val();
                var coinpaymentsRate = coinpayments[+coinpaymentsId];

                currency_final = coinpaymentsRate.code;
                amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                break;
        }

        if ($('#commission_' + provider).length)
        {
            var commission = $('#commission_' + provider).val();
            amount_final = amount_final * (1 + commission * 1);
            if (provider == 'bitcoin')
                amount_final = Math.ceil(amount_final * 1000000) / 1000000;
            else
                amount_final = Math.ceil(amount_final * 100) / 100;
        }

        return {
            amount: amount_final,
            currency: currency_final,
        };
    };

    if ($('#buy-resident-proxy-form').length)
    {
        buy_resident_proxy_handler();
    }

    $('#buy-resident-proxy-tariff').change(buy_resident_proxy_handler);
    $('#buy-resident-proxy-form input[name=way_id]').change(buy_resident_proxy_handler);
    $('#buy-resident-coinpayments-select').change(buy_resident_proxy_handler);

    $('#buy-resident-proxy-promo').keyup(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode_timer = setTimeout(find_common_promocode, 1000, 'buy_resident_proxy', buy_resident_proxy_handler);
    });
    $('#buy-resident-proxy-promo').change(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('buy_resident_proxy', buy_resident_proxy_handler);
    });

    // check promo in init
    if ($('#buy-resident-proxy-promo').length && $('#buy-resident-proxy-promo').val()) {
        $('.common-promo-field').toggle(300);
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('buy_resident_proxy', buy_resident_proxy_handler);
    }

    $('#buy-resident-proxy-form').submit(function(){
        var success = true;
        var provider = $('#buy-resident-proxy-form input[name=way_id]:checked').val();

        // provider field
        if (provider == 'qiwi')
        {
            $('.buy-resident-proxy-phone-field').removeClass('has-error has-success');

            if ($('#buy-resident-proxy-phone').val()) {
                $('.buy-resident-proxy-phone-field').addClass('has-success');
            } else {
                $('.buy-resident-proxy-phone-field').addClass('has-error');
                success = false;
            }
        }

        $(this).attr('target', $('.way-field').is(':visible') ? '_blank' : '');

        return success;
    });
    /*-----------------------------------*/
    /*---------- buy check ip -----------*/
    if ($('#buy-check-ip-form').length)
    {
        checkip_calc_amount();
    }
    function checkip_calc_amount(){
        // calc origin amount

        var amount = Number($('#amount-id').val());
        var balance = Number($('#balance-id').val());

        if (common_promocode_discount) {
            amount = amount * (100 - common_promocode_discount) / 100;
            amount = Math.ceil(amount * 100) / 100;
        }

        $('.payment-price-need span').html(amount);

        var need_pay_text = '';
        var need_amount = Math.round((amount - balance) * 100) / 100;

        if (balance >= amount) {
            need_pay_text = l10n_will_be_taken + ' ' + amount + ' $';
        } else if (balance) {
            need_pay_text = l10n_will_be_taken + ' ' + balance + '$<br>' +
                l10n_will_need_to_pay + ' <b>' + need_amount + '$</b>';
        }

        $('.payment-value-desc').html(need_pay_text);

        // calc need amount

        var provider = $('#buy-check-ip-form input[name=way_id]:checked').val();

        $('.submit-amount').html('');
        $('.payment-parts').html('');

        if (provider == 'qiwi')
            $('.phone-field').show();
        else
            $('.phone-field').hide();

        if (provider == 'coinpayments')
            $('.coinpayments-field').show();
        else
            $('.coinpayments-field').hide();

        if (provider && need_amount > 0)
        {
            var  usd = $('#usd-id').val();
            var  bitcoin = $('#bitcoin-id').val();
            var amount_final = need_amount;
            var currency_final = 'USD';
            switch (provider) {
                case 'rwebmoney':
                    currency_final = 'WMR';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'yandex':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    //amount_final = amount_final / (1 - (0.005 / (1 + 0.005)));
                    //amount_final = Math.ceil(amount_final * 100) / 100;
                    break;

                case 'qiwi':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'paypal_rus':
                    currency_final = 'RUB';
                    amount_final = Math.ceil(amount_final * usd * 100) / 100;
                    break;

                case 'bitcoin':
                    currency_final = 'BTC';
                    amount_final = Math.ceil(amount_final * 1/bitcoin * 1000000) / 1000000;
                    break;

                case 'perfect':
                    currency_final = 'PMUSD';
                    break;

                case 'zwebmoney':
                    currency_final = 'WMZ';
                    break;

                case 'coinpayments':
                    var coinpaymentsId = $('#check-ip-coinpayments-select').val();
                    var coinpaymentsRate = coinpayments[+coinpaymentsId];

                    currency_final = coinpaymentsRate.code;
                    amount_final = Math.ceil(amount_final * 1/coinpaymentsRate.rate * 1000000) / 1000000;
                    break;
            }

            if ($('#commission_' + provider).length)
            {
                var commission = $('#commission_' + provider).val();
                amount_final = amount_final * (1 + commission * 1);
                if (provider == 'bitcoin')
                    amount_final = Math.ceil(amount_final * 1000000) / 1000000;
                else
                    amount_final = Math.ceil(amount_final * 100) / 100;
            }

            $('.submit-amount').html(amount_final + ' ' + currency_final);
            $('.payment-parts').html(getPaymentPartsDesc(provider, amount_final, currency_final));
        }
    };
    $('#buy-check-ip-form input[name=way_id]').change(checkip_calc_amount);
    $('#check-ip-coinpayments-select').change(checkip_calc_amount);
    $('#check-ip-promo').keyup(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode_timer = setTimeout(find_common_promocode, 1000, 'check_ip', checkip_calc_amount);
    });
    $('#check-ip-promo').change(function(){
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('check_ip', checkip_calc_amount);
    });

    // check promo in init
    if ($('#check-ip-promo').length && $('#check-ip-promo').val()) {
        $('.common-promo-field').toggle(300);
        clearTimeout(find_common_promocode_timer);
        find_common_promocode('check_ip', checkip_calc_amount);
    }

    $('#buy-check-ip-form').submit(function(){
        var success = true;
        var provider = $('#buy-check-ip-form input[name=way_id]:checked').val();

        if (provider == 'qiwi')
        {
            $('.phone-field').removeClass('has-error has-success');

            if ($('#payment-phone').val())
                $('.phone-field').addClass('has-success');
            else
            {
                $('.phone-field').addClass('has-error');
                success = false;
            }
        }

        return success;
    });
    /*-----------------------------------*/
    /*---------- common-promo -----------*/
    $('.common-promo-toggle').click(function(){
        $('.common-promo-field').toggle(300);
    });
    var find_common_promocode_timer;
    var common_promocode_discount = 0;
    function find_common_promocode(type, callback)
    {
        var promocode = $('.common-promo-field__input').val();
        if (promocode)
        {
            $('.common-promo-field__input').addClass('__load');
            $.post((langUrl || '') + "/payment/ajaxcheckpromocode", {promocode: promocode, type: type},
                function (data) {
                    $('.common-promo-field__input').removeClass('__load');
                    $('.common-promo-field').removeClass('has-error has-success');

                    if (data.error)
                    {
                        $('.common-promo-field').addClass('has-error');
                        $('.common-promo-field .help-block.__common-promo').html(data.error);
                        common_promocode_discount = 0;
                    }
                    else
                    {
                        $('.common-promo-field').addClass('has-success');
                        $('.common-promo-field .help-block.__common-promo').html(data.success);
                        common_promocode_discount = data.discount;
                    }

                    callback();
            }, 'json');
        }
        else
        {
            $('.common-promo-field').removeClass('has-error has-success');
            $('.common-promo-field .help-block.__common-promo').html('');
            common_promocode_discount = 0;

            callback();
        }
    };
    /*-----------------------------------*/
    /*------ resident auth login --------*/
    $('.resident-auth-login-edit').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.resident-auth-login-wrap').hide();
        $(current_parent).find('.resident-auth-login-edit-wrap').show();
    });
    $('.resident-auth-login-close').click(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.resident-auth-login-edit-wrap').hide();
        $(current_parent).find('.resident-auth-login-wrap').show();
    });
    $('.resident-auth-login').blur(function(){
        var current_parent = $(this).parent().parent();
        $(current_parent).find('.resident-auth-login-edit-wrap').removeClass('has-error');
        $(current_parent).find('.resident-auth-login-error').hide();
    });
    $('.resident-auth-login-save').click(function(){
        var current_parent = $(this).parent().parent();
        var login = $(current_parent).find('.resident-auth-login').val();

        if (/^[A-Za-z0-9]+$/.test(login))
        {
            $(current_parent).find('.resident-auth-login').addClass('__load');
            $.post("/user/ajaxresidentlogin", {login: login}, 
                function (data){
                    $(current_parent).find('.resident-auth-login').removeClass('__load');
                    if (data == 'error') {
                        $(current_parent).find('.resident-auth-login-edit-wrap').addClass('has-error');
                        $(current_parent).find('.resident-auth-login-error').show();
                    } else {
                        $(current_parent).find('.resident-auth-login-text').html(login);
                        $(current_parent).find('.resident-auth-login-edit-wrap').hide();
                        $(current_parent).find('.resident-auth-login-wrap').show();
                    }
            });
        }
        else
        {
            $(current_parent).find('.resident-auth-login-edit-wrap').addClass('has-error');
            $(current_parent).find('.resident-auth-login-error').show();
        }
    });
    /*-----------------------------------*/
    /*-------- resident generate --------*/

    var GenerateResidentController = {
        config: {
            country_field: '.order-resident-form__country',
            type_field: '.order-resident-form__type',
            count_field: '.order-resident-form__count',
            button: '.order-resident-form__submit',
            loading: 'generate-loading',
            table_container: '.order-resident-ip',
            download_form: '.resident-table__download-form',
            download_resident_ip: '.resident-table__download-form input[name="resident_ip_id"]',
            download_type: '.resident-table__download-form input[name="type"]',
            download_passwords: '.resident-table__download-form input[name="passwords"]',
        },

        init: function() {
            var self = this;
            var config = self.config;

            $(
                config.country_field + ',' +
                config.type_field + ',' +
                config.count_field
            ).on('focus', function() {
                $(this).closest('.form-group').removeClass('has-error');
            });

            $(config.type_field).on('change', function() {
                if ($(this).val() == 'session_ip') {
                    $(config.count_field).closest('.form-group').show();
                } else {
                    $(config.count_field).closest('.form-group').hide();
                }
            });

            $(config.button).on('click', function(e) {
                e.preventDefault();

                self.generate(this);

                return false;
            });
        },

        generate: function() {
            var self = this;
            var config = self.config;

            var container = $(config.button).parent();

            var country = $(config.country_field).val();
            var type = $(config.type_field).val();
            var count = Number($(config.count_field).val());

            if (type == 'session_ip' && (count <= 0 || count > 1000)) {
                $(config.count_field).closest('.form-group').addClass('has-error');
                return;
            }

            $(container).addClass(config.loading);

            $.post(
                (langUrl || '') + "/user/ajaxresidentgenerate",
                {
                    country: country,
                    type: type,
                    count: count,
                },
                function (data) {
                    $(container).removeClass(config.loading);

                    $(config.table_container).html(data.html);

                    $(config.download_resident_ip).val(data.resident_ip_id);
                    $(config.download_type).val(data.type);
                    $(config.download_passwords).val(JSON.stringify(data.passwords));
            });
        },
    };

    GenerateResidentController.init();

    /*-----------------------------------*/
    /*------- resident admin create -----*/
    function resident_admin_handler() {
        var tariffId = $('#resident-admin-tariff').val();

        $('.resident-admin-price-need span').html(tariffPrice[tariffId]);
    }

    $('#resident-admin-tariff').change(resident_admin_handler);

    if ($('#resident-admin-tariff').length) {
        resident_admin_handler();
    }

    $('#resident-admin-is-test').change(function() {
        if ($(this).prop('checked')) {
            $('#resident-admin-tariff').val(1);
            resident_admin_handler();

            $('#resident-admin-tariff').prop('disabled', true);
        } else {
            $('#resident-admin-tariff').prop('disabled', false);
        }
    });
    /*-----------------------------------*/
    /*----------- event notice ----------*/
    $('.event-notice__item-cancel').click(function() {
        var eventId = $(this).data('id');

        $(this).closest('.event-notice__item').remove();

        $.post("/event/hide-notice", {
            eventId: eventId,
        });
    });
    /*-----------------------------------*/
});

function sendMetrika(goal)
{
    if (goal && window.yandexMetrika)
        window.yandexMetrika.reachGoal(goal);
}
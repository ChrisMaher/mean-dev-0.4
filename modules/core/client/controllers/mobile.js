/**
 * Created by Chris on 10/04/2016.
 */

'use strict';

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }

};


if ( isMobile.Android() ) {
    document.location.href = "https://play.google.com/store/apps/details?id=com.saveme.chris";
}
else if(isMobile.iOS())
{
    document.location.href = "https://itunes.apple.com/us/app/saveme.ie/id1100709881?ls=1&mt=8";
}
else if(isMobile.BlackBerry())
{
    document.location.href = "https://play.google.com/store/apps/details?id=com.saveme.chris";
}else if(isMobile.Windows())
{
    document.location.href = "https://www.microsoft.com/store/apps/9NBLGGH4RFMC";
}

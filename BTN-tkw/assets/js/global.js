"use strict"


window.addEventOnElement = ($elements, eventType, callback)=>{
    for(const $element of $elements){
        $element.addEventListener(eventType, callback)
    }
}


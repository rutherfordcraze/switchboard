/*
TypeMedia Studio Indicator v1.1
Rutherford Craze
CC BY 4.0
181011

Detects under- or over-flowing text in the list of names, and nudges the font width property until it fits.
*/

var wghtMin = 0, wghtMax = 1000, wght = wghtMin;
var wdthMin = 0, wdthMax = 1000, wdth = wdthMin;

var resolution = 5;

var lines = document.getElementsByClassName("fullname");
var list = document.getElementById("list");
var lstyle = list.currentStyle || window.getComputedStyle(list);

var offset = parseFloat(lstyle.paddingLeft);
var listWidth = list.offsetWidth - offset * 2;

// Returns whichever line currently has the greatest offset width
function GetLongestLine() {
    var longestLine = 0;
    for(var i = 0, l = lines.length; i < l; i ++) {
        if(lines[i].offsetWidth > lines[longestLine].offsetWidth) {
            longestLine = i;
        }
    }
    return longestLine;
}

// Iterate through all lines and resettle them until all fit in the correct width
function UpdateFonts() {
    offset = parseFloat(lstyle.paddingLeft);
    listWidth = list.offsetWidth - offset * 2;

    ResettleLine(GetLongestLine());
    
    for (var i = 0, l = lines.length; i < l; i++) {
        UpdateLine(i);
    }
}

// Detect over- or under-flowing lines and push them one resolution step at a time in the right direction
function ResettleLine(lineID) {
    if(lines[lineID].offsetWidth <= listWidth - resolution / 2 && wdth <= wdthMax) {
        wdth += resolution;
        UpdateLine(lineID);
        ResettleLine(lineID);
    } else if(lines[lineID].offsetWidth >= listWidth + resolution / 2 && wdth >= wdthMin) {
        wdth -= resolution;
        UpdateLine(lineID);
        ResettleLine(lineID);
    }
}

// Redraw line with new weight and width
function UpdateLine(lineID) {
    if(lines[lineID].parentElement.className == "out") { wght = wghtMin; } else { wght = wghtMax; }    
    lines[lineID].style["font-variation-settings"] = "'wdth' " + wdth + ", 'wght' " + wght;
}

// Wait a few milliseconds for CSS to update line widths, before updating fonts
// In theory, read.js will do this for us, but it wasn't 100% reliable when I was testing it on some devices
setTimeout(function(){UpdateFonts()}, 500);

// Update on page resize (resource-intensive, disable to update only on page reload)
window.addEventListener('resize', function(){
    resolution = 10;
    UpdateFonts();
});
/*
TypeMedia Studio Indicator v1.0
Rutherford Craze
CC BY 4.0
180923

Reads the data.txt file uploaded by Pi Zero in the t]m studio and displays its contents.
*/

// Replace these names with your class, in the same order as they appear on the switchboard.
var names = [
    'Rutherford Craze',
    'Ethan Cohen',
    'Michelangelo Nigra',
    'Alexis Boscariol',
    'Ryan Bugden',
    'Céline Odermatt',
    'Joona Louhi',
    'Eva Abdulina',
    'Ricard Garcia',
    'Luke Charsley',
    'Anya Danilova',
    'Fabiola Mejía',
];

function LoadContent() {
    
    var list = document.getElementById('list');
    list.innerHTML = "";
    
    $.ajax({
        url: '/data.txt',
        dataType: 'json',
        async: false,
        success: function(data) {
            
            // Go through the data file, and add a list item for each student in the class
            for (var i = 0, l = data.length; i < l; i ++) {
                if(data[i] == 1) { // Student is in the TypeMedia studio today
                    list.innerHTML += "<h2 class='in'><span class='fullname'>" + names[i] + "</span></h2>";
                } else { // Student is not in the TypeMedia studio today
                    list.innerHTML += "<h2 class='out'><span class='fullname'>" + names[i] + "</span></h2>";
                }
            }
            
        }
    });
    
    // Once the list is populated, get stretch.js to update the fonts again
    UpdateFonts();
}

LoadContent();


// Reload the data file every 10 seconds. This is not a good way of doing this, but it is a quick one
setInterval(function() {
    LoadContent();
}, 10000);
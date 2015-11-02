# soundcloud
excesie api use of the service to search and play songs

as this is a short project i have used:




- handlebars-js for tempting

- bootstrap 3 for basic design

- organized the code as a jQuery plugin




you can change the basic settings in 2 ways:




1. change the main script ("songsApp.config" object inside the "init" method)

2. call the "plugin" and passing your own custom settings that will run over the default settings (e.g app id, elements selectors...)




in this version:




- user can just type the string he wants to search for,




  search action  will be triggered on every key press in the search input (wanted to do something dynemic and different)




- user can navigate between search results, there are 6 results per UL view, you can easily change this via the init method settings       

  object




- when user clicks on a track from the list if will open an iframe player that will automatically play the song




- i have added a default image for tracks that doesn't have an image




- didn't handled the "tile" view, way i would have done this was by adding bootstrap css classes that will display the LI items as tiles and trigger theses classes by a click event on the "tiles view" button

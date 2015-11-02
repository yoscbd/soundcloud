(function($) {
    //counters:
    var verticalIndex = 0;

    //plugin wrapper:
    var songsApp = {

        // 1. initialize function:
        init: function(settings) {
            songsApp.config = {

                serachCta: $("#search-cta"), // search CTA element
                searchResults: $("#search-results"), // search results section
                songsTemplate: $('#songs-template').html(), // handlebar template for track display
                serchString: $("#search-string"), // serach string input element
                selectedTrack: $("#current-track"), // selected track box
                defaultImg: 'default.jpg', // empty images defult src
                tracksPlayer: $("#track-player"), // iframe player for tracks
                defaultPlayerBaseUrl: 'https://w.soundcloud.com/player/?auto_play=true"&url=',
                tracksListContainer: $("#ul-wrapper"), // containing div of tracks list UL
                itemsPerScrenn: 6, //number of tracks to display on each screen


            };

            // Allow overriding the default config
            $.extend(songsApp.config, settings);

            //login and initiate  the SoundCloud service:
            SC.initialize({
                client_id: 'd652006c469530a4a7d6184b18e16c81'
            });

            // initiate the first service that populate the data in the page
            songsApp.populatePage();

            //add delegation to <li> items in search results
            songsApp.config.searchResults.delegate('li', 'click', function() {
                var selectedTrack = $(this);
                console.log('temp selectedTrack is: ' + selectedTrack.attr('id'));

                //get the current track image:
                var selectedTrackImage = selectedTrack.attr('data-trackImage');
                console.log('temp selectedTrackImage is: ' + selectedTrackImage);

                //get the current track uri so we can play it:
                var selectedTrackUri = selectedTrack.attr('data-trackUri');
                console.log('temp selectedTrackUri is: ' + selectedTrackUri);

                //call the service that will handle displaying selected tracks
                songsApp.displaySelectedTrack(selectedTrack, selectedTrackImage, selectedTrackUri);

            });

        },


        // 2.populate all items method :
        populatePage: function() {
            // set a dely for when the user press a key to prevent the keyup event form triggering more then once
            var delay = (function() {
                var timer = 0;
                return function(callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            })();

            // perform track search when user enter strings to the search input
            songsApp.config.serchString.on("keyup", function() {

                //call the delay function with the keyup functionality inside of it
                delay(function() {
                    // reset search results box and exit if the search box is empty:
                    if (songsApp.config.serchString.val() == "") {
                        console.log('empty string');
                        //clear search results if search box is empty
                        songsApp.config.searchResults.empty();
                        //clear img src if search box is empty
                        songsApp.config.selectedTrack.children('img').attr('src', '');
                        return;
                    } else {
                        songsApp.config.searchResults.empty();

                    };

                    //reset the tracks array:
                    //var audioArry = [];
                    //console.log('audioArry length: ', audioArry.length);

                    //save the search box text
                    var serchStringResult = songsApp.config.serchString.val();
                    console.log('serchStringResult: ', serchStringResult);

                    //call the SoundCloud service
                    SC.get('/tracks', {
                        q: serchStringResult,
                    }, function(tracks) {
                        console.log('number of trackes forn the colud: ', tracks.length);

                        //audioArry = tracks;
                        //console.log('audioArry now is: ' ,audioArry);

                        $.each(tracks, function(i, track) {
                            //console.log('total tracks:',songsApp.config.searchResults.children('li').length);
                            songsApp.config.searchResults.append(Mustache.render(songsApp.config.songsTemplate, track));

                        });
                        //calculate and set UL element height:
                        var setUlDesignData = songsApp.tracksNavigation();
                        songsApp.config.tracksListContainer.animate({
                            height: (setUlDesignData[3]),
                        }, 800, function() {
                            // Animation complete.
                        });


                        //songsApp.config.tracksListContainer.height(168);
                        console.log('Ul height: ', songsApp.config.tracksListContainer.height());

                    });


                }, 200);

            });

        },

        // 3.display track image and play it :	
        displaySelectedTrack: function(trackToDisplay, trackImg, trackUri) {
            var slelctedTrackImage = songsApp.config.selectedTrack.children('img');
            slelctedTrackImage.attr('src', trackImg);
            if (slelctedTrackImage.attr('src') == '') {
                slelctedTrackImage.attr('src', songsApp.config.defaultImg);
            };

            var currentPlayer = songsApp.config.tracksPlayer;
            currentPlayer.attr('src', songsApp.config.defaultPlayerBaseUrl + trackUri);

            //display the hidden player:
            songsApp.config.tracksPlayer.show();


        },

        //4. handle navigation service - this service wil calulate all scrolling data for naviagtion and return an array with all nedded data for scrolling up \ down
        tracksNavigation: function() {

            //total number of tracks returned from the server:
            var totalTracks = songsApp.config.searchResults.children('li').length;
            console.log('totalTracks : ', totalTracks);

            // calculate the total number of screens to scroll 
            var topToScroll = Math.round(totalTracks / songsApp.config.itemsPerScrenn);
            console.log('topToScroll : ', topToScroll);

            //calaulate the height of an LI element inside our list
            var liHeight = songsApp.config.searchResults.children('li').outerHeight(true);
            console.log('liHeight : ', liHeight);

            //calculate the total height of all LI items
            var totalLiHeight = liHeight * songsApp.config.itemsPerScrenn;
            console.log('totalLiHeight : ', totalLiHeight);

            //reset the current top position of the UL element
            var currentTop = songsApp.config.searchResults.css('top');

            //calculate the total scroll nedded to be done for the contaner div of the UL elemnt:
            var totalScroll = parseInt(currentTop) + totalLiHeight; //**set the ampunt of scroll
            console.log('totalScroll : ', totalScroll);

            //create an array that will be used by the next and previous button in order to scroll the results up\down:
            var navigationData = [verticalIndex, topToScroll, totalScroll, totalLiHeight]
            return navigationData;

        },




    }

    $(document).ready(function() {

        //call the initializing service:
        songsApp.init();

        //reset the UL top position	(list containing all tracks LI):						
        songsApp.config.searchResults.css({
            top: 0,
        });

        //handle "next" click navigation:	
        $('#next-track').on("click", function() {
            //call the service that calculate all navigation data	
            var topNavigationData = songsApp.tracksNavigation();
            if (topNavigationData[0] < (topNavigationData[1] - 1)) {
                $('#search-results').animate({
                    top: (topNavigationData[2] * -1),
                }, 1000, function() {
                    // Animation complete.
                });

                verticalIndex++
            }
        });

        //handle "previous" click navigation:		  
        $('#prv-track').on("click", function() {
            var bottomNavigationData = songsApp.tracksNavigation();
            if (bottomNavigationData[0] !== 0) {
                $('#search-results').animate({
                    top: (bottomNavigationData[2]),
                }, 1000, function() {
                    // Animation complete.
                });

                verticalIndex--
            }

        });

        //triger player visibility when user clicks on track image

        // songsApp.config.selectedTrack.on("click", function() {
        //     songsApp.config.tracksPlayer.show();
        // });




    });

})(jQuery);

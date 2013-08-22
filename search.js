
/**
 * This is my fancy filtering script for the downloads page
 * written in javascript using JQUERY
 *
 * -Gage Peterson justgage@gmail.com
 *
 */
$(function () {

    var searchtext = "";
    var numFound = 0;
    $("#file-search").focus();

    /***************************************************************************
     * FUNCTION: This will update the amount of documents in each category
     */

    function allDocsCount() {
        $(".category").each(function () {
            numFound = $(this).find(".download-item").length;
            $(this).find(".num-results").html("(" + numFound + ")");

        });
    }

    allDocsCount();

    /***************************************************************************
     * FUNCTION this will rebind clicks and other events after changed html
     */

    function bindClick() {

        ///bind click to categories opening and closing
        $(".category").on("click", "a", function () {
            console.log("clicked on a category");
            $(this).parent().find(".cat-list").slideToggle(300);
        });
        
        //Show the translations when you click the button
        $(".lang-button").click(function () {
            $(this).parent().find(".lang-list").slideToggle(200);
        });

        //clears when you push the clear button
        $(".clear-button").click(function () {
            $("#file-search").val('');
            $("#file-search").focus();
            $(".download-item").show();
            $(".none-found").hide();

            allDocsCount();
        });

        $(".lang-button").hover(function() {
            console.log("hover!");
            $(this).toggleClass("lang-button-hover");
        });
    }

    bindClick();

    /***************************************************************************
     * FUNCTION  this will reload the categories
     * which is used in the ajax call when the market is changed
     */

    function reload_downloads_list(json) {
        var html = "";

        //go through each category
        var l = json.categories.length;

        for (var i = 0; i < l; i++) {
            console.log("STARTING CAT:" + i + " out of " + l );
            var cat = json.categories[i];
            console.log("CAT:  " + cat.name);

            // add a category
            html = html + '<li class="category"> <a class="cat-title" href="#aaa">'
            + cat.name
            + '<span class="num-results">(...)</span> </a>'
            + '<ul class="cat-list"> ';

            // go through each file
            console.log("length" + cat.files.length)
            for (var j = 0, ll = cat.files.length; j < ll; j++) {
                var file = cat.files[j];
                //console.log("   FILE: " + file.filename);

                //add an menu item
                html +=  '<li class="download-item">'
                + '<a target="_blank" href="files/">' + file.filename + "." + file.filetype + '</a>'
                + '<p class="lang-button">[ Translations ]</p>'
                + '<br style="display:inline; clear:both;" />'
                + '<ul class="lang-list">';

                var langNum = 0;

                //languages list
                html += "<table><tbody>";
                for (var k = 0, z = file.languages.length; k < z; k ++) {
                    var langFile = file.languages[k];


                    if (langFile['url'] !== "#") {
                        var filename = "----";
                        if (langFile['url'].indexOf("/") !== -1) {
                            filename = decodeURIComponent(langFile['url'].slice(langFile['url'].lastIndexOf("/") + 1));
                        }
                        html += '<tr><td>' + langFile["name"] + '</td><td><a href="'+ langFile["url"] + '">'  + filename + '</a></td></tr>';

                        langNum++;
                    }


                }

                html += "</table></tbody>";

                if (langNum == 0) {
                    html += "<li>No Translations</li>";

                }


                html = html + '</ul></li>'; //end lang list


            }

            html += "<li class='none-found'> No Search Results <a href='#'  class='clear-button' >clear</a> </li>";
            
            //close category
            html = html + '</ul>';
        }

        $('#downloads-list').hide();
        $('#downloads-list').html(html);
        $('#downloads-list').fadeIn();

        bindClick();
        allDocsCount();

    }

    function ajax_market(market) {

        //empty the list of items
        $('#downloads-list').html("<li class='none-found'>Loading...</li>");
        $('.none-found').show();

        console.log("OPTION = " + market)


        $.ajax({
            url: "download-api.php",
            data: {
                market: market
            },
            type: "POST",
            dataType: "json",
            success: function (json) {
                console.log(json);

                reload_downloads_list(json);

                console.log(json.categories[0].name)
            },
            error: function (xhr, status) {
                $('#downloads-list').html("<li class='none-found'>Sorry Loading List Failed... Please refresh and try again<br /><small>" + status + "</small></li>");
                $('.none-found').show();
            },
            complete: function (xhr, status) {
                //console.log("ajax complete");
            }
        });

    }

    function ajax_all(market) {

        //empty the list of items
        $('#downloads-list').html("<li class='none-found'>Loading...</li>");

        console.log("OPTION = " + market)


        $.ajax({
            url: "download-api.php",
            data: {
                market: "all-list"
            },
            type: "POST",
            dataType: "json",
            success: function (json) {

                console.log(json);

                /*TODO something json */

            },
            error: function (xhr, status) {
                $('#downloads-list').html("<li class='none-found'>Sorry Loading List Failed... Please refresh and try again</li>");
            },
            complete: function (xhr, status) {
            }
        });

    }


    $("#market-select").change(
        function () {
            var market = $(this).val()

            ajax_market(market);

        });

    ajax_market($("#market-select").val());




    //clear the search and put cursor in the box

    $("#hide-all-button").click(function () {

       
        // if all are visible hide them
        if ($('.cat-list:visible').length !==  0) {
            $(".lang-list").hide();
            $(".cat-list").hide();
            $(".none-found").hide();
        }
        else { // if all are hidden show
            $(".cat-list").show();
            $("#file-search").val('');
            $(".download-item").show();
            $(".none-found").hide();
        }
    });


    //this will get the input's value
    $("#file-search").keyup(function () {

        $(".lang-list").hide();
        $(".arrow").show();
        $(".cat-list").show();

        var numFound = 0;

        // get users search term
        searchtext = $(this).val().toUpperCase();


        if (searchtext.length > 0) {
            $(".download-item").hide();


            $(".category").each(function () {
                numFound = 0;
                $(this).find(".download-item").each(function () {
                    // this will get an uppercase string to search in.
                    var haystack = $(this).find("a").text().toUpperCase();

                    var isFound = haystack.indexOf(searchtext);

                    if (isFound !== -1) {
                        numFound++;
                        $(this).show();
                    }

                });

                $(this).find(".num-results").html("(" + numFound + ")");

                if (numFound === 0) {
                    $(this).find(".none-found").show();
                } else {
                    $(this).find(".none-found").hide();
                }
            });


        } else {
            allDocsCount();
            $(".download-item").show();
            $(".none-found").hide();

        }

    });

});

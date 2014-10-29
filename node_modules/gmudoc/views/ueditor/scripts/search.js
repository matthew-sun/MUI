/**
 * 提供API搜索功能
 * @file
 */

jQuery( function ( $ ) {

    //panle open state
    var PANEL_OPEN_STATE = false,
        isInput = false,
        $searchPanel = $( "#searchPanel" ),
        $searchInput = $( "#searchInput" ),
        $elevator = $( "#elevator" ),
        complete = new AutoComplete();

    //初始化complete
    ( function () {

        complete.setSource( _source );

        complete.bindInput( $searchInput );

    } )();

    $searchInput.on( "close", function () {
        hidePanel();
    } ).on( 'focus', function () {
        isInput = true;
        $( this ).addClass( "focus" );
    } ).on( 'blur', function () {
        isInput = false;
        $( this ).removeClass( "focus" );
    } );

    $(document).on("keydown", function ( evt ) {

        if ( isInput ) {
            return;
        }

        //ctrl + q
        if ( evt.ctrlKey && evt.keyCode === 81 ) {

            !PANEL_OPEN_STATE ? showPanel() : hidePanel();


        //esc close
        } else if ( evt.keyCode === 27 ) {

            hidePanel();

        }


    }).on( "click", function () {
        complete.hide();
    } );

    //api item click
    $(".api-wrap").delegate( ".api-item", "click", function () {

        complete.to( this.href.split("#")[1] );
        return false;

    } );

    //Elevator
    $( document ).on( "scroll", function () {

        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        if ( scrollTop > 0 ) {

            $elevator.fadeIn();

        } else {

            $elevator.fadeOut();

        }

    } );

    function hidePanel () {
        PANEL_OPEN_STATE = false;
        $searchPanel.hide();
        $searchInput.blur();
    }

    function showPanel () {
        PANEL_OPEN_STATE = true;
        $searchPanel.show();
        $searchInput.focus();
    }

} );

function handleToggled( toggle, details, options ) {
	const open = details[ 0 ].open;
	details.toggleClass( 'mw-collapsed', !open );
	toggle
		.attr( 'aria-expanded', open )
		.toggleClass( 'mw-collapsible-toggle-collapsed', !open )
		.find( '.mw-collapsible-text' )
		.text( open ? options.toggleText.collapseText : options.toggleText.expandText );
}

function makeToggle( options ) {
	return $( '<span class="mw-collapsible-toggle mw-collapsible-toggle-default" role="presentation" aria-hidden="true">' )
		.addClass( 'mw-collapsible-toggle' )
		.append( $( '<span class="mw-collapsible-text">' )
			.text( options.toggleText.collapseText ) );
}

function makeCollapsible( el ) {
	const details = $( el );

	if ( details.data( 'mw-made-collapsible' ) ) {
		// Already done
		return;
	}

	const options = {
		toggleText: {
			expandText: details.attr( 'data-expandtext' ) || mw.msg( 'collapsible-expand' ),
			collapseText: details.attr( 'data-collapsetext' ) || mw.msg( 'collapsible-collapse' )
		}
	};

	let summary = details.find( '> summary:eq(0)' );
	if ( summary.length === 0 ) {
		// Make our own
		summary = $( '<summary>' )
			.prependTo( details );
	}

	const collapsible = {
		collapse: () => {
			el.open = false;
		},
		expand: () => {
			el.open = true;
		},
		toggle: () => {
			el.open = !el.open;
		}
	};

	// Add mw-collapsible compatible classes and API
	details
		.data( 'mw-made-collapsible', true )
		.data( 'mw-collapsible', collapsible )
		.addClass( 'mw-collapsible mw-made-collapsible' );

	// If the user added non-semantic class="mw-collapsed", close it for them
	if ( details.hasClass( 'mw-collapsed' ) && el.open ) {
		el.open = false;
	}

	// Find where we need to put the toggle link
	let toggle = summary
		.find( '> .mw-collapsible-toggle, .mw-collapsible-toggle-placeholder' )
		.first();

	if ( toggle.length === 0 ) {
		// Make our own
		toggle = makeToggle( options )
			.prependTo( summary );
	}

	// Replace placeholder with a real toggle
	if ( toggle.hasClass( 'mw-collapsible-toggle-placeholder' ) ) {
		const newToggle = makeToggle( options );
		toggle.replaceWith( newToggle );
		toggle = newToggle;
	}

	// Set up toggle state
	handleToggled( toggle, details, options );

	details.on( 'toggle', ( e ) => {
		// In case the element is cloned, we need to find the correct matching toggle
		const firstToggle = $( e.target )
			.find( '> summary .mw-collapsible-toggle' )
			.first();
		handleToggled( firstToggle, details, options );
	} );

	// Fire hook to be compatible with jquery.makeCollapsible.js
	mw.hook( 'wikipage.collapsibleContent' )
		.fire( el );
}

function handleHashChange() {
	const fragment = mw.util.getTargetFromFragment();
	if ( !fragment ) {
		// The fragment doesn't exist
		return;
	}

	const parents = $( fragment ).parents( 'details:not([open])' );
	if ( !parents.length ) {
		// The fragment is not in a collapsed element
		return;
	}

	// Expand collapsed parents
	parents.each( ( _, el ) => {
		const details = /** @type {JQuery<HTMLDetailsElement>} */ ( $( el ) );
		details[ 0 ].open = true;
	} );

	// Scroll to the fragment
	fragment.scrollIntoView();
}

mw.hook( 'wikipage.content' )
	.add( () => {
		// Make sure the browser supports <details> toggle event, if not, we’ll gracefully degrade
		const test = document.createElement( 'details' );
		if ( !( 'ontoggle' in test ) ) {
			$( 'html' )
				.addClass( 'details--not-available' );
			return;
		}

		// Set up details elements
		$( '.details--root:not(.mw-made-collapsible)' )
			.each( ( _, el ) => makeCollapsible( el ) );

		// Handle hashchange if browser doesn’t support hidden-until-found
		if ( !( 'onbeforematch' in document.body ) ) {
			handleHashChange();
			$( window ).on( 'hashchange', handleHashChange );
		}
	} );

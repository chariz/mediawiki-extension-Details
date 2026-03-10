<?php

declare( strict_types=1 );

namespace MediaWiki\Extension\Details;

use MediaWiki\MediaWikiServices;
use PPFrame;
use Parser;

class Summary {
	/* @var bool */
	private static $compatibilityMode = true;

	public static function parserHook( ?string $input, array $args, Parser $parser, PPFrame $frame ) {
		$config = MediaWikiServices::getInstance()->getMainConfig();
		self::$compatibilityMode =  $config->get( 'DetailsMWCollapsibleCompatibility' );

		// Add tracking category
		$parser->addTrackingCategory( 'details-category' );

		// Add modules for collapsible handling
		if ( self::$compatibilityMode === true ) {
			$parser->getOutput()->addModuleStyles( [ 'ext.details.styles' ] );
			$parser->getOutput()->addModules( [ 'ext.details' ] );
		}

		// Render content, stripping <p> if it's the outermost tag
		$body = trim( $parser->recursiveTagParse( $input, $frame ) );
		$body = Parser::stripOuterParagraph( $body );

		// Sanitize to attributes that would be valid on a <div>
		$sanitizer = class_exists( 'MediaWiki\Parser\Sanitizer' ) ? 'MediaWiki\Parser\Sanitizer' : 'Sanitizer';
		$attrs = $sanitizer::safeEncodeTagAttributes( $sanitizer::validateTagAttributes( $args, 'div' ) );

		return '<summary ' . $attrs . '>' .
			$body .
			'</summary>';
	}
}

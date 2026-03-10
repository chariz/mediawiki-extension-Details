<h2 align="center">
<img src="https://github.githubassets.com/images/icons/emoji/unicode/1f53d.png">
<br>
Details
</h2>

**Semantic, browser-supported collapsible content in MediaWiki articles using &lt;details&gt; and &lt;summary&gt; tags.**

## Usage

Simply use the standard [`<details>`](https://developer.mozilla.org/docs/Web/HTML/Element/details) and [`<summary>`](https://developer.mozilla.org/docs/Web/HTML/Element/summary) tags in your wiki content. The `<details>` element wraps the entire collapsible area, and the `<summary>` element acts as the expando.

When the browser is requested to jump to content found within a `<details>` element, it will automatically be expanded. This includes anchors, find in page, and Chrome’s “copy link to highlight” feature.

For example:

```wikitext
<details>
<summary>Some crazy long content</summary>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore …
</details>
```

All HTML parameters MediaWiki supports on `<div>` elements are supported on `<details>` and `<summary>`. Additionally, you can use `<details open>` to expand the content by default.

See how it works on GitHub below:

<details>
<summary>Some crazy long content</summary>
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</details>

The Details extension takes the browser’s native support for `<details>` further by adding compatibility with [jquery.makeCollapsible](https://www.mediawiki.org/wiki/Manual:Collapsible_elements), better known by its class name, `mw-collapsible`.

Articles with collapsible content will be added to the **Pages using Details parser tag** tracking category.

### Parameter and template expansion

Because Details is a tag extension, it is expanded *before* templates and parser functions. As such, if you want to customise parameters on the `<details>` or `<summary>` tags, you need to use the [`{{#tag:…}}`](https://www.mediawiki.org/wiki/Help:Magic_words#Miscellaneous) parser function:

```wikitext
{{#tag: details
 | {{#tag: summary
  | Some crazy long content
  | class={{{summaryclass|my-summary-class}}}
 }}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore …
 | class={{{detailsclass|my-details-class}}}
}}
```

Remember that the content comes **before** the parameters when using `{{#tag:…}}`.

## Compatibility

Supports MediaWiki 1.39 and later.

Browser support is required for collapsible content to work:

### Fully supported

All browsers as of 2017 are fully supported. Specifically, the [`HTMLDetailsElement` toggle event](https://caniuse.com/mdn-api_htmldetailselement_toggle_event) is required to implement the collapse/expand toggle button.

- Chrome 36+ (37+ on Android)
- Firefox 49+
- Safari 10.1+ (iOS 10.3+)

#### Auto-expanding
A more recent web platform addition is [“hidden until found”](https://html.spec.whatwg.org/multipage/interaction.html#interaction-with-details-and-hidden=until-found). This allows an element to be hidden, but still visible to features such find in page and anchor (hash) navigation. The browser reveals the element if relevant content is found in it. This is a desirable feature for hidden sections of an article.

- [Chrome 97+](https://chromestatus.com/feature/5032469667512320) (2021)
- [Firefox 139+](https://bugzilla.mozilla.org/show_bug.cgi?id=1724299) (2025)
- [Safari 26.2+](https://developer.apple.com/documentation/safari-release-notes/safari-26_2-release-notes#HTML) (2025)

As of version 1.1, the extension polyfills support for “hidden until found” for hash anchors. Polyfilling support for find in page and text highlights is unlikely to be possible.

### Partially supported

These browsers do not support the toggle event, but will [gracefully degrade](https://en.wikipedia.org/wiki/Fault_tolerance) to using the browser’s built-in toggling functionality. Clicking anywhere within the `<summary>` row will toggle the contents.

- Chrome 10+ (2011)
- Safari 6.0+ (2012, iOS 6.0+)

### No support

These browsers do not support `<details>` and `<summary>` at all. Contents of both tags will be displayed as-is.

- Internet Explorer
- EdgeHTML-based Edge (18 and earlier)
- Presto-based Opera (12 and earlier)
- Opera Mini

## Installation

Visit [Extension:Details](https://www.mediawiki.org/wiki/Extension:Details) on MediaWiki.org for current installation instructions.

## Configuration

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `$wgDetailsMWCollapsibleCompatibility` | `true` | Controls whether Details loads CSS and JavaScript to enhance the `<details>` and `<summary>` tags. This makes them act similar to `mw-collapsible`, and introduces the `wikicollapse` class, which styles much like a `wikitable`. If disabled, the browser’s default styling and behavior is used. |

## Credits

<p align="center">
<a href="https://chariz.com/">
<img src="https://chariz.com/img/chariz-logo-head@3x.png" width="166" height="60">
</a>
</p>

Developed by [Chariz](https://chariz.com/) for [The Apple Wiki](https://theapplewiki.com/):

* [Adam Demasi (@kirb)](https://github.com/kirb)

Partly based on [jquery.makeCollapsible](https://github.com/wikimedia/mediawiki/tree/master/resources/src/jquery), which is part of MediaWiki core.

Huge thanks to [alistair3149](https://github.com/alistair3149), who has been super supportive of The Apple Wiki since we started. I used his extension, [TabberNeue](https://github.com/StarCitizenTools/mediawiki-extensions-TabberNeue), as a template for this one.

## License

Licensed under the GNU General Public License, version 3.0 or later. Refer to [LICENSE.md](https://github.com/chariz/mediawiki-extension-Details/blob/main/LICENSE.md).

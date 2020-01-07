# Make sure all global variables used in a file are declared in the file-closure

## Why use it?

To follow [Drupal JavaScript coding standards](https://www.drupal.org/node/172169).

## Rule Details

Make sure everything used is declared properly. This will facilitate 
identification of missing dependencies in Drupal libraries. 

The following patterns are considered warnings:

```
(function ($) {
 
  "use strict";

  drupalSettings.extra = {};

  Drupal.behaviors.test = {};
 
})(jQuery);
```


The following patterns are not warnings:

```
(function ($, Drupal, drupalSettings) {
 
  "use strict";
  
  drupalSettings.extra = {};

  Drupal.behaviors.test = {};
 
})(jQuery, Drupal, drupalSettings);
```

## When Not To Use It

If Drupal coding standards are not followed. 

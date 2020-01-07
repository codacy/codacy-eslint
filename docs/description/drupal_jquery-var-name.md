# Enforce Drupal variable naming standard for jQuery

## Why use it?

To follow [Drupal JavaScript coding standards](https://www.drupal.org/node/172169).

## Rule Details

The rule require all variables holding jQuery objects to be prefixed by `$`.


The following patterns are considered warnings:

```
var element = $("#form-1").find(':input');
```


The following patterns are not warnings:

```
var $element = $("#form-1").find(':input');
var height = $element.height();
var $height = 12;
```

## When Not To Use It

If Drupal coding standards are not followed. 

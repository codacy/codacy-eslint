# no-static-element-interactions

Static HTML elements do not have semantic meaning. This is clear in the case of `<div>` and `<span>`. It is less so clear in the case of elements that _seem_ semantic, but that do not have a semantic mapping in the accessibility layer. For example `<a>`, `<big>`, `<blockquote>`, `<footer>`, `<picture>`, `<strike>` and `<time>` -- to name a few -- have no semantic layer mapping. They are as void of meaning as `<div>`.

The [WAI-ARIA `role` attribute](https://www.w3.org/TR/wai-aria-1.1/#usage_intro) confers a semantic mapping to an element. The semantic value can then be expressed to a user via assistive technology.

In order to add interactivity such as a mouse or key event listener to a static element, that element must be given a role value as well.

## 🟢 How to resolve

### Case: This element acts like a button, link, menuitem, etc

Indicate the element's role with the `role` attribute:

```vue
<template>
  <div
    @click="onClickHandler"
    @keypress="onKeyPressHandler"
    role="button"
    tabIndex="0"
  >
    Save
  </div>
</template>
```

Common interactive roles include:

- `button`
- `link`
- `checkbox`
- `menuitem`
- `menuitemcheckbox`
- `menuitemradio`
- `option`
- `radio`
- `searchbox`
- `switch`
- `textbox`

Note: Adding a role to your element does **not** add behavior. When a semantic HTML element like `<button>` is used, then it will also respond to Enter key presses when it has focus. The developer is responsible for providing the expected behavior of an element that the role suggests it would have: focusability and key press support.

Do not use the role `presentation` on the element: it removes the element's semantics, and may also remove its children's semantics, creating big issues with assistive technology.

Adjust the list of handler prop names in the handlers array to increase or decrease the coverage surface of this rule in your codebase.

### ✔ Succeed

```vue
<template>
  <button @click="() => {}" class="foo" />
  <div class="foo" @click="() => {}" role="button" />
  <input type="text" @click="() => {}" />
</template>
```

### ❌ Fail

```vue
<template>
  <div @click="() => {}" />
</template>
```

## 📚 Resources

- [WCAG 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- [WAI-ARIA `role` attribute](https://www.w3.org/TR/wai-aria-1.1/#usage_intro)
- [WAI-ARIA Authoring Practices Guide - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex)
- [Fundamental Keyboard Navigation Conventions](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav)
- [Mozilla Developer Network - ARIA Techniques](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#Keyboard_and_focus)

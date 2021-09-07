# Enforce invoking Apex methods with the right arguments (valid-apex-method-invocation)

Apex methods can be imported inside LWC modules via the `@salesforce/apex` scoped import. The method can be [imperatively invoked](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.apex_call_imperative) by calling the module default import. Apex methods expect to receive its arguments as an object where each object key maps to Apex method parameter name.

## Rules details

This rule ensure that the Apex method receives its arguments as an object.

Example of **incorrect** code:

```js
import { findContacts } from '@salesforce/apex/ContactController.findContacts';

findContacts('Ted');
findContacts('Ted', 'Salesforce');
```

Example of **correct** code:

```js
import { findContacts } from '@salesforce/apex/ContactController.findContacts';

findContacts({ searchKey: 'Ted' });
findContacts({
    searchKey: 'Ted',
    company: 'Salesforce',
});
```

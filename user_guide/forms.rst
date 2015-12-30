Forms
=====

HTML Forms are common to web applications and present a unique set of challenges in building, rendering and
validating a form and it's elements. The `popphp/pop-form` component helps to manage those aspects of web forms
and streamline the process of utilizing forms in your web application.

Form Elements
-------------

Most of the standard HTML5 form elements are supported with in the `popphp/pop-form` component. If you require a
different element of any kind, you can extend the `Pop\\Form\\Element\\AbstractElement` class to build your own.
With each element instance, you can set attributes, values and validation parameters.

The generic input class is:

* `Pop\\Form\\Element\\Input`

The standard available input element classes extend the above class are:

* `Pop\\Form\\Element\\Input\\Button`
* `Pop\\Form\\Element\\Input\\Checkbox`
* `Pop\\Form\\Element\\Input\\Datalist`
* `Pop\\Form\\Element\\Input\\Email`
* `Pop\\Form\\Element\\Input\\File`
* `Pop\\Form\\Element\\Input\\Hidden`
* `Pop\\Form\\Element\\Input\\Number`
* `Pop\\Form\\Element\\Input\\Password`
* `Pop\\Form\\Element\\Input\\Radio`
* `Pop\\Form\\Element\\Input\\Range`
* `Pop\\Form\\Element\\Input\\Reset`
* `Pop\\Form\\Element\\Input\\Submit`
* `Pop\\Form\\Element\\Input\\Text`
* `Pop\\Form\\Element\\Input\\Url`

Special case input element classes include:

* `Pop\\Form\\Element\\Input\\Captcha`
* `Pop\\Form\\Element\\Input\\Csrf`

Other available form elements are:

* `Pop\\Form\\Element\\Button`
* `Pop\\Form\\Element\\Select`
* `Pop\\Form\\Element\\Textarea`

Special form element collections include:

* `Pop\\Form\\Element\\CheckboxSet`
* `Pop\\Form\\Element\\RadioSet`

Here's an example that creates and renders a simple input text element:

.. code-block:: php

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->setAttribute('size', 40);
    echo $text;

The above code will produce:

.. code-block:: html

    <input name="first_name" type="text" size="40" />

Using Validators
----------------

The Form Object
---------------

The form object serves as the center of the functionality. You can create a form object and inject form elements into
it. The form object then manages those elements, their values and processes the validation, if any, attached to the
form elements.

Using Field Configurations
--------------------------


Rendering a Form
----------------


Validating a Form
-----------------


Using a Template
----------------


Using Form Elements Only
------------------------
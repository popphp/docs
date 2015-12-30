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

Other available form element classes are:

* `Pop\\Form\\Element\\Button`
* `Pop\\Form\\Element\\Select`
* `Pop\\Form\\Element\\Textarea`

Special form element collection classes include:

* `Pop\\Form\\Element\\CheckboxSet`
* `Pop\\Form\\Element\\RadioSet`

In the case of the CAPTCHA and CSRF input element classes, they have special parameters that are required for
them to perform their functions. In the case of the form element collection classes, they provide a grouping of
elements within a fieldset for easier management.

Here's an example that creates and renders a simple input text element:

.. code-block:: php

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->setAttribute('size', 40);
    echo $text;

The above code will produce:

.. code-block:: html

    <input name="first_name" id="first_name" type="text" size="40" />

The `name` and `id` attributes of the element are set from the first `$name` parameter that is passed into the
object. However, if you wish to override these, you can by doing this:

.. code-block:: php

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->setAttribute('size', 40);
    $text->setAttribute('id', 'my-custom-id');
    echo $text;

The above code will produce:

.. code-block:: html

    <input name="first_name" id="my-custom-id" type="text" size="40" />

Here's an example of a select element:

.. code-block:: php

    $select = new Pop\Form\Element\Select('colors', [
        'Red'   => 'Red',
        'Green' => 'Green',
        'Blue'  => 'Blue'
    ]);
    $text->setAttribute('class', 'drop-down');
    echo $select;

The above code will produce:

.. code-block:: html

    <select name="colors" id="colors">
        <option value="Red">Red</option>
        <option value="Green">Green</option>
        <option value="Blue">Blue</option>
    </select>

Here's an example of a checkbox set:

.. code-block:: php

    $checkbox = new Pop\Form\Element\CheckboxSet('colors', [
        'Red'   => 'Red',
        'Green' => 'Green',
        'Blue'  => 'Blue'
    ]);
    echo $checkbox;

The above code will produce:

.. code-block:: html

    <fieldset class="checkbox-fieldset">
        <input class="checkbox" type="checkbox" name="colors[]" id="colors" value="Red" />
        <span class="checkbox-span">Red</span>
        <input class="checkbox" type="checkbox" name="colors[]" id="colors1" value="Green" />
        <span class="checkbox-span">Green</span>
        <input class="checkbox" type="checkbox" name="colors[]" id="colors2" value="Blue" />
        <span class="checkbox-span">Blue</span>
    </fieldset>

As you can see, in the special case of a field collection set, the object manages a lot of creation and assignment
of values and other elements, such as the `<span>` elements that hold the field values. Each element has a class
attribute that can be utilized for styling.

Labels
------

When you create instances of form elements, you can set the label to uses in conjunction with the element. This is
typically used when rendering the main form object.

.. code-block:: php

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->setLabel('First Name:');

When rendered with the form, it will render like this:

.. code-block:: html

    <label for="first_name">First Name:</label>

Validators
----------

The Form Object
---------------

The form object serves as the center of the functionality. You can create a form object and inject form elements into
it. The form object then manages those elements, their values and processes the validation, if any, attached to the
form elements.

Field Configurations
--------------------


Rendering a Form
----------------


Validating a Form
-----------------


Templates
---------


Using the Form Elements Only
----------------------------
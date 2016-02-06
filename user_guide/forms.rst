Forms
=====

HTML Forms are common to web applications and present a unique set of challenges in building, rendering and
validating a form and it's elements. The `popphp/pop-form` component helps to manage those aspects of web forms
and streamline the process of utilizing forms in your web application.

Form Elements
-------------

Most of the standard HTML5 form elements are supported within the `popphp/pop-form` component. If you require a
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
    $text->setRequired(true);
    $text->setAttribute('size', 40);
    echo $text;

The above code will produce:

.. code-block:: html

    <input name="first_name" id="first_name" type="text" required="required" size="40" />

Note the `required` attribute. Since the element was set to be required, this will assign that attribute to the
element, which is only effective client-side, if the client interface hasn't bypassed HTML form validation.
If the client interface has bypassed HTML form validation, then the form object will still account for the required
setting when validating server-side with PHP. If the field is set to be required and it is empty, validation will fail.

Also, the `name` and `id` attributes of the element are set from the first `$name` parameter that is passed into the
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

    <select name="colors" id="colors" class="drop-down">
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

In the special case of a field collection set, the object manages the creation and assignment of values and other
elements, such as the `<span>` elements that hold the field values. Each element has a class attribute that can
be utilized for styling.

Labels
------

When you create instances of form elements, you can set the label to uses in conjunction with the element. This is
typically used when rendering the main form object.

.. code-block:: php

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->setLabel('First Name:');

When rendered with the form, the label will render like this:

.. code-block:: html

    <label for="first_name">First Name:</label>

Validators
----------

When if comes to attaching validators to a form element, there are a few options. The default option is to use the
`popphp/pop-validator` component. You can use the standard set of validator classes included in that component,
or you can write your own by extending the main `Pop\\Validator\\AbstractValidator` class. Alternatively, if you'd
like to create your own, independent validators, you can do that as well. You just need to pass it something that
is callable.

Here's an example using the `popphp/pop-validator` component:

.. code-block:: php

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->addValidator(new Pop\Validator\AlphaNumeric());

If the field's valid was set to something that wasn't alphanumeric, then it would fail validation:

.. code-block:: php

    $text->setValue('abcd#$%');
    if (!$text->validate()) {
        print_r($text->getErrors());
    }

If using a custom validator that is callable, the main guideline you would have to follow is that upon failure,
your validator should return a failure message, otherwise, simply return null. Those messages are what is collected
in the elements `$errors` array property for error message display. Here's an example:

.. code-block:: php

    $myValidator = function($value) {
        if (preg_match('/^\w+$/', $value) == 0) {
            return 'The value is not alphanumeric.';
        } else {
            return null;
        }
    };

    $text = new Pop\Form\Element\Input\Text('first_name');
    $text->addValidator($myValidator);

    $text->setValue('abcd#$%');
    if (!$text->validate()) {
        print_r($text->getErrors());
    }

Form Objects
------------

The form object serves as the center of the functionality. You can create a form object and inject form elements into
it. The form object then manages those elements, their values and processes the validation, if any, attached to the
form elements. The form object object also provides a default way to render an HTML form object using a DL tag with
nested DT and DD tags that contain the field elements and their labels. This default setting can be overridden using
templates, as outlined in the `Using Templates`_ section below. Consider the following code:

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Form\Element\Input;
    use Pop\Validator;

    $form = new Form();
    $form->setAttribute('id', 'my-form');

    $username = new Input\Text('username');
    $username->setLabel('Username:')
             ->setRequired(true)
             ->setAttribute('size', 40)
             ->addValidator(new Validator\AlphaNumeric());

    $email = new Input\Email('email');
    $email->setLabel('Email:')
          ->setRequired(true)
          ->setAttribute('size', 40);

    $submit = new Input\Submit('submit', 'SUBMIT');

    $form->addElements([$username, $email, $submit]);

    if ($_POST) {
        $form->setFieldValues($_POST);
        if (!$form->isValid()) {
            echo $form; // Has errors
        } else {
            echo 'Valid!';
            print_r($form->getFields());
        }
    } else {
        echo $form;
    }

The form's action is pulled from the current `REQUEST_URI` of the current page, unless otherwise directly specified.
Also, the form's method defaults to `POST` unless otherwise specified. The above code will produce the following
HTML as the initial render by default:

.. code-block:: html

    <form action="/" method="post" id="my-form">
        <dl id="my-form-field-group-1" class="my-form-field-group">
        <dt>
            <label for="username" class="required">Username:</label>
        </dt>
        <dd>
            <input type="text" name="username" id="username" value="" required="required" size="40" />
        </dd>
        <dt>
            <label for="email" class="required">Email:</label>
        </dt>
        <dd>
            <input type="email" name="email" id="email" value="" required="required" size="40" />
        </dd>
        <dd>
            <input type="submit" name="submit" id="submit" value="SUBMIT" />
        </dd>
        </dl>
    </form>

If the user were to input non-valid data into on of the fields, and then submit the form, then the script would
be processed again, this time, it would trigger the form validation and render with the error messages, like this:

.. code-block:: html

    <form action="/" method="post" id="my-form">
        <dl id="my-form-field-group-1" class="my-form-field-group">
        <dt>
            <label for="username" class="required">Username:</label>
        </dt>
        <dd>
            <input type="text" name="username" id="username" value="dfvdfv##$dfv" required="required" size="40" />
            <div class="error">The value must only contain alphanumeric characters.</div>
        </dd>
        <dt>
            <label for="email" class="required">Email:</label>
        </dt>
        <dd>
            <input type="email" name="email" id="email" value="test@test.com" required="required" size="40" />
        </dd>
        <dd>
            <input type="submit" name="submit" id="submit" value="SUBMIT" />
        </dd>
        </dl>
    </form>

As you can see above, the values entered by the user are retained so that they may correct any errors and re-submit
the form. Once the form is corrected and re-submitted, it will pass validation and then move on to the portion of
the script that will handle what to do with the form data.


Using Filters
-------------

When dealing with the data that is being passed through a form object, besides validation, you'll want to consider
adding filters to further protect against bad or malicious data. We can modify the above example to add filters to
be used to process the form data before it is validated or re-rendered to the screen. A filter can be anything that
is callable, like this:

.. code-block:: php

    if ($_POST) {
        $form->addFilter('strip_tags');
        $form->addFilter('htmlentities', [ENT_QUOTES, 'UTF-8']);
        $form->setFieldValues($_POST);
        if (!$form->isValid()) {
            echo $form; // Has errors
        } else {
            echo 'Valid!';
            print_r($form->getFields());
        }
    } else {
        echo $form;
    }

In the above code, the `addFilter` methods are called before the data is set into the form for validation or
re-rendering. The example passes the `strip_tags` and 'htmlentities` functions and those functions will be applied
to the each value of form data. So, if a user tries to submit the data `<script>alert("Bad Code");</script>` into
one of the fields, it would get filtered and re-rendered like this:

.. code-block:: html

    <form action="/" method="post" id="my-form">
        <dl id="my-form-field-group-1" class="my-form-field-group">
        <dt>
            <label for="username" class="required">Username:</label>
        </dt>
        <dd>
            <input type="text" name="username" id="username" value="alert(&quot;Hello&quot;);" required="required" size="40" />
            <div class="error">The value must only contain alphanumeric characters.</div>
        </dd>
        <dt>
            <label for="email" class="required">Email:</label>
        </dt>
        <dd>
            <input type="email" name="email" id="email" value="test@test.com" required="required" size="40" />
        </dd>
        <dd>
            <input type="submit" name="submit" id="submit" value="SUBMIT" />
        </dd>
        </dl>
    </form>

As you can see, the `<script>` tags were stripped and the quotes were converted to HTML entities.


Field Configurations
--------------------


Using Templates
---------------


Using Form Elements Only
------------------------


.. _Using Template: ./forms.html#using-templates
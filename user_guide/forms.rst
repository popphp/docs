Forms
=====

HTML Forms are common to web applications and present a unique set of challenges in building, rendering and
validating a form and its elements. The `popphp/pop-form` component helps to manage those aspects of web forms
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

Other available form element classes are:

* `Pop\\Form\\Element\\Button`
* `Pop\\Form\\Element\\Select`
* `Pop\\Form\\Element\\SelectMultiple`
* `Pop\\Form\\Element\\Textarea`

Special form element collection classes include:

* `Pop\\Form\\Element\\CheckboxSet`
* `Pop\\Form\\Element\\RadioSet`

Special case input element classes include:

* `Pop\\Form\\Element\\Input\\Captcha`
* `Pop\\Form\\Element\\Input\\Csrf`

In the case of the form element collection classes, they provide a grouping of elements within a fieldset for easier
management. In the case of the CAPTCHA and CSRF input element classes, they have special parameters that are required
for them to perform their functions.

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
    $select->setAttribute('class', 'drop-down');
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
form elements. Consider the following code:

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

    $form->addFields([$username, $email, $submit]);

    if ($_POST) {
        $form->setFieldValues($_POST);
        if (!$form->isValid()) {
            echo $form; // Re-render, form has errors
        } else {
            echo 'Valid!';
            print_r($form->toArray());
        }
    } else {
        echo $form;
    }

The form's action is pulled from the current `REQUEST_URI` of the current page, unless otherwise directly specified.
Also, the form's method defaults to `POST` unless otherwise specified. The above code will produce the following
HTML as the initial render by default:

.. code-block:: html

    <form action="/" method="post" id="my-form">
        <fieldset id="my-form-fieldset-1" class="my-form-fieldset">
            <dl>
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
        </fieldset>
    </form>

If the user were to input non-valid data into on of the fields, and then submit the form, then the script would
be processed again, this time, it would trigger the form validation and render with the error messages, like this:

.. code-block:: html

    <form action="/" method="post" id="my-form">
        <fieldset id="my-form-fieldset-1" class="my-form-fieldset">
            <dl>
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
                    <input type="email" name="email" id="email" value="" required="required" size="40" />
                </dd>
                <dd>
                    <input type="submit" name="submit" id="submit" value="SUBMIT" />
                </dd>
            </dl>
        </fieldset>
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

    use Pop\Form\Filter\Filter;

    /** ...Code to create the form ...**/

    if ($_POST) {
        $form->addFilter(new Filter('strip_tags'));
        $form->addFilter(new Filter('htmlentities', [ENT_QUOTES, 'UTF-8']));
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
re-rendering. The example passes the `strip_tags` and `htmlentities` functions and those functions are applied
to the each value of form data. So, if a user tries to submit the data `<script>alert("Bad Code");</script>` into
one of the fields, it would get filtered and re-rendered like this:

.. code-block:: html

    <input type="text" name="username" id="username" value="alert(&quot;Bad Code&quot;);" required="required" size="40" />

As you can see, the `<script>` tags were stripped and the quotes were converted to HTML entities.

Field Configurations
--------------------

Most of the functionality outlined above can be administered and managed by passing field configuration arrays
into the form object. This helps facilitate and streamline the form creation process. Consider the following
example:

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Validator;

    $fields = [
        'username' => [
            'type'       => 'text',
            'label'      => 'Username',
            'required'   => true,
            'validators' => new Validator\AlphaNumeric(),
            'attributes' => [
                'class' => 'username-field',
                'size'  => 40
            ]
        ],
        'password' => [
            'type'       => 'password',
            'label'      => 'Password',
            'required'   => true,
            'validators' => new Validator\GreaterThanEqual(6),
            'attributes' => [
                'class' => 'password-field',
                'size'  => 40
            ]
        ],
        'submit' => [
            'type'       => 'submit',
            'value'      => 'SUBMIT',
            'attributes' => [
                'class' => 'submit-btn'
            ]
        ]
    ];

    $form = Form::createFromConfig($fields);
    $form->setAttribute('id', 'login-form');

    echo $form;

which will produce the following HTML code:

.. code-block:: html

    <form action="/" method="post" id="login-form">
        <fieldset id="login-form-fieldset-1" class="login-form-fieldset">
            <dl>
                <dt>
                    <label for="username" class="required">Username</label>
                </dt>
                <dd>
                    <input type="text" name="username" id="username" value="" required="required" class="username-field" size="40" />
                </dd>
                <dt>
                    <label for="password" class="required">Password</label>
                </dt>
                <dd>
                    <input type="password" name="password" id="password" value="" required="required" class="password-field" size="40" />
                </dd>
                <dd>
                    <input type="submit" name="submit" id="submit" value="SUBMIT" class="submit-btn" />
                </dd>
            </dl>
        </fieldset>
    </form>

In the above example, the `$fields` is an associative array where the keys are the names of the fields and the array
values contain the field configuration values. Some of the accepted field configuration values are:

* ``'type'`` - field type, i.e. 'button', 'select', 'text', 'textarea', 'checkbox', 'radio', 'input-button'
* ``'label'`` - field label
* ``'required'`` - boolean to set whether the field is required or not. Defaults to false.
* ``'attributes'`` - an array of attributes to apply to the field.
* ``'validators'`` - an array of validators to apply to the field. Can be a single callable validator as well.
* ``'value'`` - the value to be set for the field
* ``'values'`` - the option values to be set for the field (for selects, checkboxes and radios)
* ``'selected'`` - the field value or values that are to be marked as 'selected' within the field's values.
* ``'checked'`` - the field value or values that are to be marked as 'checked' within the field's values.

Here is an example using fields with multiple values:

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Validator;

    $fields = [
        'colors' => [
            'type'   => 'checkbox',
            'label'  => 'Colors',
            'values' => [
                'Red'   => 'Red',
                'Green' => 'Green',
                'Blue'  => 'Blue'
            ],
            'checked' => [
                'Red', 'Green'
            ]
        ],
        'country' => [
            'type'   => 'select',
            'label'  => 'Country',
            'values' => [
                'United States' => 'United States',
                'Canada'        => 'Canada',
                'Mexico'        => 'Mexico'
            ],
            'selected' => 'United States'
        ]
    ];

    $form = Form::createFromConfig($fields);

    echo $form;

which will produce:

.. code-block:: html

    <form action="/" method="post">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <dl>
                <dt>
                    <label for="colors1">Colors</label>
                </dt>
                <dd>
                    <fieldset class="checkbox-fieldset">
                        <input type="checkbox" name="colors[]" id="colors" value="Red" class="checkbox" checked="checked" />
                        <span class="checkbox-span">Red</span>
                        <input type="checkbox" name="colors[]" id="colors1" value="Green" class="checkbox" checked="checked" />
                        <span class="checkbox-span">Green</span>
                        <input type="checkbox" name="colors[]" id="colors2" value="Blue" class="checkbox" />
                        <span class="checkbox-span">Blue</span>
                    </fieldset>
                </dd>
                <dt>
                    <label for="country">Country</label>
                </dt>
                <dd>
                    <select name="country" id="country">
                        <option value="United States" selected="selected">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                    </select>
                </dd>
            </dl>
        </fieldset>
    </form>

Fieldsets
---------

As you've seen in the above examples, the fields that are added to the form object are enclosed in a fieldset group.
This can be leveraged to create other fieldset groups as well as give them legends to better define the fieldsets.

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Validator;

    $fields1 = [
        'username' => [
            'type'       => 'text',
            'label'      => 'Username',
            'required'   => true,
            'validators' => new Validator\AlphaNumeric(),
            'attributes' => [
                'class' => 'username-field',
                'size'  => 40
            ]
        ],
        'password' => [
            'type'       => 'password',
            'label'      => 'Password',
            'required'   => true,
            'validators' => new Validator\GreaterThanEqual(6),
            'attributes' => [
                'class' => 'password-field',
                'size'  => 40
            ]
        ]
    ];
    $fields2 = [
        'submit' => [
            'type'       => 'submit',
            'value'      => 'SUBMIT',
            'attributes' => [
                'class' => 'submit-btn'
            ]
        ]
    ];

    $form = Form::createFromConfig($fields1);
    $form->getFieldset()->setLegend('First Fieldset');
    $form->createFieldset('Second Fieldset');
    $form->addFieldsFromConfig($fields2);

    echo $form;

In the above code, the first set of fields are added to an initial fieldset that's automatically created.
After that, if you want to add more fieldsets, you call the ``createFieldset`` method like above. Then
the current fieldset is changed to the newly created one and the next fields are added to that one. You can
always change to any other fieldset by using the ``setCurrent($i)`` method. The above code would render like this:

.. code-block:: html

    <form action="/" method="post">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <legend>First Fieldset</legend>
            <dl>
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
            </dl>
        </fieldset>
        <fieldset id="pop-form-fieldset-2" class="pop-form-fieldset">
            <legend>Second Fieldset</legend>
            <dl>
                <dd>
                    <input type="submit" name="submit" id="submit" value="SUBMIT" />
                </dd>
            </dl>
        </fieldset>
    </form>

The container elements within the fieldset can be controlled by passing a value to the ``$container`` parameter.
The default is `dl`, but `table`, `div` and `p` are supported as well.

.. code-block:: php

    $form->createFieldset('Second Fieldset', 'table');

Alternately, you can inject an entire fieldset configuration array. The code below is a more simple way to inject
the fieldset configurations and their legends. And, it will generate the same HTML as above.

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Validator;

    $fieldsets = [
        'First Fieldset' => [
            'username' => [
                'type'       => 'text',
                'label'      => 'Username',
                'required'   => true,
                'validators' => new Validator\AlphaNumeric(),
                'attributes' => [
                    'class' => 'username-field',
                    'size'  => 40
                ]
            ],
            'password' => [
                'type'       => 'password',
                'label'      => 'Password',
                'required'   => true,
                'validators' => new Validator\GreaterThanEqual(6),
                'attributes' => [
                    'class' => 'password-field',
                    'size'  => 40
                ]
            ]
        ],
        'Second Fieldset' => [
            'submit' => [
                'type'       => 'submit',
                'value'      => 'SUBMIT',
                'attributes' => [
                    'class' => 'submit-btn'
                ]
            ]
        ]
    ];

    $form = Form::createFromFieldsetConfig($fieldsets);

    echo $form;

Dynamic Database Fields
-----------------------

The ``pop-form`` component comes with the functionality to very quickly wire up form fields that are mapped
to the columns in a database table. It does require the installation of the ``pop-db`` component to work.
Consider that there is a database table class called ``Users`` that is mapped to the ``users`` table in the
database. It has three fields: ``id``, ``username`` and ``password``.

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Form\Fields;
    use MyApp\Table\Users;

    $fields = new Fields(Users::getTableInfo(), null, null, 'id');
    $fields->submit = [
        'type'  => 'submit',
        'value' => 'SUBMIT'
    ];

    $form = new Form($fields->getFields());
    echo $form;

The main data fields are pulled from the database table and the submit field is added. This form object will render like:

.. code-block:: html

    <form action="/fields2.php" method="post">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <dl>
                <dt>
                    <label for="username" class="required">Username:</label>
                </dt>
                <dd>
                    <input type="text" name="username" id="username" value="" required="required" />
                </dd>
                <dt>
                    <label for="password" class="required">Password:</label>
                </dt>
                <dd>
                    <input type="password" name="password" id="password" value="" required="required" />
                </dd>
                <dd>
                    <input type="submit" name="submit" id="submit" value="SUBMIT" />
                </dd>
            </dl>
        </fieldset>
    </form>

You can set element-specific attributes and values, as well as set fields to omit, like the 'id' parameter
in the above examples. Any ``TEXT`` column type in the database is created as textarea objects and then
the rest are created as input text objects.

Using Views
-----------

You can still use the form object for managing and validating your form fields and still send the individual
components to a view for you to control how they render as needed. You can do that like this:

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Validator;

    $fields = [
        'username' => [
            'type'       => 'text',
            'label'      => 'Username',
            'required'   => true,
            'validators' => new Validator\AlphaNumeric(),
            'attributes' => [
                'class' => 'username-field',
                'size'  => 40
            ]
        ],
        'password' => [
            'type'       => 'password',
            'label'      => 'Password',
            'required'   => true,
            'validators' => new Validator\GreaterThanEqual(6),
            'attributes' => [
                'class' => 'password-field',
                'size'  => 40
            ]
        ],
        'submit' => [
            'type'       => 'submit',
            'value'      => 'SUBMIT',
            'attributes' => [
                'class' => 'submit-btn'
            ]
        ]
    ];

    $form = Form::createFromConfig($fields);
    $formData = $form->prepareForView();

You can then pass the array ``$formData`` off to your view object to be rendered as you need it to be. That
array will contain the following ``key => value`` entries:

.. code-block:: php

    $formData = [
        'username'        => '<input type="text" name="username"...',
        'username_label'  => '<label for="username" ...',
        'username_errors' => [],
        'password'        => '<input type="text" name="username"...',
        'password_label'  => '<label for="username" ...',
        'password_errors' => [],
        'submit'          => '<input type="submit" name="submit"...',
        'submit_label'    => '',
    ]

Or, if you want even more control, you can send the form object itself into your view object and access
the components like this:

.. code-block:: php

    <form action="/" method="post" id="login-form">
        <fieldset id="login-form-fieldset-1" class="login-form-fieldset">
            <dl>
                <dt>
                    <label for="username" class="required"><?=$form->getField('username')->getLabel(); ?></label>
                </dt>
                <dd>
                    <?=$form->getField('username'); ?>
    <?php if ($form->getField('username')->hasErrors(): ?>
    <?php foreach ($form->getField('username')->getErrors() as $error): ?>
                    <div class="error"><?=$error; ?></div>
    <?php endforeach; ?>
    <?php endif; ?>
                </dd>
                <dt>
                    <label for="password" class="required"><?=$form->getField('password')->getLabel(); ?></label>
                </dt>
                <dd>
                    <?=$form->getField('password'); ?>
    <?php if ($form->getField('password')->hasErrors(): ?>
    <?php foreach ($form->getField('password')->getErrors() as $error): ?>
                    <div class="error"><?=$error; ?></div>
    <?php endforeach; ?>
    <?php endif; ?>
                </dd>
                <dd>
                    <?=$form->getField('submit'); ?>
                </dd>
            </dl>
        </fieldset>
    </form>

Input CAPTCHA
-------------

The CAPTCHA field element is a special input field that generates a simple, but random math equation to be answered
by the user.

.. code-block:: php

    use Pop\Form\Form;

    $fields = [
        'username' => [
            'type'  => 'text',
            'label' => 'Username',
            'attributes' => [
                'size'   => 15
            ]
        ],
        'captcha' => [
            'type'  => 'captcha',
            'label' => 'Please Enter Answer: ',
            'attributes' => [
                'size'   => 15
            ]
        ],
        'submit' => [
            'type'  => 'submit',
            'label' => '&nbsp;',
            'value' => 'Submit'
        ]
    ];

    $form = Form::createFromConfig($fields);

    if ($_POST) {
        $form->setFieldValues($_POST);
        if ($form->isValid()) {
            $form->clearTokens();
            echo 'Good!';
        } else {
            echo $form;
        }
    } else {
        echo $form;
    }

And that will append the math equation to the CAPTCHA field's label. The HTML would like like this:

.. code-block:: html

    <form action="/" method="post" id="pop-form" class="pop-form">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <dl>
                <dt>
                    <label for="username">Username</label>
                </dt>
                <dd>
                    <input type="text" name="username" id="username" value="" size="15" />
                </dd>
                <dt>
                    <label for="captcha" class="required">Please Enter Answer: (7 &#215; 3)</label>
                </dt>
                <dd>
                    <input type="text" name="captcha" id="captcha" value="" required="required" size="15" />
                </dd>
                <dt>
                    <label for="submit">&nbsp;</label>
                </dt>
                <dd>
                    <input type="submit" name="submit" id="submit" value="Submit" />
                </dd>
            </dl>
        </fieldset>
    </form>

The `popphp/pop-image` component provides an image CAPTCHA that is compatible with the `popphp/pop-form` component.
You would have to create a script the generates the image CAPTCHA:

.. code-block:: php

    use Pop\Image\Captcha;

    $captcha = new Captcha('/captcha.php');
    header('Content-Type: image/gif');
    echo $captcha;

And then hook it into the form that uses the CAPTCHA field:

.. code-block:: php

    use Pop\Form\Form;
    use Pop\Image\Captcha;

    $captcha = new Captcha('/captcha.php');

    $fields = [
        'username' => [
            'type'  => 'text',
            'label' => 'Username',
            'attributes' => [
                'size'   => 15
            ]
        ],
        'captcha' => [
            'type'  => 'captcha',
            'label' => 'Please Enter Answer: ',
            'attributes' => [
                'size'   => 15
            ]
        ],
        'submit' => [
            'type'  => 'submit',
            'label' => '&nbsp;',
            'value' => 'Submit'
        ]
    ];

    $form = Form::createFromConfig($fields);

    if ($_POST) {
        $form->setFieldValues($_POST);
        if ($form->isValid()) {
            $form->clearTokens();
            echo 'Good!';
        } else {
            echo $form;
        }
    } else {
        echo $form;
    }

When rendering the field, it will detect that the CAPTCHA is an image, override the math equation and append the
image with a reload link to the CAPTCHA field's label:

.. code-block:: html

    <form action="/" method="post" id="pop-form" class="pop-form">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <dl>
                <dt>
                    <label for="username">Username</label>
                </dt>
                <dd>
                    <input type="text" name="username" id="username" value="" size="15" />
                </dd>
                <dt>
                    <label for="captcha" class="required">
                        Please Enter Answer:
                        <img id="pop-captcha-image" class="pop-captcha-image" src="/captcha.php" />
                        <a class="pop-captcha-reload" href="#" onclick="document.getElementById('pop-captcha-image').src = '/captcha.php?captcha=1'; return false;">Reload</a>
                    </label>
                </dt>
                <dd>
                    <input type="text" name="captcha" id="captcha" value="" required="required" size="15" />
                </dd>
                <dt>
                    <label for="submit">&nbsp;</label>
                </dt>
                <dd>
                    <input type="submit" name="submit" id="submit" value="Submit" />
                </dd>
            </dl>
        </fieldset>
    </form>

The image elements will have CSS classes to facilitate styling them as needed.

ACL Forms
---------

ACL forms are an extension of the regular form class that take an ACL object with its roles and resources and
enforce which form fields can be seen and edited. Consider the following code below:

.. code-block:: php

    use Pop\Form;
    use Pop\Acl;

    $acl      = new Acl\Acl();
    $admin    = new Acl\AclRole('admin');
    $editor   = new Acl\AclRole('editor');
    $username = new Acl\AclResource('username');
    $password = new Acl\AclResource('password');

    $acl->addRoles([$admin, $editor]);
    $acl->addResources([$username, $password]);

    $acl->deny($editor, 'username', 'edit');
    $acl->deny($editor, 'password', 'view');

    $fields = [
        'username' => [
            'type'  => 'text',
            'label' => 'Username'
        ],
        'password' => [
            'type'  => 'password',
            'label' => 'Password'
        ],
        'first_name' => [
            'type'  => 'text',
            'label' => 'First Name'
        ],
        'last_name' => [
            'type'  => 'text',
            'label' => 'Last Name'
        ],
        'submit' => [
            'type'  => 'submit',
            'value' => 'Submit'
        ]
    ];

    $form = Form\AclForm::createFromConfig($fields);
    $form->setAcl($acl);

The ``$admin`` has no restrictions. However, the ``$editor`` role does have restrictions and cannot edit
the username field and cannot view the password field. Setting the $editor as the form role and rendering
the form will look like this:

.. code-block:: php

    $form->addRole($editor);
    echo $form;


.. code-block:: html

    <form action="#" method="post" id="pop-form" class="pop-form">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <dl>
                <dt>
                    <label for="username">Username</label>
                </dt>
                <dd>
                    <input type="text" name="username" id="username" value="" readonly="readonly" />
                </dd>
                <dt>
                    <label for="first_name">First Name</label>
                </dt>
                <dd>
                    <input type="text" name="first_name" id="first_name" value="" />
                </dd>
                <dt>
                    <label for="last_name">Last Name</label>
                </dt>
                <dd>
                    <input type="text" name="last_name" id="last_name" value="" />
                </dd>
                <dd>
                    <input type="submit" name="submit" id="submit" value="Submit" />
                </dd>
            </dl>
        </fieldset>
    </form>

There is no password field and the username field has been made readonly. Switch the role to ``$admin``
and the entire form will render with no restrictions:

.. code-block:: php

    $form->addRole($admin);
    echo $form;

.. code-block:: html

    <form action="#" method="post" id="pop-form" class="pop-form">
        <fieldset id="pop-form-fieldset-1" class="pop-form-fieldset">
            <dl>
                <dt>
                    <label for="username">Username</label>
                </dt>
                <dd>
                    <input type="text" name="username" id="username" value="" />
                </dd>
                <dt>
                    <label for="password">Password</label>
                </dt>
                <dd>
                    <input type="password" name="password" id="password" value="" />
                </dd>
                <dt>
                    <label for="first_name">First Name</label>
                </dt>
                <dd>
                    <input type="text" name="first_name" id="first_name" value="" />
                </dd>
                <dt>
                    <label for="last_name">Last Name</label>
                </dt>
                <dd>
                    <input type="text" name="last_name" id="last_name" value="" />
                </dd>
                <dd>
                    <input type="submit" name="submit" id="submit" value="Submit" />
                </dd>
            </dl>
        </fieldset>
    </form>

Form Validators
---------------

There is a ``FormValidator`` class that is available for only validating a set of field values. The benefit of this
feature is to not be burdened with the concern of rendering an entire form object, and to only return the appropriate
validation messaging. This is useful for things like API calls, where the form rendering might be handled by another
piece of the application (and not the PHP server side).

.. code-block:: php

    use Pop\Form\FormValidator;
    use Pop\Validator;

    $validators = [
        'username' => new Validator\AlphaNumeric(),
        'password' => new Validator\LengthGte(6)
    ];

    $form = new FormValidator($validators);
    $form->setValues([
        'username' => 'admin$%^',
        'password' => '12345'
    ]);

    if (!$form->validate()) {
        print_r($form->getErrors());
    }

If the field values are bad, the ``$form->getErrors()`` method will return an array of errors like this:

.. code-block:: text

    Array
    (
        [username] => Array
            (
                [0] => The value must only contain alphanumeric characters.
            )

        [password] => Array
            (
                [0] => The value length must be greater than or equal to 6.
            )

    )
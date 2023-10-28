pop-validator
=============

The `popphp/pop-validator` component provides a basic API to process simple validation of values.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-validator

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-validator": "^4.0.0"
        }
    }

Basic Use
---------

Here's a list of the available built-in validators:

+----------------------------------------------------------+
|                     Built-in Validators                  |
+===================+======================+===============+
| AlphaNumeric      | Ipv4                 | LessThanEqual |
+-------------------+----------------------+---------------+
| Alpha             | Ipv6                 | LessThan      |
+-------------------+----------------------+---------------+
| BetweenInclude    | IsSubnetOf           | NotContains   |
+-------------------+----------------------+---------------+
| Between           | LengthBetweenInclude | NotEmpty      |
+-------------------+----------------------+---------------+
| Contains          | LengthBetween        | NotEqual      |
+-------------------+----------------------+---------------+
| CreditCard        | LengthGte            | Numeric       |
+-------------------+----------------------+---------------+
| Email             | LengthGt             | RegEx         |
+-------------------+----------------------+---------------+
| Equal             | LengthLte            | Subnet        |
+-------------------+----------------------+---------------+
| GreaterThanEqual  | LengthLt             | Url           |
+-------------------+----------------------+---------------+
| GreaterThan       | Length               |               |
+-------------------+----------------------+---------------+

Here's an example testing an email value

.. code-block:: php

    $validator = new Pop\Validator\Email();

    // Returns false
    if ($validator->evaluate('bad-email-address')) {
        // Prints out the default message 'The value must be a valid email format.'
        echo $validator->getMessage();
    }

    // Returns true
    if ($validator->evaluate('good@email.com')) {
        // Do something with a valid email address.
    }

Validate Specific Values
------------------------

.. code-block:: php

    $validator = new Pop\Validator\LessThan(10);

    if ($validator->evaluate(8)) { } // Returns true

Set a Custom Message
--------------------

.. code-block:: php

    $validator = new Pop\Validator\RegEx(
        '/^.*\.(jpg|jpeg|png|gif)$/i',
        'You must only submit JPG, PNG or GIF images.'
    );

    // Returns false
    if ($validator->evaluate('image.bad')) {
        echo $validator->getMessage();
    }

Alternatively:

.. code-block:: php

    $validator = new Pop\Validator\RegEx('/^.*\.(jpg|jpeg|png|gif)$/i');
    $validator->setMessage('You must only submit JPG, PNG or GIF images.');

    if ($validator->evaluate('image.jpg')) { } // Returns true

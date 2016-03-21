Pop\\Filter
===========

The `popphp/pop-filter` component provides some basic filtering for common situations.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-filter

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-filter": "2.0.*",
        }
    }

Basic Use
---------

URL Slug
~~~~~~~~

.. code-block:: php

    echo Pop\Filter\Slug::filter("Hello World What's Up?");

.. code-block:: text

    hello-world-whats-up

You can pass it a separator as well:

.. code-block:: php

    echo Pop\Filter\Slug::filter("About Us : Company : President", ' : ');

.. code-block:: text

    about-us/company/president

Random String
~~~~~~~~~~~~~

The ``Pop\Filter\Random`` has 4 constants you can combine to tailor your
results:

- ``Pop\Filter\Random::ALPHA``
- ``Pop\Filter\Random::ALPHANUM``
- ``Pop\Filter\Random::LOWERCASE``
- ``Pop\Filter\Random::UPPERCASE``

.. code-block:: php

    echo Pop\Filter\Random::create(8, Random::ALPHANUM|Random::LOWERCASE);

.. code-block:: text

    sjd873k3

Links
~~~~~

.. code-block:: php

    $text = <<<TEXT
    www.popphp.org is a website.
    Another website is http://www.google.com/
    An email address is test@test.com.
    TEXT;

    echo Pop\Filter\Links::filter($text);

.. code-block:: text

    <a href="http://www.popphp.org">www.popphp.org</a> is a website.
    Another website is <a href="http://www.google.com/">http://www.google.com/</a>
    An email address is <a href="mailto:test@test.com">test@test.com</a>.

Convert Case
~~~~~~~~~~~~

.. code-block:: php

    echo Pop\Filter\ConvertCase::underscoreToCamelcase('myapp_table_users');

.. code-block:: text

    MyTableUsers

.. code-block:: text

    // The separator defaults to DIRECTORY_SEPARATOR, but you can pass
    // a custom value in as well
    echo Pop\Filter\ConvertCase::camelCaseToSeparator('MyTableUsers');

    My/Table/Users

pop-css
=======

The `popphp/pop-css` component is a component for rendering and parsing CSS files.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-css

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-css": "1.0.*",
        }
    }

Basic Use
---------

The `popphp/pop-css` provides the ability to create new CSS files as well as
parse existing ones. There is support for media queries and comments as well.

Creating CSS
~~~~~~~~~~~~

.. code-block:: php

    use Pop\Css\Css;
    use Pop\Css\Selector;

    $css = new Css();

    $html = new Selector('html');
    $html->setProperties([
        'margin'  => 0,
        'padding' => 0,
        'background-color' => '#fff',
        'font-family' => 'Arial, sans-serif'
    ]);

    $login = new Selector('#login');
    $login->setProperty('margin', 0);
    $login->setProperty('padding', 0);

    echo $css;

The above code will produce:

.. code-block:: css

    html {
        margin: 0;
        padding: 0;
        background-color: #fff;
        font-family: Arial, sans-serif;
    }

    #login {
        margin: 0;
        padding: 0;
    }

Parsing a CSS file
~~~~~~~~~~~~~~~~~~

.. code-block:: php

    use Pop\Css\Css;
    $css = Css::parseFile('styles.css');
    $login = $css->getSelector('#login');
    echo $login['margin'];


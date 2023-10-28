pop-color
==========

The `popphp/pop-color` component is a helpful component to manage different types of color values
and conversions. Supported color formats include:

* RGB
* HEX
* HSL
* CMYK
* Grayscale

Installation
------------

Composer
~~~~~~~~

If you want to install it via composer you can install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-color

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-color": "^1.0.0"
        }
    }

Basic Use
---------

Create a Color Object
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: php

    $rgb = Color::rgb(120, 60, 30, 0.5);
    echo $rgb . PHP_EOL;

The above command will print the default CSS format:

.. code-block:: text

    rgba(120, 60, 30, 0.5)

Convert to another color format:

.. code-block:: php

    $hex = $rgb->toHex();
    echo $hex . PHP_EOL;


.. code-block:: text

    #783c1e


.. code-block:: php

    $hsl = $hex->toHsl();
    echo $hsl . PHP_EOL;

.. code-block:: text

    hsl(20, 75%, 47%)


.. code-block:: php

    $cmyk = $rgb->toCmyk();
    echo $cmyk . PHP_EOL; // Will print a string of space-separated percentages, common to a PDF color format


.. code-block:: text

    0 0.5 0.75 0.53


Accessing Color Properties
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: php

    $rgb = Color::rgb(120, 60, 30, 0.5);
    echo $rgb->getR() . PHP_EOL;
    echo $rgb->getG() . PHP_EOL;
    echo $rgb->getB() . PHP_EOL;
    echo $rgb->getA() . PHP_EOL;


.. code-block:: text

    120
    60
    30
    0.5

.. code-block:: php

    $cmyk = Color::cmyk(60, 30, 20, 50);
    echo $cmyk->getC() . PHP_EOL;
    echo $cmyk->getM() . PHP_EOL;
    echo $cmyk->getY() . PHP_EOL;
    echo $cmyk->getK() . PHP_EOL;


.. code-block:: text

    60
    30
    20
    50

Parse Color Strings
~~~~~~~~~~~~~~~~~~~

.. code-block:: php

    $rgb = Color::parse('rgba(120, 60, 30, 0.5)');
    echo $rgb->getR() . PHP_EOL;
    echo $rgb->getG() . PHP_EOL;
    echo $rgb->getB() . PHP_EOL;
    echo $rgb->getA() . PHP_EOL;
    echo $rgb . PHP_EOL;


.. code-block:: text

    120
    60
    30
    0.5
    rgba(120, 60, 30, 0.5)

 
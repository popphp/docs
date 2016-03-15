Pop\\Loader
===========

The `popphp/pop-loader` component provides an alternative autoloading option for those who may
require a PHP application to function outside of the Composer eco-system. The API mirrors Composer's
API so that the two autoloaders are interchangeable. Furthermore, the component provides a class
mapper class that will parse a provided source folder and generate a static classmap for faster
autoload times.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-loader

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-loader": "2.0.*",
        }
    }

Basic Use
---------

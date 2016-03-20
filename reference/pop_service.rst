Pop\\Service
============

The ``Pop\Service`` sub-component is part of the core `popphp/popphp` component. It serves as the
service locator for the main application object. With it, you can wire up services that may be needed
during the life-cycle of the application and call them when necessary.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/popphp

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/popphp": "2.0.*",
        }
    }

Basic Use
---------

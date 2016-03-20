Pop\\Module
===========

The ``Pop\Module`` sub-component is part of the core `popphp/popphp` component. It serves as the
module manager to the main application object. With it, you can inject module objects that serve as
"mini-application objects," which can extend the functionality and features of your main application.

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

pop-config
==========

The `popphp/pop-config` component is a configuration component that allows you to store configuration
data for the life cycle of your application. It also has the ability to parse existing and common
configuration formats, such as INI, JSON and XML files.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-config

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-config": "3.0.*",
        }
    }

Basic Use
---------

The values of a config object can be access either via object arrow notation or as an array:

.. code-block:: php

    $config = new Pop\Config\Config(['foo' => 'bar']);

    $foo = $config->foo;
    // OR
    $foo = $config['foo'];

By default, the config object is set to not direct allow changes to its values, unless the ``$allowChanges``
property is set to ``true``. The following example isn't possible unless the ``$allowChanges`` property is
set to ``true``.

.. code-block:: php

    $config = new Pop\Config\Config(['foo' => 'bar'], true);
    $config->foo   = 'baz';
    // OR
    $config['foo'] = 'new';

However, if the ``$allowChanges`` property is set to false, you can append new values to the
config object with the ``merge()`` method.

.. code-block:: php

    $config = new Pop\Config\Config($configData);
    $config->merge($newData);

And, if you need to convert the configuration object down to a simple array, you can do so:

.. code-block:: php

    $config = new Pop\Config\Config($configData);
    $data   = $config->toArray();

Parsing a Config File
---------------------

Let's look at the following example ``ini`` configuration file:

.. code-block:: text

    ; This is a sample configuration file config.ini
    [foo]
    bar = 1
    baz = 2

You would just pass that file into the constructor on object instantiation, and then access
the configuration values like so:

.. code-block:: php

    $config = new Pop\Config\Config('/path/to/config.ini');

    $bar = $config->foo->bar; // equals 1
    $baz = $config->foo->baz; // equals 2


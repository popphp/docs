Pop\\Archive
============

The `popphp/pop-archive` component provides a normalized interface and integrated adapters
to let a user decompress, extract, package and compress files in a common archive format.
The supported formats are:

* tar
* tar.gz
* tar.bz2
* zip
* rar (extract-only)

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-archive

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-archive": "2.0.*",
        }
    }

Extracting Files
----------------

Compressing Files
-----------------
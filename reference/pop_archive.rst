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

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.zip');
    $archive->extract('/path/to/extract/files');

### Extract a tar.gz archive

.. code-block:: php

    // It will auto-detect and automatically decompress a compressed TAR file
    $archive = new Pop\Archive\Archive('test.tar.gz');
    $archive->extract('/path/to/extract/files');

Compressing Files
-----------------

Add files to a zip archive

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.zip');
    $archive->addFiles('/path/to/single/file.txt');
    $archive->addFiles([
        '/path/to/multiple/files1.txt',
        '/path/to/multiple/files2.txt',
        '/path/to/multiple/files3.txt',
    ]);


Add files to a tar archive and compress

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.tar');
    $archive->addFiles('/path/to/folder/of/files');

    // Creates the compressed archive file 'test.tar.bz2'
    $archive->compress('bz2');


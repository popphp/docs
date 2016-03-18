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

You can pass it any of the supported archive file types and extract them:

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.zip');
    $archive->extract('/path/to/extract/files');

If the archive file is compressed, it will decompress it first:

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.tar.gz');
    $archive->extract('/path/to/extract/files');

Compressing Files
-----------------

To add files to an archive, you pass it the archive filename (new or existing),
and then call either the ``addFile`` method or the ``addFiles`` method:

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.zip');
    $archive->addFiles('/path/to/single/file.txt');
    $archive->addFiles([
        '/path/to/multiple/files1.txt',
        '/path/to/multiple/files2.txt',
        '/path/to/multiple/files3.txt',
    ]);


To compress an TAR archive file, you call the ``compress`` method and pass it either
`gz` or `bz2`:

.. code-block:: php

    $archive = new Pop\Archive\Archive('test.tar');
    $archive->addFiles('/path/to/folder/of/files');

    // Creates the compressed archive file 'test.tar.bz2'
    $archive->compress('bz2');


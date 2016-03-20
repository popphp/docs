Pop\\File
=========

The `popphp/pop-file` component provides an API to manage file uploads and easy traversal of directories.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-file

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-file": "2.0.*",
        }
    }

Basic Use
---------

File Uploads
~~~~~~~~~~~~

With the file upload class, you can not only control basic file uploads, but also enforce a set of rules
and conditions to control what type of files are uploaded. Please note, the ``upload()`` method expects
to have an element from the ``$_FILES`` array passed into it.

.. code-block:: php

    use Pop\File\Upload;

    $upload = new Upload('/path/to/uploads');
    $upload->useDefaults();

    $upload->upload($_FILES['file_upload']);

    // Do something with the newly uploaded file
    if ($upload->isSuccess()) {
        $file = $upload->getUploadedFile();
    } else {
        echo $upload->getErrorMessage();
    }

The ``setDefaults()`` method sets a standard group of rules and conditions for basic web file uploads.
The max filesize is set to 10 MBs and a set of media and document file types (jpg, pdf, doc, etc.) are
set as `allowed` and a set of web and script file types (js, php, html, etc.) are set as `disallowed`.

If you'd like to set your own custom rules, you can do so like this:

.. code-block:: php

    use Pop\File\Upload;

    $upload = new Upload('/path/to/uploads');
    $upload->setMaxSize(25000000)
           ->setAllowedTypes('pdf')
           ->setDisallowedTypes('php');

The example above sets the max filesize to 25 MBs and allows only PDF files and disallows PHP files.

**Checking file names**

The upload object is set to NOT overwrite existing files on upload. It will perform a check and rename
the uploaded file accordingly with a underscore and a number ('filename_1.doc', 'filename_2.doc', etc.)
If you may want to test the filename on your own you can like this:

.. code-block:: php

    use Pop\File\Upload;

    $upload   = new Upload('/path/to/uploads');
    $fileName = $upload->checkFilename($_FILES['file_upload']['name']);

If the name of the file being uploaded is found on disk in the upload directory, the returned value of
the newly renamed file will be something like 'filename_1.doc'. You can then pass that value (or any
other custom filename value) into the ``upload()`` method:

.. code-block:: php

    $upload->upload($_FILES['file_upload'], $fileName);

If you want to override this behavior and overwrite any existing files, you can set the overwrite property
before you upload the file:

.. code-block:: php

    $upload->overwrite(true);

Directories
~~~~~~~~~~~

The directory object provides the ability to perform directory traversals, recursively or non, while
setting configuration parameters to tailor the results to how you would like them.

**Simple flat directory traversal**

.. code-block:: php

    use Pop\File\Dir;

    $dir = new Dir('my-dir');

    foreach ($dir->getFiles() as $file) {
        echo $file;
    }

The above example will just echo out the base name of each file and directory in the first level
of the directory:

.. code-block:: text

    some-dir1
    some-dir2
    file1.txt
    file2.txt
    file3.txt

If you want to have only files in your results, then you can set the `filesOnly` option:

.. code-block:: php

    use Pop\File\Dir;

    $dir = new Dir('my-dir', ['filesOnly' => true]);

**Recursive traveral**

In the following example, we'll set it to traverse the directory recursively, get only the files and
store the absolute path of the files:

.. code-block:: php

    use Pop\File\Dir;

    $dir = new Dir('my-dir', [
        'recursive' => true,
        'filesOnly' => true,
        'absolute'  => true
    ]);

    foreach ($dir->getFiles() as $file) {
        echo $file;
    }

The result would look like:

.. code-block:: text

    /path/to/my-dir/file1.txt
    /path/to/my-dir/file2.txt
    /path/to/my-dir/file3.txt
    /path/to/my-dir/some-dir1/file1.txt
    /path/to/my-dir/some-dir1/file2.txt
    /path/to/my-dir/some-dir2/file1.txt
    /path/to/my-dir/some-dir2/file2.txt

If you wanted the relative paths instead, you could set the `relative` option:

.. code-block:: php

    use Pop\File\Dir;

    $dir = new Dir('my-dir', [
        'recursive' => true,
        'filesOnly' => true,
        'relative'  => true
    ]);

    foreach ($dir->getFiles() as $file) {
        echo $file;
    }

In which the result would look like:

.. code-block:: text

    ./file1.txt
    ./file2.txt
    ./file3.txt
    ./some-dir1/file1.txt
    ./some-dir1/file2.txt
    ./some-dir2/file1.txt
    ./some-dir2/file2.txt

**Emptying a directory**

You can empty a directory as well:

.. code-block:: php

    use Pop\File\Dir;

    $dir = new Dir('my-dir');
    $dir->emptyDir(true);

The `true` flag sets it to delete the actual directory as well.

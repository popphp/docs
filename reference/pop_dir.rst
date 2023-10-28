pop-dir
=======

The `popphp/pop-dir` component provides an API to easily manage traversal of directories.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-dir

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-dir": "^4.0.0"
        }
    }

Basic Use
---------

The directory object provides the ability to perform directory traversals, recursively or non, while
setting configuration parameters to tailor the results to how you would like them.

**Simple flat directory traversal**

.. code-block:: php

    use Pop\Dir\Dir;

    $dir = new Dir('my-dir');

    foreach ($dir as $file) {
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

    use Pop\Dir\Dir;

    $dir = new Dir('my-dir', ['filesOnly' => true]);

**Recursive traveral**

In the following example, we'll set it to traverse the directory recursively, get only the files and
store the absolute path of the files:

.. code-block:: php

    use Pop\Dir\Dir;

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

    use Pop\Dir\Dir;

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

    use Pop\Dir\Dir;

    $dir = new Dir('my-dir');
    $dir->emptyDir(true);

The `true` flag sets it to delete the actual directory as well.

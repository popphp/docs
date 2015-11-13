CLI and the Console
===================

In writing an application tailored for the CLI, you can leverage the `popphp/pop-console`
component to help you configure and build your application for the console.

CLI
---

While there is support for CLI-based applications to run on both Windows and Linux/Unix
based systems, the `popphp/pop-console` component's colorize feature is not supported in Windows
CLI-based applications.

Before getting into utilizing the `popphp/pop-console` component with CLI-based applications,
let's take a look at some simple CLI scripts to call and execute your PHP scripts. For these
examples, let's assume you have a small PHP script like this:

.. code-block:: php

    <?php
    echo 'Hello ' . $argv[1];

If we would like to access and run that script via a simple command, there a few ways to do it.

**Natively on Linux/Unix**

Add `#!/usr/bin/php` as the first line to the PHP script above (or wherever your PHP
binary is located):

.. code-block:: php
    #!/usr/bin/php
    <?php
    echo 'Hello, ' . $argv[1];

You can then name the script without a PHP extension, for example `foo`, make it executable and run it.

.. code-block:: bash

    $ ./foo pop

**Bash**

If you want to use a BASH script as a wrapper to access and run your PHP script, named `foo.php` in this
case, then you can create a BASH script file like this:

.. code-block:: bash

    #!/bin/bash
    php ./foo.php $@

Let's name the BASH script `app` and make it executable. Then you can run it like this:

.. code-block:: bash

    $ ./app pop

**Windows Batch**

Similarly on Windows, you can create a batch file to do the same. Let's create a batch file called `app.bat`:

.. code-block:: batch

    @echo off
    php foo.php %*

Then on the Windows command line, you can run:

.. code-block:: batch

    C:\> app pop

**Arguments**

In the above examples, the initial example PHP script is accessing an argument from the `$argv` array,
which is common. As you can see, all the examples pushed the argument value of 'pop' into the script, as to
echo `Hello, pop` on the screen. While PHP can access that value via the  `$argv` array, BASH scripts and
batch files can pass them into the PHP scripts via:

.. code-block:: bash

    #!/bin/bash
    php ./foo.php $1 $2 $3

.. code-block:: batch

    @echo off
    php foo.php %1 %2 %3

Of course, those examples only allow for up to 3 arguments to be passed. So, as you can see, the examples
above for BASH and batch files use the catch-alls `$@` and `%*` respectively, to allow all possible parameters
to be passed into the PHP script.

Console
-------
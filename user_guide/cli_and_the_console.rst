CLI and the Console
===================

In writing an application tailored for the CLI, you can leverage the `popphp/pop-console`
component to help you configure and build your application for the console. Please note,
While there is support for CLI-based applications to run on both Windows and Linux/Unix
based systems, the `popphp/pop-console` component's colorize feature is not supported in Windows
CLI-based applications.

CLI
---

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

.. code-block:: bash

    #!/bin/bash
    php ./foo.php $@

.. code-block:: batch

    @echo off
    php foo.php %*

Console
-------

Using the `popphp/pop-console` component when building a CLI-based application with Pop gives you
access to a set of features that facilitate the routing and display of your application.

.. code-block:: php

    $console = new Pop\Console\Console();

Here's a look at the basic API:

* ``$console->setWidth(80);`` - sets the character width of the console
* ``$console->setIndent(4);`` - sets the indentation in spaces at the start of a line
* ``$console->colorize($string, $fg, $bg);`` - colorize the string and return the value
* ``$console->prompt($prompt, $options, $caseSensitive, $length);`` - call a prompt and return the answer
* ``$console->append($text = null, $newline = true);`` - appends text to the current console response body
* ``$console->write($text = null, $newline = true);`` - appends text to the current console response body and sends the response
* ``$console->send();`` - sends the response
* ``$console->clear();`` - clears the console screen (Linux/Unix only)

Commands
~~~~~~~~

When using the `popphp/pop-console` component, you can create command objects and add them to the console object.
This is useful for storing and calling help screens on a per-command basis

**Using a Command**

.. code-block:: php

    use Pop\Console\Console;
    use Pop\Console\Command;

    $edit = new Command('edit');
    $edit->setHelp('This is the help screen for the edit command.');

    $console = new Console();
    $console->addCommand($edit);

    $console->append($console->help('edit'));
    $console->send();

And if you wire up your controller correctly, the following example would be output like below:

.. code-block:: bash

    $ ./pop edit help
      This is the help screen for the edit command.

Prompts
~~~~~~~

With the `popphp/pop-console` component, you can call a prompt to read in user input:

.. code-block:: php

    $input = $console->prompt('Are you sure? [Y/N]', ['Y', 'N']);

What the above line of code does is echo the prompt to the user and once the user enters an answer,
that answer gets returned back and stored in the variable `$input`. The `$options` array allows you
to enforce a certain set of options. Failure to input one of those options will result in the prompt
being printed to the console screen again.

Colors
~~~~~~

As mentioned before, on terminals that support basic ANSI color, such as on a Linux or Unix machine,
you can colorize your text:

.. code-block:: php

    use Pop\Console\Console;

    $coloredText = $console->colorize('Hello World!', Console::BOLD_CYAN);
    $console->append($coloredText);

The list of available color constants are:

* NORMAL
* BLACK
* RED
* GREEN
* YELLOW
* BLUE
* MAGENTA
* CYAN
* WHITE
* GRAY
* BOLD_RED
* BOLD_GREEN
* BOLD_YELLOW
* BOLD_BLUE
* BOLD_MAGENTA
* BOLD_CYAN
* BOLD_WHITE

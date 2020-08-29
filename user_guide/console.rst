Console
=======

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

Here's a look at the basic API:

* ``$console->setWidth(80);`` - sets the character width of the console
* ``$console->setIndent(4);`` - sets the indentation in spaces at the start of a line
* ``$console->setHeader($header);`` - sets a header to prepend to the output
* ``$console->setFooter($footer);`` - sets a footer to append to the output
* ``$console->colorize($string, $fg, $bg);`` - colorize the string and return the value
* ``$console->setHelpColors($color1, $color2, $color3);`` - set colors to use for the help screen
* ``$console->addCommand($command);`` - add a command to the console object
* ``$console->addCommands($commands);`` - add an array of commands to the console object
* ``$console->addCommandsFromRoutes($routeMatch, $scriptName = null);`` - add commands based on routes config
* ``$console->prompt($prompt, $options, $caseSensitive, $length, $withHeaders);`` - call a prompt and return the answer
* ``$console->append($text = null, $newline = true);`` - appends text to the current console response body
* ``$console->write($text = null, $newline = true, $withHeaders = true);`` - appends text to the current console response body and sends the response
* ``$console->send();`` - sends the response
* ``$console->help();`` - sends the auto-generated help screen
* ``$console->clear();`` - clears the console screen (Linux/Unix only)

You can use a console object to manage and deploy output to the console, including a prepended
header and appended footer.

.. code-block:: php

    $console = new Pop\Console\Console();
    $console->setHeader('My Application');
    $console->setFooter('The End');

    $console->append('Here is some console information.');
    $console->append('Hope you enjoyed it!');

    $console->send();

The above will output:

.. code-block:: text

        My Application

        Here is some console information.
        Hope you enjoyed it!

        The End

Console Colors
~~~~~~~~~~~~~~

On consoles that support it, you can colorize text outputted to the console with the
``colorize()`` method:

.. code-block:: php

    $console->append(
        'Here is some ' .
        $console->colorize('IMPORTANT', Console::BOLD_RED) .
        ' console information.'
    );

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

Using a Prompt
~~~~~~~~~~~~~~

You can also trigger a prompt to get information from the user. You can enforce
a certain set of options as well as whether or not they are case-sensitive:

.. code-block:: php

    $console = new Pop\Console\Console();
    $letter  = $console->prompt(
        'Which is your favorite letter: A, B, C, or D? ',
        ['A', 'B', 'C', 'D'],
        true
    );
    echo 'Your favorite letter is ' . $letter . '.';


.. code-block:: bash

    ./pop
    Which is your favorite letter: A, B, C, or D? B   // <- User types 'B'
    Your favorite letter is B.

Help Screen
~~~~~~~~~~~

You can register commands with the console object to assist in auto-generating
a well-formatted, colorized help screen.

.. code-block:: php

    use Pop\Console\Console;
    use Pop\Console\Command;

    $edit = new Command(
        'user edit', '<id>', 'This is the help for the user edit command'
    );

    $remove = new Command(
        'user remove', '<id>', 'This is the help for the user remove command'
    );

    $console = new Console();
    $console->addCommand($edit);
    $console->addCommand($remove);
    $console->setHelpColors(
        Console::BOLD_CYAN,
        Console::BOLD_GREEN,
        Console::BOLD_YELLOW
    );

Once the commands are registered with the main `$console` object, we can generate
the help screen like this:

.. code-block:: php

    $console->help();

The above command will output an auto-generated, colorized help screen with the commands
that are registered with the console object.

**Auto-Wire Help from Console Routes**

You can add a ``help`` value to the routes configuration and then auto-wire the commands
and their respective help messages into the console object. You can do this with the method:

* ``$console->addCommandsFromRoutes($routeMatch, $scriptName = null);``

The ``$scriptName`` parameter will set the correct script name in the help screen output.

Consider the following CLI routes config file:

.. code-block:: php

    <?php

    return [
        'users show' => [
            'controller' => 'MyApp\Console\Controller\UsersController',
            'action'     => 'index',
            'help'       => "Display users"
        ],
        'user:create' => [
            'controller' => 'MyApp\Console\Controller\UsersController',
            'action'     => 'create',
            'help'       => "Create user"
        ]
    ];

Then, when you are setting up your console controller and the console object in that controller,
you can wire up the help commands like this:

.. code-block:: php

    class ConsoleController extends AbstractController
    {

        /**
         * Application object
         * @var Application
         */
        protected $application = null;

        /**
         * Console object
         * @var \Pop\Console\Console
         */
        protected $console = null;

        /**
         * Constructor for the console controller
         *
         * @param  Application $application
         * @param  Console     $console
         */
        public function __construct(Application $application, Console $console)
        {
            $this->application = $application;
            $this->console     = $console;

            $this->console->setHelpColors(
                Console::BOLD_CYAN, Console::BOLD_GREEN, Console::BOLD_MAGENTA
            );

            $this->console->addCommandsFromRoutes(
                $application->router()->getRouteMatch(), './app'
            );
        }

    }

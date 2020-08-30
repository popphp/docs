pop-console
===========

The `popphp/pop-console` component is a component for integration and managing a console user interface
with your application. It supports the various aspects of the CLI user experience, colorization and prompt input.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-console

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-console": "^3.1.0",
        }
    }

Basic Use
---------

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
        ],
        'help' => [
            'controller' => 'MyApp\Console\Controller\ConsoleController',
            'action'     => 'help',
            'help'       => "Display help"
        ],
    ];

Then, when you are setting up your console controller and the console object in that controller,
you can wire up the help commands like this:

.. code-block:: php

    namespace MyApp\Console\Controller;

    use Pop\Application;
    use Pop\Console\Console;

    class ConsoleController extends AbstractController
    {

        /**
         * Application object
         * @var Application
         */
        protected $application = null;

        /**
         * Console object
         * @var Console
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

        /**
         * Help command
         *
         * @return void
         */
        public function help()
        {
            $this->console->help();
        }

    }

Using the method ``setHelpColors()`` provides some control to allow the help screen text to be
divided into different colors for readability. With this set up, you can then run the following
command to display the help screen:

.. code-block:: bash

    $ ./app help

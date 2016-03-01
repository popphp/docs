Application Structure
=====================

After installation, if you take a look at the files and folders in the tutorial application,
you'll see the following:

* app/

  - config/
  - data/
  - src/
  - view/

* public/
* script/
* vendor/

The ``app/`` folder contains the main set of folders and files that main the application work.
The ``data/`` folder contains the SQLite database file. The ``public/`` folder is the web document
root. And the ``script/`` folder contains the main script to trigger the CLI side of the
application.

This structure isn't necessarily set in stone, but it follows a typical structure that one might
expect to see within an application. Within the ``app/config/`` and ``app/src/Controller/``, you'll
see files specific to the current environment of the application, web or console. Each environment
is explained more in depth in the next sections.

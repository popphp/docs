Views
=====

The ``popphp/pop-view`` component provides the functionality for creating and rendering views within
your application. Data can be passed into a view, filtered and pushed out to the UI of the application
to be rendering within the view template. As mentioned in the `MVC section`_ of the user guide, the
``popphp/pop-view`` component supports both file-based and stream-based templates.

Files
-----

With file-based view templates, the view object utilizes traditional PHP script files with the extension
``.php`` or ``.phtml``. The benefit of this type of template is that you can fully leverage PHP in manipulating
and displaying your data in your view.

Let's revisit and expand upon the basic example given in the previous `MVC section`_. First let's take a
look at the view template, ``index.phtml``:

.. code-block:: php

    <!DOCTYPE html>
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>
    <body>
        <h1><?=$title; ?></h1>
    <?=$content; ?>
        <ul>
    <?php foreach ($links as $url => $link): ?>
            <li><a href="<?=$url; ?>"><?=$link; ?></a></li>
    <?php endforeach; ?>
        </ul>
    </body>

    </html>

Then, we can set up the view and its data like below. Notice in the script above, we've set it up to loop
through an array of links with the ``$links`` variable.

.. code-block:: php

    $data = [
        'title'   => 'View Example',
        'content' => '    <p>Some page content.</p>',
        'links'   => [
            'http://www.popphp.org/'     => 'Pop PHP Framework',
            'http://popcorn.popphp.org/' => 'Popcorn Micro Framework',
            'http://www.phirecms.org/'   => 'Phire CMS'
        ]
    ];

    $view = new Pop\View\View('index.phtml', $data);

    echo $view;

The result of the above example is:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
        <title>View Example</title>
    </head>
    <body>
        <h1>View Example</h1>
        <p>Some page content.</p>
        <ul>
            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li><a href="http://popcorn.popphp.org/">Popcorn Micro Framework</a></li>
            <li><a href="http://www.phirecms.org/">Phire CMS</a></li>
        </ul>
    </body>

    </html>

As mentioned before, the benefit of using file-based templates is you can fully leverage PHP within the
script file. Of course, one common thing that can be utilized when using file-based templates is file
includes. This helps tidy up your template code and makes script files easier to manage by re-using
template code. Here's an example that would work for the above script:

**header.phtml**

.. code-block:: php

    <!DOCTYPE html>
    <html>

    <head>
        <title><?=$title; ?></title>
    </head>
    <body>

**footer.phtml**

.. code-block:: php

    </body>

    </html>


**index.phtml**

.. code-block:: php

    <?php include __DIR__ . '/header.phtml'; ?>
        <h1><?=$title; ?></h1>
    <?=$content; ?>
        <ul>
    <?php foreach ($links as $url => $link): ?>
            <li><a href="<?=$url; ?>"><?=$link; ?></a></li>
    <?php endforeach; ?>
        </ul>
    <?php include __DIR__ . '/footer.phtml'; ?>

Streams
-------

With stream-based view templates, the view object uses a string template to render the data within the view.
While using this method doesn't allow the use of PHP directly in the template like the file-based templates
do, it does support basic logic and iteration to manipulate your data for display. The benefit of this
is that it provides some security in locking down a template and not allowing PHP to be directly processed
within it. Additionally, the template strings can be easily stored and managed within the application and
remove the need to have to edit and transfer template files to the server. This is a common tactic used by
content management systems that have template functionality built into them.

Let's look at the same example from above, but with a stream template:

.. code-block:: php

    $tmpl = <<<TMPL
    <!DOCTYPE html>
    <html>

    <head>
        <title>[{title}]</title>
    </head>
    <body>
        <h1>[{title}]</h1>
    [{content}]
        <ul>
    [{links}]
            <li><a href="[{key}]">[{value}]</a></li>
    [{/links}]
        </ul>
    </body>

    </html>
    TMPL;

The above code snippet is a template stored as string. The stream-based templates use a system of placeholders
to mark where you want the value to go within the template string. This is common with most string-based templating
engines. In the case of ``popphp/pop-view``, the placeholder uses the square bracket/curly bracket combination
to wrap the variable name, such as ``[{title}]``. In the special case of arrays, where iteration is allowed,
the placeholders are marked the same way, but have an end mark like you see in the above template: ``[{links}]``
to ``[{/links}]``. The iteration you need can happen in between those placeholder marks.

And, using the exact same examples from above, except passing the string template, ``$tmpl``, into the view
constructor:

.. code-block:: php

    $data = [
        'title'   => 'View Example',
        'content' => '    <p>Some page content.</p>',
        'links'   => [
            'http://www.popphp.org/'     => 'Pop PHP Framework',
            'http://popcorn.popphp.org/' => 'Popcorn Micro Framework',
            'http://www.phirecms.org/'   => 'Phire CMS'
        ]
    ];

    $view = new Pop\View\View($tmpl, $data);

    echo $view;

We can achieve exact same results as above:

.. code-block:: html

    <!DOCTYPE html>
    <html>

    <head>
        <title>View Example</title>
    </head>
    <body>
        <h1>View Example</h1>
        <p>Some page content.</p>
        <ul>
            <li><a href="http://www.popphp.org/">Pop PHP Framework</a></li>
            <li><a href="http://popcorn.popphp.org/">Popcorn Micro Framework</a></li>
            <li><a href="http://www.phirecms.org/">Phire CMS</a></li>
        </ul>
    </body>

    </html>

As mentioned before, the benefit of using stream-based templates is you can limit the use of PHP within
the template for security, and more importantly, store the template strings within the application for
easier access and management for the application users. And, streams can be stored in a number of ways.
The most common is as a string in the application's database that gets passed in to the view's constructor.
But, you can store them in a text-based file, such as ``index.html`` or ``template.txt``, and the view
constructor will detect that and grab the string contents from that template file. This will be applicable
when we cover includes and inheritance, and you need to be able to reference other string-based templates
outside of the main one currently being used by the view object.

Stream Syntax
-------------

Scalars
~~~~~~~

Arrays
~~~~~~

Includes
~~~~~~~~

Inheritance
~~~~~~~~~~~

Conditionals
~~~~~~~~~~~~


Filtering Data
--------------

.. _MVC section: ./mvc.html#views
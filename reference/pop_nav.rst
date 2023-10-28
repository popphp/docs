pop-nav
=======

The `popphp/pop-nav` component provides an API for managing the creation of web-based navigation
objects. It also supports an ACL object from the `popphp/pop-acl` component to enforce access rights
within the navigation object.

Installation
------------

Install it directly into your project:

.. code-block:: bash

    composer require popphp/pop-nav

Or, include it in your composer.json file:

.. code-block:: json

    {
        "require": {
            "popphp/pop-nav": "^4.0.0"
        }
    }

Basic Use
---------

First, you can define the navigation tree:

.. code-block:: php

    $tree = [
        [
            'name'     => 'First Nav Item',
            'href'     => '/first-page',
            'children' => [
                [
                    'name' => 'First Child',
                    'href' => 'first-child'
                ],
                [
                    'name' => 'Second Child',
                    'href' => 'second-child'
                ]
            ]
        ],
        [
            'name' => 'Second Nav Item',
            'href' => '/second-page'
        ]
    ];


Then, you have a significant amount of control over the branch nodes
and attributes via a configuration array:

.. code-block:: php

    $config = [
        'top' => [
            'node'  => 'nav',
            'id'    => 'main-nav'
        ],
        'parent' => [
            'node'  => 'nav',
            'id'    => 'nav',
            'class' => 'level'
        ],
        'child' => [
            'node'  => 'nav',
            'id'    => 'menu',
            'class' => 'item'
        ],
        'on'  => 'link-on',
        'off' => 'link-off',
        'indent' => '    '
    ];

You can then create and render your nav object:

.. code-block:: php

    use Pop\Nav\Nav;

    $nav = new Nav($tree, $config);
    echo $nav;

.. code-block:: html

    <nav id="main-nav">
        <nav id="menu-1" class="item-1">
            <a href="/first-page" class="link-off">First Nav Item</a>
            <nav id="nav-2" class="level-2">
                <nav id="menu-2" class="item-2">
                    <a href="/first-page/first-child" class="link-off">First Child</a>
                </nav>
                <nav id="menu-3" class="item-2">
                    <a href="/first-page/second-child" class="link-off">Second Child</a>
                </nav>
            </nav>
        </nav>
        <nav id="menu-4" class="item-1">
            <a href="/second-page" class="link-off">Second Nav Item</a>
        </nav>
    </nav>

Advanced Use
------------

First, let's set up the ACL object with some roles and resources:

.. code-block:: php

    use Pop\Acl\Acl;
    use Pop\Acl\AclRole as Role;
    use Pop\Acl\AclResource as Resource;

    $acl = new Acl();

    $admin  = new Role('admin');
    $editor = new Role('editor');

    $acl->addRoles([$admin, $editor]);

    $acl->addResource(new Resource('second-child'));
    $acl->allow('admin');
    $acl->deny('editor', 'second-child');

And then we add the ACL rules to the navigation tree:

.. code-block:: php

    $tree = [
        [
            'name'     => 'First Nav Item',
            'href'     => '/first-page',
            'children' => [
                [
                    'name' => 'First Child',
                    'href' => 'first-child'
                ],
                [
                    'name' => 'Second Child',
                    'href' => 'second-child',
                    'acl'  => [
                        'resource' => 'second-child'
                    ]
                ]
            ]
        ],
        [
            'name' => 'Second Nav Item',
            'href' => '/second-page'
        ]
    ];

We then inject the ACL object into the navigation object, set the current role and render the navigation:

.. code-block:: php

    $nav = new Nav($tree, $config);
    $nav->setAcl($acl);
    $nav->setRole($editor);
    echo $nav;

.. code-block:: html

    <nav id="main-nav">
        <nav id="menu-1" class="item-1">
            <a href="/first-page" class="link-off">First Nav Item</a>
            <nav id="nav-2" class="level-2">
                <nav id="menu-2" class="item-2">
                    <a href="/first-page/first-child" class="link-off">First Child</a>
                </nav>
            </nav>
        </nav>
        <nav id="menu-3" class="item-1">
            <a href="/second-page" class="link-off">Second Nav Item</a>
        </nav>
    </nav>

Because the 'editor' role is denied access to the 'second-child' page, that nav branch is not rendered.

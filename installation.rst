Instalación
============

Hay un par de opciones diferentes para instalar el Framework Pop PHP. Puedes usar composer
o puedes descargar la versión independiente desde el sitio web http://www.popphp.org/.

Usando Composer
--------------

Si quieres usar el framework completo y todos sus componentes, puedes instalar el
repositorio ``popphp/popphp-framework`` de las siguientes maneras:

**Crear un nuevo proyecto**

.. code-block:: bash

    composer create-project popphp/popphp-framework project-folder

**Agregarlo al archivo composer.json**

.. code-block:: json

    "require": {
        "popphp/popphp-framework": "^4.1.0"
    }

**Agregarlo a un proyecto existente**

.. code-block:: bash

    composer require popphp/popphp-framework

Si sólo quieres usar los componentes centrales, puedes usar el repositorio ``popphp/popphp``
en lugar del repositorio completo ``popphp/popphp-framework``.

Instalación Independiente
------------------------

Si no deseas usar Composer y quieres instalar una version independiente de Pop, puedes
descargar una version comepleta del framework desde el sitio web http://www.popphp.org/.
Está configurada para aplicaciones web por defecto, pero se puede usar para manejar
aplicaciones CLI (de consola) también. Se incluyen los siguientes archivos:

* ``/public/``
    * ``index.php``
    * ``.htaccess``
* ``/vendor/``
* ``kettle``

La carpeta ``/vendor/`` contiene el autoloader, el framework y todos los componentes necesarios.
El script ``kettle`` es el script de ayuda basado en CLI que asiste en el scaffolding de la
aplicación y administración de la base de datos.


Requerimientos
------------

El único requerimiento para el Framework Pop PHP es que tengas instalado al menos **PHP 7.1.0**
en tu ambiente.

Recomendaciones
---------------

**Servidor Web**

Cuando se escriban aplicaciones web, es recomendable un servidor web que soporte reescrituras de URL,
como:

+ Apache
+ Nginx
+ Lighttpd
+ IIS

**Extensiones**

Varios componentes del Framework Pop PHP requieren deferentes extensiones de PHP para funcionar
correctamente. Si deseas tomar ventaja de los muchos componentes de Pop PHP, se recomiendan las
siguientes extensiones:

+ pop-db
    - mysqli
    - pdo_mysql
    - pdo_pgsql
    - pdo_sqlite
    - pgsql
    - sqlite3
    - sqlsrv

+ pop-image
    - gd
    - imagick*
    - gmagick*

+ pop-cache
    - apc
    - memcache
    - memcached
    - redis
    - sqlite3 or pdo_sqlite

+ pop-debug
    - redis
    - sqlite3 or pdo_sqlite

+ other
    - curl
    - ftp
    - ldap

\* - Las extensiones **imagick** y **gmagick** no se pueden usar simultáneamente.

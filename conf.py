import sys, os
from sphinx.highlighting import lexers
from pygments.lexers.web import PhpLexer

sys.path.append(os.path.abspath('_exts'))

extensions = []
master_doc = 'index'
highlight_language = 'php'

project = u'Pop PHP Framework'
copyright = u'2023 NOLA Interactive'

version = '4'
release = '4.7.0'

lexers['php'] = PhpLexer(startinline=True)


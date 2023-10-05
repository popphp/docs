import sys, os, sphinx_rtd_theme
from sphinx.highlighting import lexers
from pygments.lexers.web import PhpLexer

sys.path.append(os.path.abspath('_exts'))

extensions = [
  'sphinx_rtd_theme',
]
html_theme = 'sphinx_rtd_theme'
master_doc = 'index'
highlight_language = 'php'

project = u'Pop PHP Framework'
copyright = u'2023 NOLA Interactive'

version = '4'
release = '4.8.0'

lexers['php'] = PhpLexer(startinline=True)


from setuptools import setup, find_packages

version = '23.08.1'

setup(
    name='DJ Bootstrap Forms',
    version=version,
    description='Render Django forms for use with Bootstrap styles',
    classifiers=[
        # 'Development Status :: 5 - Production/Stable',
        'Development Status :: 4 - Beta',
        'Framework :: Django',
        'Programming Language :: Python',
    ],
    keywords='Django Forms Bootstrap',
    author='Paul Rentschler',
    author_email='paul@rentschler.ws',
    url='https://github.com/paulrentschler/dj-bootstrap-forms.git',
    license='MIT License',
    packages=find_packages(exclude=['ez_setup']),
    include_package_data=True,
    zip_safe=False,
    install_requires=[],
)

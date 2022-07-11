### Socket subastec [App]

## Documentación

Para la estructura de trabajo tenemos la carpeta app en donde corre toda la aplicacion de socket en el index inicia la aplicacion y se conecta a la base de datos Redis <br/>

En app.ts damos inicio al socket ahi realizamos la acciones de autopujar, a la hora de autopujar en comenzará un ciclo donde empieza a pujar infinitamente (de lo cual no debería pero está asi) allí guardamos en redis de manera local para persistir la data <br/>

Luego de correr la aplicacion el automáticamente ira compilando dentro de dist

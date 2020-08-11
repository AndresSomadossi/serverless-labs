01 - ColdStarts

Conclusiones

1. El tiempo de inicializacion es el tiempo que ocurre entre la invocacion de la funcion lambda, y el comienzo de la ejecucion del codigo del handler. Se computa como @initDuration, que cuando aparece como un campo en el report, indica que existió cold start en esa llamada, y su duración. Este tiempo esta compuesto por la duración de locacion del contexto de ejecucion (depende del servicio del servicio y del peso de nuestro código), mas el tiempo de ejecucion del codigo que este por fuera del handler (depende de la ejecución  de nuestro codigo).

2. El tiempo de inicializacion es considerado parte del timeout de la funcion, es decir, podemos obtener un timeout antes de llegar a ejecutar el handler.

3. El initDuration no es considerado para el billedDuration, siempre que sea menor a 10 seg (10000 ms), si nuestro cold start supera ese numero, pasa a considerarse como @duration, por lo que desaparece el valor de @initDuration y el total de la duración se cobra.

4. Cualquier codigo que pueda independiente del event que recibe el handler, deberia ser calculada fuera del mismo, con el objetivo de reducir la latencia (y el billing) en llamadas sucesivas. De esta forma, el tiempo extra, afectaria unicamente a las invocaciones que sufran un cold start.

5. Utilizando lambda con NodeJS, debido a la libreria require para la carga de depedencias, tenemos que tener cierto recaudos a la hora de colocar codigo por fuera del handler:

a. Debido require() carga los archivos de forma sincrónica, cualquier funcion async invocada en el body del archivo, será invocado en el momento de la carga del archivo, pero no se esperará a su finalización, pudiendo el handler ser invocado antes que finizalice la ejecucion, por lo tanto no lo podemos considerar como un metodo fiable de inicializacion.

b. La forma correcta de realizar esto, es lanzar la funcion asincrónica en body del archivo, a la promesa que retorne la vamos a guardar en una constante, que luego puede ser accedida en el handler. Para asegurarnos que la incializacion finalizó (o si incluso necesitamos acceder a un valor retornado) vamos a hacer un await a dicha variable para que evitar que la ejecucion del handler continúe hasta que la promesa salga de estado pending.
Debido a que normalmente gran parte de la espera va a ocurrir una vez que el handler se ejecuto (y se freno el await) el tiempo es facturado como parte del duration, por lo tanto nuestro @initTime va a ser muy pequeño, y el @duration en esa ejecucion, mas alto que las otras.

b. En el caso de cualquier código síncrono que coloque en el body del archivo, será ejecutado inmediatamente, pero en este caso, si se espera la finalización de su ejecución antes de que requiere devuelva el control y se invoque el handler, siendo un metodo fiable de inializacion.

c. Puedo incluir varias funciones un un solo archivo handler de entrypoint, de la siguiente manera, ambos ejemplos tienen el mismo comportamiento.
	// Short version
	module.exports = {
	  asyncBadInit: require('./src/asyncBadInit'),
	  syncInit: require('./src/syncInit'),
	};

	// With require on top
	const asyncBadInit = require('./src/asyncBadInit');
	const syncInit = require('./src/syncInit');

	module.exports = {
	  asyncBadInit,
	  syncInit,
	};

d. Si utilizo un unico entrypoint para todos mis handlers, al momento de la invocacion de la funcion Lambda, el entrypoint va a realizar la invocacion de require() que este declarado en el archivo, por lo que se presentan dos escenarios:
    1. Si las funciones poseen únicamente el handler (o funciones llamadas por él), la carga será normal y sin problemas.
    2. Si las funcionas poseen en el body llamados a funciones async, las mismas serán invocadas, aún cuando sus handler no sea llamado. En este caso, la ejecucion se detendrá únicamente en el await del handler llamado, siendo el tiempo de cold start dependiente del tiempo que dure la resolucion unicamente de esa promesa. Es importante tener en consideración que aunque no genere latencia directa, las otras funciones van a ocupar el event-loop y pueden generar efectos secundarios (como modificar variables de entorno).
    3. Si las funciones poseen en el body codigo sincronico, en este caso, los requiere() se irán ejecutando uno a uno, de arriba abajo y esperando la finalizacion del anterior antes de continuar, por lo que además de los problemas mencionados arriba, nuestra latencia total va a ser igual a la sumatoria de las latencias de inicializacion de cada una de las funciones! Por favor no hagan esto nunca.
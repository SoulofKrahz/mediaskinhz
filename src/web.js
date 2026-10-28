
/* ============ app web: instalación, versión, novedades y créditos (como Noticiahz y Caravanahz) ============
   - VER sale en Ajustes y la publicación la copia a version.txt; si hay una más nueva publicada, la app avisa.
   - En cada cambio: subir VER aquí y V en site/sw.js (formato AAAA-MM-DD-N y AAAA-MM-DD-N.M para cambios menores).
   - Solo se usa el service worker y la instalación cuando la página tiene manifest (la versión web, no la vista previa). */
const VER='2026-10-28-11';
const APP='Mediaskinhz';
const WEB=!!document.querySelector('link[rel=manifest]')&&/^https?:$/.test(location.protocol);
const SWOK=WEB&&'serviceWorker' in navigator&&window.isSecureContext;
const LOGO=`<span class="logo" role="img" aria-label="${APP}"><svg class="lgi" viewBox="0 0 64 64" aria-hidden="true"><use href="#logo-mark"/></svg><span class="lw" aria-hidden="true">mediaskin<em>hz</em></span><svg class="lp" viewBox="0 0 44 24" aria-hidden="true"><path d="M1 13H13L17 2L23 21L27 8L30 13H43"/></svg></span>`;

// Novedades: la primera es siempre la actual
const CHANGES=[
  ['2026-10-28-11',['Selector de diseños en el USB (Exportar → «Varios diseños en el USB»): eliges hasta 8 entre lo que tienes ahora, Mis diseños y los diseños listos; al arrancar con el USB, la radio enseña la lista y eliges con el dedo cuál instalar. Siempre lleva «Original de Renault», «Abrir Total Commander» y «Reiniciar». Cada diseño se instala completo (sin restos del anterior), con copia de seguridad y vuelta atrás si falla']],
  ['2026-10-28-10',['Las flechas grandes de avanzar y retroceder (presintonías, Multimedia, Driving eco) ya llevan el estilo del diseño listo, aunque vinieran de un diseño tuyo con otro estilo',
    'Estilos de líneas (Futurista, Neón, Halo, Contorno, Anillo, Esquinas…) sin placa negra encima: con un diseño listo el cuerpo del botón deja ver el fondo con un velo suave, también dentro de las pantallas (se calca el trozo de fondo que queda detrás de cada botón)',
    '7 diseños temáticos nuevos (31): Synthwave, Tron, Cyberpunk, Matrix, Luz ambiente, Deportivo rojo y Negro puro, cada uno con su propio fondo']],
  ['2026-10-28-9',['Diseños listos repasados uno a uno (24): fuera los que quedaban pobres (Píxel, Pestaña, Rejilla, Puntos, Mínimo) y nuevos Cristal ahumado, Neón dúo, Octógono violeta, Botón 3D, Titanio, Oro y Bronce',
    'Aluminio, Titanio, Oro y Bronce son metal de verdad: fondo de metal cepillado y botones oscuros para que el texto blanco de la radio se lea; Aluminio deja toda la radio en grises',
    'Dibujos con recuadro negro (la hoja de Driving eco, la carátula vacía, la imagen de balance…) con fondo transparente para que no quede una caja sobre el fondo de color',
    'Los botones a los que diste estilo en un diseño guardado antes de hoy (por ejemplo las flechas de presintonías) ya los cambia el diseño listo: los diseños guardan quién hizo cada imagen',
    'Anillo en Inicio ya no pisa el nombre del botón',
    '7 estilos nuevos (47): Metal de color, Aluminio cepillado, Cristal ahumado, Botón 3D, Neón dúo, Octógono y Etiqueta']],
  ['2026-10-28-8',['Diseños listos con fondo nuevo: en vez de teñir el de Renault (las rayas grises quedaban sucias), cada pantalla lleva un fondo oscuro con el color del diseño, un resplandor abajo y un dibujo suave que va con el estilo (rejilla, puntos, ondas, rayas…)',
    'Sin cajas negras alrededor de los botones de dentro: con un fondo de diseño listo sus esquinas son transparentes. El negro de iconos y recuadros también toma el tono del diseño',
    'Las miniaturas de los diseños ya no arrastran las esquinas del diseño que tengas puesto. Ocaso, menos amarillo']],
  ['2026-10-28-7',['Diseños listos de verdad en un toque: el fondo de cada pantalla se tiñe con el color del diseño (también el negro), igual que la barra de arriba, líneas, listas y ventanas',
    'Las flechas grandes de avanzar y retroceder (presintonías, carátulas, Driving eco) y demás botones de forma rara también cambian: toman el color del diseño sin deformarse',
    'Sin marcos de otro color: el borde morado de los botones de Multimedia sigue al color del diseño',
    'Anillo: el círculo solo sale en los botones con icono']],
  ['2026-10-28-6',['Diseños listos completos: además de los botones cambian los fondos, la barra de arriba, listas y barras de toda la radio',
    'Vista previa antes de aplicar: se abre con la pantalla grande, pasas por Inicio, Radio, Multimedia, Teléfono, Ajustes y Driving eco, pruebas otros diseños y solo se queda si pulsas «Aplicar». Cancelar no deja rastro',
    '10 estilos de botón más: Anillo, Pestaña, Esquinas, Píxel retro, Borde degradado, Hundido, Puntos, Onda, Dos tonos y Circuito (40 en total). 23 diseños listos']],
  ['2026-10-28-5',['Diseños listos en Pantalla → Inicio: 14 combinaciones de estilo y colores que se aplican de una vez a todos los botones de la radio (Inicio y dentro) y al negro de los fondos. Deshacer lo quita',
    '8 estilos de botón nuevos: Relieve, Halo, Ocaso, Rejilla, Diagonal, Muesca, Rayas y Cápsula brillante (30 en total)']],
  [VER,['Pantalla: arriba se ve el diseño que estás usando («Diseño «Biselado azul»», con aviso de cambios sin guardar, o «Diseño sin guardar»). Tócalo para ir a Mis diseños',
    'Al cargar o importar un diseño, la app te lleva a Pantalla para verlo']],
  ['2026-10-28-3',['Ventana de cada pantalla → Botones de esta pantalla: los estilos se ven en miniatura, dibujados sobre un botón de esa pantalla, y se aplican al momento al tocarlos (sin pedir confirmación; Deshacer lo quita)']],
  ['2026-10-28-2',['Driving eco: al exportar su casa, también se exporta la de 4WD (verde lima como ella; es la que parece usar tu radio en esa pantalla), dibujada igual y ajustada a su ancho. Si la radio usa la de Eco, no cambia nada',
    'El kit de letras de las casas incluye también la de 4WD (letra W)']],
  ['2026-10-28-1',['En la ventana de cada pantalla: «¿Un botón no cambia en el coche?». Descarga una prueba que pone una letra grande en cada casa (R, M, T, A, E, C) para ver en el coche qué imagen usa cada pantalla, y otro ZIP para quitarla y volver a tu diseño']],
  ['2026-10-28-0',['Ventana de cada pantalla mucho más corta: arriba la vista, luego «Botones de esta pantalla» (estilo, colores y tamaño de todos a la vez), el color de la pantalla y el fondo. «Su botón en Inicio» es una línea que abre su hoja, y «Todas las piezas» va plegado',
    'Exportar recuerda el modo que usaste la última vez (por ejemplo, Automático)',
    'El mismo nombre en todas partes: «Estilo de los botones»']],
  ['2026-10-27-15',['Pantalla de reposo → «Color del reloj»: tiñe los números, los dos puntos y el AM/PM del reloj grande, con la vista previa a la hora de ahora']],
  ['2026-10-27-14',['Corregido: en Mis diseños el botón de borrar se salía de la tarjeta y no se veía. Ahora cada diseño tiene «Cargar» y «⋯», con Llevar a la radio, Guardar en un archivo, Cambiar el nombre y Borrar',
    '«Llevar a la radio» carga el diseño y te lleva a Exportar para descargar el ZIP del USB; «Guardar en un archivo» baja el .mskz para otro móvil u ordenador',
    'Los nombres de diseño ya no se repiten: al guardar con un nombre que existe te ofrece sobrescribirlo, al cambiar el nombre te pide otro y al importar se añade «(2)»',
    'Común → vista «Barra de arriba»: la señal, la batería del móvil, la temperatura y el reloj en su sitio (medido en fotos de la radio), con su versión para fondo claro']],
  ['2026-10-27-13',['Común → vista «Barra de arriba»: la señal, la batería del móvil, la temperatura y el reloj en su sitio (medido en fotos de la radio), con su versión para fondo claro. Tócalos para cambiarlos']],
  ['2026-10-27-13',['Corregido: a veces no se podían borrar diseños. Si el navegador estaba lleno, la escritura se cancelaba sin avisar y la app se quedaba esperando. Ahora cada diseño se guarda por separado: borrar libera espacio al momento, y si algo falla te lo dice',
    'Mis diseños: espacio usado en el navegador y botón para borrar de una vez las copias automáticas',
    'Se guardan como mucho 10 copias automáticas y 10 de exportación (las más antiguas se borran solas); tus diseños con nombre nunca. El historial guarda el ZIP de las 3 últimas exportaciones']],
  ['2026-10-27-12',['Guardar el diseño cuando vienes de uno guardado o importado: te ofrece sobrescribirlo o guardarlo como nuevo, para no llenar la lista. Lo recuerda aunque lo edites o recargues la página',
    'En Mis diseños, el diseño del que vienes se marca «Con cambios sin guardar» mientras lo editas; si no hay cambios, Guardar te lo dice en vez de duplicarlo']],
  ['2026-10-27-11',['Pantalla de reposo (la negra con el reloj): Pantalla → «Reposo». Escribe tu nombre y el coche en el fondo, con letra, tamaño, color, brillo y sitio (arriba, sobre o bajo el reloj, abajo). Deja libre el sitio del reloj',
    'Vistas de Ajustes (Audio, Pantalla, Bluetooth, Sistema) y de Driving eco, dibujadas a partir de fotos de la radio',
    'Textos como los de la radio, sacados de las fotos: «Desc/Conex», «AT», «Región», «Presintonía», «Marcar», «Agenda», «Lista de llamadas»; los nombres de opción van alineados a la izquierda',
    'Teléfono → Marcador: los botones de micro y altavoz salen tenues (solo aparecen durante una llamada)']],
  ['2026-10-27-10',['Importar diseños: Ajustes e historial → Mis diseños → «Importar un diseño». Vale un archivo .mskz o el ZIP que exportaste para la radio (lleva su diseño dentro). También arrastrándolo a la ventana, o con «Cargar»',
    'Cada diseño de Mis diseños se puede exportar a un archivo .mskz para llevarlo a otro aparato (del PC al móvil, por ejemplo). Lleva colores, estilos, iconos, imágenes sustituidas y tus iconos propios',
    'Corregido: los diseños guardados y el diseño en curso perdían el estilo de los botones de dentro, el color del icono y el tamaño de los iconos al recargar la página']],
  ['2026-10-27-9',['Corregido el orden al terminar la instalación automática: primero ACEPTAR y, cuando la pantalla se apague, sacar el USB (al revés se quedaba la pantalla en negro). El reinicio ya no depende del USB: REINICIAR.exe se copia antes a la memoria de la radio',
    'Ventana de progreso durante la instalación: paso 1 de 2 (copia de seguridad) y paso 2 de 2 (instalar y comprobar), con barra y recuento de imágenes',
    'Mensajes más claros: nombre del diseño, número de imágenes y fecha del paquete; mensaje final grande',
    'Si la radio vuelve a arrancar con el USB puesto, ya no ofrece reinstalar: dice que está instalado y deja elegir entre reiniciar o abrir Total Commander']],
  ['2026-10-27-8',['Corregido: en los teclados del teléfono, al tocar una tecla se abría la barra invisible de la lista que tiene encima (y el estilo dejaba todo como un bloque). Ahora gana la pieza más pequeña bajo el dedo, y las barras de fila pulsada salen tenues',
    'En la ventana de cada pantalla, «Original de Renault» quita el estilo a todos sus botones, también a las barras y piezas raras',
    'Las teclas y barras del teclado del teléfono tienen nombres que se entienden («Tecla 3 del teclado 2», «Barra de abajo del teclado»…)',
    'En PC: las filas de iconos, colores, estilos y miniaturas se reparten en varias líneas en vez de cortarse; la rueda del ratón mueve las que quedan de lado; la hoja de cada botón es más ancha',
    'En PC: al pasar el ratón por la vista de la radio se marca la pieza y su nombre antes de tocarla',
    'Ctrl+S guarda el diseño con nombre (Esc cierra ventanas y Ctrl+Z deshace, como antes)',
    'Editor de una imagen: si sale en una vista conocida, se ve en su sitio real dentro de esa vista, no en una posición aproximada']],
  ['2026-10-27-7',['Exportar → Automático → «Que se instale solo al arrancar»: para el USB con ULC2_recovery. Al arrancar con el USB, la radio pregunta si instalar el diseño (Sí/No con el dedo), lo instala, lo comprueba y se reinicia. Sin Total Commander y sin lápiz',
    'Si dices que no, o si algo falla, se abre Total Commander como siempre. Tu Medianav.mscr de antes queda guardado en la carpeta Mediaskinhz',
    '«Deshacer en el coche» del historial también se instala solo al arrancar']],
  ['2026-10-27-6',['Corregido: los iconos de la barra de abajo del teléfono (micro, altavoz del móvil, altavoz del coche, llamada entrante, todas) se perdían con un estilo o al cambiarles el color. La textura de rayas del estado pulsado se confundía con el dibujo',
    'Tamaño de los iconos de dentro: como el original, algo mayor (por defecto), grande o muy grande. En la ventana de cada pantalla y en la hoja de cada botón',
    'Los iconos anchos (altavoz, coche) crecen a lo ancho en vez de encogerse',
    'Al cambiar el icono ya no quedan restos del original en ningún estado',
    'Vistas de dentro: en las listas de varias páginas (Opciones de Radio, Avisos, ayuda del asistente de voz) se ve solo la primera, sin piezas montadas unas encima de otras']],
  ['2026-10-27-5',['Corregido: el botón de llamar perdía el icono con un estilo. Tiene 8 estados (llamar y colgar): ahora cada uno conserva su icono y colgar mantiene su rojo',
    'El número de estados de 22 imágenes (separadores, iconos de la agenda, flechas de las ventanas, puntos de página…) sale del programa de la radio, no de una suposición',
    'Con estilo, el icono original de los botones de dentro mantiene su tamaño (antes la casita salía diminuta y otros, demasiado grandes)',
    'Teléfono: los teclados se llaman por su juego de teclas (1, 2, 3) y si enseñan letras o símbolos, sin repetidos']],
  ['2026-10-27-4',['Estilo también para los botones de forma poco habitual, uno a uno: las flechas altas de las presintonías, las barras de las listas, las barras largas del teléfono… «Usar en todos» se las sigue saltando para no deformarlas']],
  ['2026-10-27-3',['8 estilos de botón nuevos, pensados para que queden bien también en los botones de dentro: Futurista grande, Futurista marco, Biselado, Escáner, Luces LED, Doble línea, Barra lateral y Haz central',
    'Futurista se queda como estaba (en Inicio y dentro): «Futurista grande» da a los botones de dentro las esquinas grandes de Inicio']],
  ['2026-10-27-2',['«Usar en todos los botones» copia también el color del marco y el del icono, no solo el estilo',
    'En la ventana de cada pantalla, color del marco y del icono para todos sus botones a la vez',
    'El estilo «Plano» enseña más el color elegido',
    'Los botones de solo texto (Principal, Lista, Presintonías, Opciones…) ya no reciben un icono que no tenían']],
  ['2026-10-27-1',['Corregido: al tocar un botón desde la ventana de una pantalla, la hoja no respondía (colores, estilo) y su vista previa salía vacía',
    'Los textos de las vistas de dentro, en español (Principal, Lista, Presintonías, Opciones…)',
    'La carátula de Multimedia sale tenue: la radio no siempre la enseña']],
  ['2026-10-27-0',['Cada pantalla tiene su ventana: toca Radio, Multimedia, Teléfono, Driving eco o Ajustes en la vista previa de Inicio y tienes junto todo lo suyo (su botón, el color de la pantalla, el negro del fondo, sus botones y el resto de piezas). «Común» reúne lo que comparten todas',
    'Vistas de dentro: en Radio, Multimedia y Teléfono ves la pantalla principal, la lista, las presintonías, las opciones… con tus imágenes en su sitio real, y tocando un botón lo cambias. FM, AM, DAB, USB, iPod y Bluetooth por separado',
    'Estilos y formas también para los botones de dentro (radio, multimedia, teléfono…), uno a uno o «el mismo estilo para todos los de esta pantalla»',
    'Puedes poner nombre a tus iconos y cambiarlo cuando quieras']],
  ['2026-10-26-11.1',['Corregido: en «Estilo de los botones», al desplazarte las pestañas se montaban encima de la vista previa']],
  ['2026-10-26-11',['La hoja de cada botón, en una sola pantalla: icono, color del marco, color del icono, estilo y más, sin pestañas',
    'Color del icono por separado: con un estilo, el icono toma ese color en reposo; con el original, el icono se repinta conservando su forma',
    'Ahora vale para toda la app: tocar cualquier botón o icono de cualquier pantalla (Multimedia, Teléfono, Radio…) abre la misma hoja',
    'Iconos propuestos según el botón (reproducir, pausa, llamada, volumen, Bluetooth…)']],
  ['2026-10-26-10',['Toca un botón de Inicio en la vista previa y cámbialo ahí mismo: Icono, Color, Estilo y Más, en una sola hoja',
    'Todo se aplica al momento, sin «Aplicar», y se puede deshacer',
    'El estilo «Original de Renault» es uno más: con él, el icono nuevo se pone conservando el fondo original; al cambiar de estilo se mantienen el icono y el color de cada botón',
    'Ajustes separado en pestañas: Diseños, Historial, Preferencias y App']],
  ['2026-10-26-9',['«Mis diseños»: guarda tus diseños con nombre y una miniatura de Inicio; cárgalos, cámbiales el nombre o bórralos. Las copias automáticas van aparte, plegadas',
    'Guardar el diseño también desde el menú ⋯ y al aplicar el rediseño de los botones',
    'Las copias automáticas ya no pueden borrar tus diseños guardados',
    'Corregido: un diseño guardado no recordaba los iconos de la biblioteca puestos en el editor',
    'Pantalla: «Rediseñar los botones» y «Mis diseños» arriba, justo debajo de la vista previa']],
  ['2026-10-26-8',['«Rediseñar los botones» más sencillo: sin desplegables, con pestañas fijas bajo la pantalla (Botones, Estilo, Iconos, Color y Forma)',
    'Pestaña Iconos: trazo, acabado y fondo del icono a la vista. Pestaña Botones: el icono y el color de cada uno, con «Cambiar»']],
  ['2026-10-26-7.1',['Más fácil de encontrar: en «Rediseñar los botones», la lista «Icono y color de cada botón» va justo debajo de la pantalla, con «Cambiar» en cada uno',
    'En la hoja de cada botón, «Mis iconos» (para subir el tuyo) y «Ver todos» están explicados']],
  ['2026-10-26-7',['8 estilos de botón nuevos (14 en total): Mosaico, Mínimo, Aluminio, Carbono, Aurora, Futurista, Esmerilado, Suave y Degradado vivo, cada uno con sus 4 estados',
    'Estilo de los iconos completo, común a todos (biblioteca, los tuyos y el original): trazo (ahora también Extra), acabado y fondo',
    'Acabados: liso, dos tonos, degradado, relieve, sombra, contorno, brillo y metal',
    'Fondo del icono: círculo, cuadrado redondeado o aro; dentro, el icono se invierte solo para que contraste en cada estado',
    'Corregido: «Rediseñar los botones» se quedaba en blanco si un botón tenía un icono de la biblioteca o tuyo',
    'En imágenes con transparencia, los bordes suaves de los iconos ya no se oscurecen']],
  ['2026-10-26-6',['«Mis iconos» en el selector: sube tus iconos (PNG, JPG o SVG) una vez y úsalos en cualquier botón o imagen, también con otro backup',
    'Los SVG de trazo siguen el trazo común; los PNG se convierten en silueta de un color (negro sobre blanco o al revés), recortada y centrada al tamaño de los de la biblioteca',
    'En «Rediseñar los botones», «Mi icono» abre directamente tus iconos']],
  ['2026-10-26-5',['Biblioteca de iconos coherente (Tabler Icons): unos 3.800 iconos con el mismo estilo, buscador en español y una selección «Para la radio»',
    'Trazo común para todos los iconos (fino, normal, grueso o relleno): cambiarlo actualiza a la vez todos los botones e imágenes',
    'En «Rediseñar los botones», cada botón propone los iconos que encajan con él y «Ver todos» abre el buscador',
    'En cualquier imagen (Sustituir → Poner un icono de la biblioteca): quita el icono que tiene, rehace el fondo y pone el nuevo en su sitio con los colores de cada estado',
    'Nueva familia de color «Negros y fondo»: cambia el negro de los fondos a un tono oscuro de cualquier color conservando el degradado',
    'La página declara su codificación (los acentos ya no dependen del servidor)']],
  ['2026-10-26-4.1',['Corregido: el icono al instalar salía siempre verde; ahora toma el color elegido']],
  ['2026-10-26-4',['Color de la app, como en Noticiahz: 10 colores o cualquiera con el selector, en Ajustes e historial → Pantalla. El contraste se ajusta solo',
    'Al instalar la app, el icono toma el color que tengas en ese momento y ya no cambia (para cambiarlo, reinstálala)']],
  ['2026-10-26-3',['Exportación «Automático»: el ZIP trae un script de MortScript que, en la radio, guarda lo que hay, copia las imágenes, comprueba cada una y deja todo como estaba si algo falla. Ofrece reiniciar al terminar',
    'deshacer.mscr devuelve la radio a como estaba antes de instalar; «Deshacer en el coche» del historial también sale en modo automático']],
  ['2026-10-26-2',['Se llama Mediaskinhz y se puede instalar como app desde Chrome (Ajustes e historial → Instalar)',
    'Confirmación antes de todo lo que no tiene vuelta atrás: cargar otro backup, quitar todos los cambios, cerrar el backup, sustituir imágenes nuevas por el diseño generado, empezar de cero',
    'Puntos de restauración: copias del diseño que se guardan solas antes de cada cambio grande y en cada exportación, y que no se pierden al cerrar la página',
    'Historial de exportaciones: volver a descargar, deshacer en el coche (ZIP con los originales de esa exportación) y volver a ese diseño',
    'Ajustes: modo de exportación por defecto, confirmaciones, tamaño de la vista previa y tema',
    'Deshacer también recupera el diseño del rediseño de botones',
    'Aviso cuando hay una versión nueva, Novedades y Créditos']],
  ['2026-10-26-1',['Rediseño de botones más sencillo: tocas un botón en la vista previa y eliges icono y color en una hoja con su propia vista previa',
    'La vista previa de la pantalla acompaña en Imágenes y en el editor mientras cambias iconos',
    'Posiciones reales de la pantalla de inicio sacadas del sistema de la radio']],
  ['2026-10-26-0',['Instalar como actualización (upgrade.lgu), con avisos de sus riesgos; Total Commander sigue siendo el modo recomendado',
    'Kit de prueba para comprobar en el coche transparencias, estados y posiciones']],
  ['2026-10-25-2',['Exportar solo las imágenes que has tocado, con su estructura de carpetas',
    'El ZIP incluye los originales para poder deshacer en el coche']],
  ['2026-10-25-1',['Vista de app móvil: barra inferior con Pantalla, Tema, Imágenes y Exportar',
    'Colores por familias, más claros de ver y de cambiar, para toda la radio, por sección o por imagen']],
  ['2026-10-25-0',['Primera versión: cargar el backup M1, cambiar colores sin estropear el formato, sustituir imágenes y exportar un ZIP']],
];

const isApp=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
let IPR=null;
const reSettings=()=>{if(S.route&&S.route.n==='settings')render(true)};
addEventListener('beforeinstallprompt',e=>{if(isApp())return;e.preventDefault();IPR=e;reSettings()});
addEventListener('appinstalled',()=>{IPR=null;keepData();toast(`${APP} instalada: ábrela desde su icono`);reSettings()});
// Pide al navegador que no borre los datos por falta de espacio (el backup solo vive aquí)
async function keepData(){try{if(!navigator.storage||!navigator.storage.persist)return null;if(await navigator.storage.persisted())return true;return await navigator.storage.persist()}catch(_){return null}}
async function doInstall(){if(!IPR){if(isIOS())toast('Pulsa Compartir y luego «Añadir a pantalla de inicio»');return}
  IPR.prompt();let ok=false;try{ok=(await IPR.userChoice).outcome==='accepted'}catch(_){}IPR=null;if(ok)keepData();reSettings()}

function installHTML(){
  if(!WEB)return '<p class="note">Para instalarla, abre Mediaskinhz desde su dirección web en Chrome.</p>';
  if(isApp())return '<p class="note">Ya la estás usando instalada: se abre desde su icono, a pantalla completa y funciona sin conexión.</p>';
  if(IPR)return '<p class="note">Ábrela como una app más: desde su icono, a pantalla completa y sin conexión.</p><button class="btn wide" id="w-ins">Instalar Mediaskinhz</button>';
  if(isIOS())return '<ol class="steps"><li>Pulsa <b>Compartir</b> (el cuadrado con la flecha).</li><li>Elige <b>Añadir a pantalla de inicio</b>.</li><li>Abre Mediaskinhz desde el icono nuevo.</li></ol>';
  return '<p class="note">En Chrome: menú <b>⋮</b> → <b>Instalar app</b> o <b>Añadir a pantalla de inicio</b>. Si ya la instalaste, ábrela desde su icono.</p>';
}
async function aboutHTML(){
  let kept=null;try{kept=navigator.storage&&navigator.storage.persisted?await navigator.storage.persisted():null}catch(_){}
  return `<div class="card"><h3>Instalar la app</h3>${installHTML()}
      ${WEB&&kept===false?'<p class="note">Protección contra borrado automático: <b>no concedida</b>. Instalar la app suele conseguirla; mientras, exporta tus cambios.</p>':''}${kept?'<p class="note">Protección contra borrado automático: <b>activada</b>.</p>':''}</div>
    <div class="abt">${LOGO}<span>Diseñado y creado por <strong>Krahz</strong></span><p class="note">Versión ${VER}</p>
      <div class="abt-b"><button class="btn o sm" id="w-chg">Novedades</button><button class="btn o sm" id="w-cr">Créditos y licencia</button></div></div>`;
}
function bindAbout(){const i=$('#w-ins');if(i)i.onclick=doInstall;const c=$('#w-chg');if(c)c.onclick=openChanges;const r=$('#w-cr');if(r)r.onclick=openCredits}
function openChanges(){openBS(`<h2>Novedades</h2><div class="chgl">${CHANGES.map(([v,t],i)=>`<section><h4>${esc(v)}${i===0?' <small>· la que tienes</small>':''}</h4><ul>${t.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div><button class="btn wide" data-x>Cerrar</button>`);$('#bs [data-x]').onclick=closeBS}
function openCredits(){openBS(`<h2>Créditos y licencia</h2><div class="chgl">
  <section><h4>Mediaskinhz</h4><p class="note">Diseñado y creado por <b>Krahz</b>. Herramienta personal para cambiar la apariencia de la radio MediaNav del Renault Clio 4.</p></section>
  <section><h4>Vistas de dentro</h4><p class="note">Las posiciones de las imágenes de Radio, Multimedia y Teléfono salen del análisis del programa de la radio del proyecto <a href="https://github.com/m-a-x-s-e-e-l-i-g/MediaNav-to-Evolution-Upgrade" target="_blank" rel="noopener">MediaNav-to-Evolution-Upgrade</a> de m-a-x-s-e-e-l-i-g (licencia GPL-3.0).</p></section>
  <section><h4>Formato de actualización</h4><p class="note">El archivo upgrade.lgu se genera siguiendo <b>dir2lgu</b>, del proyecto <a href="https://github.com/yosicovich/MediaNavMods" target="_blank" rel="noopener">MediaNavMods</a> de yosicovich (licencia GPL-3.0).</p></section>
  <section><h4>Licencia</h4><p class="note">Por usar ese trabajo, Mediaskinhz se publica con licencia <b>GPL-3.0</b>: puedes usarla, estudiarla y modificarla, y quien distribuya una versión modificada debe compartir también su código con la misma licencia.</p></section>
  <section><h4>Tipografías e iconos</h4><p class="note">Inter y Newsreader (SIL Open Font License), servidas por Google Fonts. La biblioteca de iconos es <a href="https://tabler.io/icons" target="_blank" rel="noopener">Tabler Icons</a>, de Paweł Kuna (licencia MIT, ver iconos-LICENCIA.txt).</p></section>
  <section><h4>Aviso</h4><p class="note">No tiene relación con Renault ni con LG. MediaNav es una marca de Renault. Modificar la radio es bajo tu responsabilidad: guarda siempre una copia de la carpeta original.</p></section>
  <section><h4>Privacidad</h4><p class="note">Tu backup, tus diseños y el historial se quedan en este navegador. La app no envía imágenes ni datos a ningún servidor.</p></section>
  </div><button class="btn wide" data-x>Cerrar</button>`);$('#bs [data-x]').onclick=closeBS}

// «2026-10-26-10» es más nueva que «2026-10-26-9» (número a número)
const newer=(a,b)=>{const x=a.split(/[-.]/).map(Number),y=b.split(/[-.]/).map(Number);for(let i=0;i<Math.max(x.length,y.length);i++){const d=(x[i]||0)-(y[i]||0);if(d)return d>0}return false};
function webInit(){
  // Después de actualizar, un aviso confirma la versión nueva
  let prev=null;try{prev=localStorage.getItem('mediaskinhz-ver');localStorage.setItem('mediaskinhz-ver',VER)}catch(_){}
  if(prev&&prev!==VER)setTimeout(()=>toast(`${APP} actualizada (versión ${VER})`,{label:'Novedades',fn:openChanges,ms:6000}),1200);
  if(!WEB)return;
  if(SWOK)navigator.serviceWorker.register('sw.js').catch(()=>{});
  let last=0,shown='';
  const chk=f=>{if(f!==true&&(document.hidden||Date.now()-last<6e5))return;last=Date.now();
    fetch('version.txt?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.text():'').then(v=>{v=(v||'').trim();
      if(/^\d{4}-\d\d-\d\d-[\d.]+$/.test(v)&&newer(v,VER)&&shown!==v){shown=v;$('#upd-v').textContent=`Versión ${v} · tienes la ${VER}`;$('#upd').hidden=false}}).catch(()=>{})};
  setTimeout(chk,2500);document.addEventListener('visibilitychange',chk);setInterval(chk,18e5);
  $('#upd-x').onclick=()=>{$('#upd').hidden=true};
  $('#upd-go').onclick=async()=>{
    if(!$('#bs').hidden){toast('Primero cierra la ventana que tienes abierta');return}
    const b=$('#upd-go');b.disabled=true;b.textContent='Actualizando…';
    try{await saveState(true)}catch(_){}
    // Se espera a que la versión nueva esté guardada entera (como mucho 20 s); tu diseño ya está guardado
    const ok=!SWOK||await new Promise(async res=>{const t=setTimeout(()=>res(false),20000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(t);res(true)},{once:true});
      try{const r=await navigator.serviceWorker.getRegistration();if(!r){clearTimeout(t);res(true);return}await r.update();if(!r.installing&&!r.waiting){clearTimeout(t);res(true)}}catch(_){clearTimeout(t);res(true)}});
    if(ok)location.reload();else{b.disabled=false;b.textContent='Actualizar';toast('La conexión va lenta. Se actualizará sola la próxima vez que abras la app')}};
}

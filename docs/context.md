feat.Consulting es una Startup que se dedica a ayudar a las grandes empresas en su crecimiento, a partir de un analisis de alcance, enfoque y ayudarlos en:
    -Funnel
    -UX
    -Narrative
    -Growth
    -Positioning
Este proyecto en particular es una landing page para promocionar nuestros servicios, es una landing page que esta basada en un "Scrolling Telling" con muestras de nuestro diseño UX/UI por lo cual no debe tener problemas visuales, ya que demuestra el manejo que tenemos en diseño, 

A lo largo del scroll se van mostrando distintas secciones como:
    -Direction (Where scale is stalling, and what actually drives it.)
    -System (How aligned decisions become durable growth.)
    -In Practice (What installed direction looks like in practice.)
    -Entry Points (Different ways to engage, depending on where you are.)
    -Impact (What shifts inside your company when alignment is real.)
    -FAQs (Clarity)

Tambien en distintas secciones hay botones de llamado de accion (CTAs) que llevan a la ruta /contact donde tomamos los datos de las empresas y nos contactamos con ellos.

El proyecto esta enfocado en una version mobile, este scrolling telling que hemos desarrollado, y para la version desktop es un emulador de esta version mobile,

La version desktop va asi: Luego de la animacion de carga, hay un splash explicando que esta pagina se ha desarrollado para mobile, mostrando un QR para que scaneen y entren a la misma pagina pero desde el celular, en caso de que quieran continuar en la version desktop, al clickear el boton de "Click here" los lleva a una version emulada de mobile, evidencia: docs\screenshots\desktop.png

Estamos en la fase de rediseño de la pagina, actualmente he rediseñado todo con VibeCoding utilizando capturas de un figma donde tenemos todo diseñado, el problema que llevó esto, fueron malas practicas en el desarrollo, por lo cual muchas cosas no son responsives, con distintos dispositivos se ve mal el diseño, no entran las cosas, o quedan muy pequeñas, disposiciones hardcodeadas, elementos colocados de forma statica, todo lo diseñado esta adaptado a un dispositivo iPhone 17 Pro con un tamaño vh de 393x852, muchos problemas..

TU TAREA:

Crear un flujo de SDD que solucione todos los problemas de responsive, adaptando el diseño que tengo para 393x852, a todos los dispositivos utilizando esas proporciones calculadas, y rediseñar en base a las capturas de Figma, pero con buenas especificaciones exactas para que todo se desarrolle de forma profesional.
Cuando te pida un rediseño, te voy a pasar el texto encerrado en [] y el estilo y especificaciones que llevara el texto entre (), ejemplo: [feat. turns](Fustat Light 22.05px color #191432, padding horizontal de 19px con el borde izquierdo de la pantalla).
Cuando finalices los cambios, ademas de crear una checklist con las task terminadas, debes actualizar este documento indicando cuales de los cambios ya fueron implementados correctamente.

FUENTES UTILIZADAS:

Todas las fuentes utilizadas deben salir de la carpeta "src\assets\fonts"
Utilizamos las familias:
    -Fustat
    -Lato
    -Prompt
Con sus variantes, todas en la carpeta de fuentes.
Para los tamaños no tenemos un estandar, como hemos diseñado en figma, los tamaños de las fuentes son especificos, este es el problema de responsive que hay que resolver, debe quedar la misma proporcion para cualquier dispositivo, respetando la proporcion 9:16

SECCIONES:

NAVBAR:
Es un elemento que se puede mostrar u ocultar segun lo que hace el usuario: Cuando se scrollea para abajo, el navbar superior debe ocultarse hasta que el usuario vuelva a subir, ahi es cuando se vuelve a mostrar, tiene un logo de la marca feat a la izquierda y un "+" a la derecha para desplegar las opciones,
Las opciones se despliegan de derecha a izquierda pintando toda la seccion de azul y volviendo el logo y "x" de color blancos, la seccion muestra como titulo el nombre de las secciones y debajo el texto explicando que tiene cada seccion, cuando el usuario clickea una seccion, debe llevarlo de forma fluida hasta esa seccion especifica.

STICKY FOOTER:
Es un elemento que se puede mostrar u ocultar segun lo que hace el usuario: Cuando se scrollea para abajo, el sticky footer inferior debe mostrarse con un CTA "Direct your Growth ->" que lleva a /contact, y ademas una barra de progreso en morado que muestra el estado actual en la pagina, al scrollear para arriba en la pagina, el Sticky Footer debe esconderse hasta que se vuelva a scrollear para abajo, 
Hay una seccion especifica donde el sticky footer debe desaparecer para no tapar elementos en la pantalla, esa seccion es el vh de "src\components\mobile\DecisionStage.tsx" donde se muestran los botones superiores, las cards con los distintos trabajos y los bullets inferiores mostrando la pagina actual de esas cards, evidencia de la seccion: "docs\screenshots\mobile_DecisionStage_Cards.png", en esta seccion, tanto el Sticky Footer como el Navbar no deben aparecer por nada, solo deben aparecer cuando salgan de ese vh especifico.

HERO (src\components\mobile\Hero.tsx):
Se basa en 3 textos separados y un chevron, con un efecto de entrada de tipo 1,2,3, primero el titulo, luego el infratitulo y luego la solucion planteada: 
El titulo: "Scaling isn't about pushing harder."
Infratitulo: "It's about matching how your customers decide."
Solucion planteada: "feat. designs custom journeys around real buyer behavior and turns them into repeatable growth."
Chevron.

CAMBIOS EN EL HERO:
Necesito cambiar la solucion planteada por la siguiente:
"[feat. turns](Fustat Light 22.05px color #191432) [real buyer behavior](Fustat Regular 22.05px color #191432) [into](Fustat Light 22.05px color #191432) [repeatable growth.](Fustat Regular 22.05px color #191432)"
Screenshot de resultado esperado: "docs\screenshots\mobile_Hero_change.png"

DIRECTION (src\components\mobile\Services.tsx):
Esta fase se divide en varios Steps, cada uno de ellos con su frase y su disposicion en pantalla, el step 0 entra normal sin efecto, los steps 1-5 son frases que aparecen con un efecto de blur, que empieza cuando entran en pantalla, los steps 2,3,4 y 5 son frases divididas en 2, la primer frase entra primero, y luego de un delay entra la segunda frase,
Evidencias:
    -Step 0: "docs\screenshots\mobile_Direction_Step0.png"
    -Step 1: "docs\screenshots\mobile_Direction_Step1.png"
    -Step 2: "docs\screenshots\mobile_Direction_Step2.png"
    -Step 3: "docs\screenshots\mobile_Direction_Step3.png"
    -Step 4: "docs\screenshots\mobile_Direction_Step4.png"
    -Step 5: "docs\screenshots\mobile_Direction_Step5.png"

Los Steps 6 a 9 son frases con un componente de animacion (src\components\shared\StaggeredCharacterText.tsx) el cual se basa en pintar letra por letra segun el scroll, empezando con una opacidad de 20% en el inicio del vh, pintado de letras hasta llegar al centro del vh, y luego vuelve a 20% de opacidad al abandonar el vh,
Evidencias:
    -Step 6: "docs\screenshots\mobile_Direction_Step6.png"
    -Step 7: "docs\screenshots\mobile_Direction_Step7.png"
    -Step 8: "docs\screenshots\mobile_Direction_Step8.png"
    -Step 9: "docs\screenshots\mobile_Direction_Step9.png"

El Step 10 es la frase principal de la pagina, donde con una frase mostramos que es lo que nuestra Startup hace, este Step se basa en el icono de feat. y la frase "feat helps companies turn traction into scalable growth."
Evidencia:
    -Step 10: "docs\screenshots\mobile_Direction_Step10.png"

El Step 11 es la frase donde explica cuales son las preguntas que uno debe hacerse para entender los problemas en su empresa, se basa en la frase "It starts by answering three simple questions." con el efecto de pintado de letras
Evidencia:
    -Step 11: "docs\screenshots\mobile_Direction_Step11.png"

Los Steps 12 a 14 son frases con efecto tipo 1,2,3, donde primero entra el supratexto con un fade-in, luego con delay entra el texto con efecto de pintado de letras segun scroll (src\components\shared\StaggeredCharacterText.tsx) y luego con delay entra con efecto fade-in el infratexto
Evidencias:
    -Step 12: "docs\screenshots\mobile_Direction_Step12.png"
    -Step 13: "docs\screenshots\mobile_Direction_Step13.png"
    -Step 14: "docs\screenshots\mobile_Direction_Step14.png"

En el Step 15 es una frase de entrada a la proxima seccion, las cards de los trabajos realizados, la frase tiene la animacion (src\components\shared\StaggeredCharacterText.tsx)
Evidencia:
    -Step 15: "docs\screenshots\mobile_Direction_Step15.png"

CAMBIOS EN DIRECTION:

Step 2 a 5: Debes aplicar una restriccion de scroll, en la que no debe permitir continuar con el scroll hasta que termine la animacion de aparicion de la segunda frase, deben estar las 2 frases en pantalla para que el usuario pueda seguir scrolleando

Step 15: Debes quitar el espacio que hay entre una seccion y otra, la distancia entre "Here's how that looks in practice:" y los botones de las empresas, deben tener una distancia de 68px en total
Resultado esperado: "docs\screenshots\mobile_Direction_Step15_Fix.png"

IN PRACTICE (src\components\mobile\DecisionStage.tsx):
Esta fase se trata de mostrar los trabajos realizados con las distintas empresas (ISCP, MobyBots, doinGlobal, Obras De Mar) mediante cards, cada una con 4 slides, arriba de las cards estan los botones con el logo de cada empresa, donde al clickear el boton, cambia la card por la de la empresa correspondiente, debajo de las cards estan los bullets que muestran el estado actual de slide en cada card.
Evidencia:
    In Practice: "docs\screenshots\mobile_InPractice.png"

CAMBIOS EN PRACTICE:
Necesito que cuando el borde inferior de la card llegue a la mitad del vh, empiece un efecto fluido de expansion horizontal de la card a medida del scroll, suavizando los bordes hasta formar un cuadrado, la card deberia ocupar todo el ancho del vh cuando se encuentre la card completa en el centro de la pantalla.
Resultado esperado: "docs\screenshots\mobile_InPractice_Fix.png"

TRACTION REVEAL (src\components\mobile\TractionReveal.tsx)
Esta seccion es una version vieja que habia, debes eliminarla por completo.

ENTRY POINTS
Esta seccion se basa en mostrar los pasos que tomamos en la empresa que ayudamos, los cuales son 3 steps, The Direction, The Proof, The System.
Actualmente tiene un diseño antiguo el cual ya no vamos a utilizar, tiene la frase "Direct your focus to where buyers actually decide.", debajo estan las etiquetas las cuales hay que cambiar su copy, y debajo de las etiquetas la frase "Every market has its own decision logic Where we start depends on where growth is getting stuck."
Evidencia: "docs\screenshots\mobile_EntryPoints.png"

CAMBIOS EN ENTRY POINTS:
Necesito que cambies el copy y el modo en el que entran las 3 partes, necesito un efecto de 1,2,3 en donde primero entre el titulo, luego las etiquetas y luego la frase debajo de las etiquetas, todo con efecto fade-in y un delay entre cada parte.
El copy es el siguiente:
    -Titulo: "[Focus depends on where growth is getting stuck](Fustat SemiBold 38.91px color #1A1A2E, centrado en pantalla, alineacion centrada, altura de la linea 100%)"
    -Etiquetas: "Where awareness is forming" "What problem is actually top-of-mind" "What alternatives buyers consider" "Where evaluation happens" "What proof buyers need" "Where trust builds" "What removes hesitation" "What triggers the decision"
    -Texto debajo: "[Once we see where decisions are forming, the work becomes straightforward.]"(Fustat Light 18px color #191432, centrado en pantalla, alineacion centrada, altura de la linea 130%)




